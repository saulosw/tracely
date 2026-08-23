import { createOctokit } from './octokitFactory.js'
import { fetchGithubAccount } from './githubAccount.js'
import { translateGithubError } from './githubErrors.js'
import {
  mapCommit,
  mapIssue,
  mapPullRequest,
  mapRelease,
  mapRepository,
} from './mappers/index.js'

import type { Octokit } from '@octokit/rest'

import type {
  ActivityProvider,
  FetchProjectActivitiesInput,
  SourceActivity,
} from '../../../domain/index.js'
import type { GithubCommit, GithubCommitDetail } from './mappers/index.js'


const COMMIT_DETAIL_LIMIT = 200
const PR_DETAIL_LIMIT = 100
const BRANCH_LIMIT = 20
const BATCH_SIZE = 50

const splitFullName = (fullName: string): { owner: string; repo: string } => {
  const separator = fullName.indexOf('/')
  return { owner: fullName.slice(0, separator), repo: fullName.slice(separator + 1) }
}

const hasStatus = (error: unknown, status: number): boolean =>
  (error as { status?: number }).status === status

const listDefaultBranchCommits = async (
  octokit: Octokit,
  input: FetchProjectActivitiesInput,
): Promise<GithubCommit[]> => {
  const { owner, repo } = splitFullName(input.project.fullName)
  const collected: GithubCommit[] = []
  try {
    const iterator = octokit.paginate.iterator(octokit.repos.listCommits, {
      owner,
      repo,
      author: input.account.login,
      per_page: 100,
      ...(input.since ? { since: input.since.toISOString() } : {}),
    })
    for await (const response of iterator) {
      collected.push(...response.data)
    }
  } catch (error) {
    if (hasStatus(error, 409)) {
      return []
    }
    throw error
  }
  return collected
}

const listSideBranches = async (
  octokit: Octokit,
  input: FetchProjectActivitiesInput,
): Promise<string[]> => {
  const { owner, repo } = splitFullName(input.project.fullName)
  if (!input.project.defaultBranch) {
    return []
  }
  try {
    const { data } = await octokit.repos.listBranches({ owner, repo, per_page: 100 })
    return data
      .map((branch) => branch.name)
      .filter((name) => name !== input.project.defaultBranch)
      .slice(0, BRANCH_LIMIT)
  } catch (error) {
    if (hasStatus(error, 409)) {
      return []
    }
    throw error
  }
}

// Comparing against the default branch costs one request per branch and returns
// only what the default branch listing cannot see: work that was never merged.
const listBranchOnlyCommits = async (
  octokit: Octokit,
  input: FetchProjectActivitiesInput,
  branch: string,
): Promise<GithubCommit[]> => {
  const { owner, repo } = splitFullName(input.project.fullName)
  try {
    const { data } = await octokit.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead: `${input.project.defaultBranch}...${branch}`,
      per_page: 100,
    })
    return data.commits.filter((commit) => {
      if (commit.author?.login !== input.account.login) {
        return false
      }
      const authoredAt = commit.commit.author?.date
      return !input.since || (authoredAt !== undefined && new Date(authoredAt) >= input.since)
    })
  } catch (error) {
    if (hasStatus(error, 404)) {
      return []
    }
    throw error
  }
}

async function* fetchCommits(
  octokit: Octokit,
  input: FetchProjectActivitiesInput,
): AsyncGenerator<SourceActivity[]> {
  const { owner, repo } = splitFullName(input.project.fullName)
  const groups: { branch: string | null; commits: GithubCommit[] }[] = [
    { branch: input.project.defaultBranch, commits: await listDefaultBranchCommits(octokit, input) },
  ]
  for (const branch of await listSideBranches(octokit, input)) {
    groups.push({ branch, commits: await listBranchOnlyCommits(octokit, input, branch) })
  }

  const seen = new Set<string>()
  let detailBudget = COMMIT_DETAIL_LIMIT
  let batch: SourceActivity[] = []
  for (const group of groups) {
    for (const commit of group.commits) {
      if (seen.has(commit.sha)) {
        continue
      }
      seen.add(commit.sha)
      let detail: GithubCommitDetail | null = null
      if (detailBudget > 0) {
        detailBudget -= 1
        detail = (await octokit.repos.getCommit({ owner, repo, ref: commit.sha })).data
      }
      batch.push(mapCommit({ commit, detail, branch: group.branch, account: input.account }))
      if (batch.length >= BATCH_SIZE) {
        yield batch
        batch = []
      }
    }
  }
  if (batch.length > 0) {
    yield batch
  }
}

async function* fetchPullRequests(
  octokit: Octokit,
  input: FetchProjectActivitiesInput,
): AsyncGenerator<SourceActivity[]> {
  const { owner, repo } = splitFullName(input.project.fullName)
  let detailBudget = PR_DETAIL_LIMIT
  const iterator = octokit.paginate.iterator(octokit.pulls.list, {
    owner,
    repo,
    state: 'all',
    sort: 'updated',
    direction: 'desc',
    per_page: 100,
  })

  for await (const response of iterator) {
    const batch: SourceActivity[] = []
    let reachedCursor = false
    for (const pull of response.data) {
      if (input.since && new Date(pull.updated_at) < input.since) {
        reachedCursor = true
        break
      }
      if (pull.user?.login !== input.account.login) {
        continue
      }
      let detail = null
      if (detailBudget > 0) {
        detailBudget -= 1
        detail = (await octokit.pulls.get({ owner, repo, pull_number: pull.number })).data
      }
      batch.push(mapPullRequest({ pull, detail, account: input.account }))
    }
    if (batch.length > 0) {
      yield batch
    }
    if (reachedCursor) {
      return
    }
  }
}

async function* fetchIssues(
  octokit: Octokit,
  input: FetchProjectActivitiesInput,
): AsyncGenerator<SourceActivity[]> {
  const { owner, repo } = splitFullName(input.project.fullName)
  const iterator = octokit.paginate.iterator(octokit.issues.listForRepo, {
    owner,
    repo,
    state: 'all',
    sort: 'updated',
    direction: 'desc',
    creator: input.account.login,
    per_page: 100,
  })

  for await (const response of iterator) {
    const batch: SourceActivity[] = []
    let reachedCursor = false
    for (const issue of response.data) {
      if (input.since && new Date(issue.updated_at) < input.since) {
        reachedCursor = true
        break
      }
      if (issue.pull_request) {
        continue
      }
      batch.push(mapIssue({ issue, account: input.account }))
    }
    if (batch.length > 0) {
      yield batch
    }
    if (reachedCursor) {
      return
    }
  }
}

async function* fetchReleases(
  octokit: Octokit,
  input: FetchProjectActivitiesInput,
): AsyncGenerator<SourceActivity[]> {
  const { owner, repo } = splitFullName(input.project.fullName)
  const iterator = octokit.paginate.iterator(octokit.repos.listReleases, {
    owner,
    repo,
    per_page: 100,
  })

  for await (const response of iterator) {
    const batch: SourceActivity[] = []
    let reachedCursor = false
    for (const release of response.data) {
      const occurredAt = new Date(release.published_at ?? release.created_at)
      if (input.since && occurredAt < input.since) {
        reachedCursor = true
        break
      }
      batch.push(mapRelease({ release, account: input.account }))
    }
    if (batch.length > 0) {
      yield batch
    }
    if (reachedCursor) {
      return
    }
  }
}

export const createGithubActivityProvider = (): ActivityProvider => ({
  async fetchAccount(accessToken) {
    try {
      return await fetchGithubAccount(createOctokit(accessToken))
    } catch (error) {
      throw translateGithubError(error)
    }
  },

  async *fetchProjects(accessToken) {
    try {
      const octokit = createOctokit(accessToken)
      const iterator = octokit.paginate.iterator(octokit.repos.listForAuthenticatedUser, {
        affiliation: 'owner,collaborator,organization_member',
        sort: 'pushed',
        per_page: 100,
      })
      for await (const response of iterator) {
        yield response.data.map(mapRepository)
      }
    } catch (error) {
      throw translateGithubError(error)
    }
  },

  async *fetchProjectActivities(input) {
    try {
      const octokit = createOctokit(input.accessToken)
      yield* fetchCommits(octokit, input)
      yield* fetchPullRequests(octokit, input)
      yield* fetchIssues(octokit, input)
      yield* fetchReleases(octokit, input)
    } catch (error) {
      throw translateGithubError(error)
    }
  },
})
