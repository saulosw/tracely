import { describe, expect, it, vi } from 'vitest'

import { fakeAccount } from '../fakes/fakes.js'
import { commitDetailFixture, commitFixture } from '../fixtures/github.js'

import type { Octokit } from '@octokit/rest'

import type { Project, SourceActivity } from '../../src/domain/index.js'
import type { GithubCommit } from '../../src/infra/providers/index.js'


let octokit: Octokit

vi.mock('../../src/infra/providers/github/octokitFactory.js', () => ({
  createOctokit: () => octokit,
}))

const { createGithubActivityProvider } = await import(
  '../../src/infra/providers/github/githubActivityProvider.js'
)

const project: Project = {
  id: 'project-1',
  connectionId: 'conn-1',
  provider: 'github',
  externalId: '1001',
  name: 'hello-world',
  fullName: 'octocat/hello-world',
  ownerLogin: 'octocat',
  description: null,
  visibility: 'private',
  isFork: false,
  isArchived: false,
  defaultBranch: 'main',
  primaryLanguage: 'TypeScript',
  providerCreatedAt: null,
  providerPushedAt: null,
  lastSyncedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const commit = (sha: string): GithubCommit =>
  ({ ...commitFixture, sha }) as unknown as GithubCommit

const stubOctokit = (input: {
  defaultBranch: GithubCommit[]
  branches?: string[]
  ahead?: Record<string, GithubCommit[]>
}) => {
  const detailRequests: string[] = []
  const listCommits = () => undefined

  const stub = {
    repos: {
      listCommits,
      listReleases: () => undefined,
      listBranches: () =>
        Promise.resolve({ data: (input.branches ?? ['main']).map((name) => ({ name })) }),
      getCommit: ({ ref }: { ref: string }) => {
        detailRequests.push(ref)
        return Promise.resolve({ data: commitDetailFixture })
      },
      compareCommitsWithBasehead: ({ basehead }: { basehead: string }) => {
        const branch = basehead.slice(basehead.indexOf('...') + '...'.length)
        return Promise.resolve({ data: { commits: input.ahead?.[branch] ?? [] } })
      },
    },
    pulls: { list: () => undefined },
    issues: { listForRepo: () => undefined },
    paginate: {
      iterator: (route: unknown) => ({
        async *[Symbol.asyncIterator]() {
          yield { data: route === listCommits ? input.defaultBranch : [] }
        },
      }),
    },
  }

  octokit = stub as unknown as Octokit
  return { detailRequests }
}

const collect = async (): Promise<SourceActivity[]> => {
  const activities: SourceActivity[] = []
  const provider = createGithubActivityProvider()
  for await (const batch of provider.fetchProjectActivities({
    accessToken: 'token',
    project,
    account: fakeAccount,
    since: null,
  })) {
    activities.push(...batch)
  }
  return activities
}

describe('githubActivityProvider commits', () => {
  it('records the branch a commit actually lives on', async () => {
    stubOctokit({
      defaultBranch: [commit('merged-1')],
      branches: ['main', 'feat/insights'],
      ahead: { 'feat/insights': [commit('unmerged-1')] },
    })

    const activities = await collect()

    expect(activities.map((activity) => activity.externalId)).toEqual(['merged-1', 'unmerged-1'])
    expect(activities.map((activity) => activity.details)).toMatchObject([
      { branch: 'main' },
      { branch: 'feat/insights' },
    ])
  })

  it('keeps a commit on the default branch when the side branch also carries it', async () => {
    stubOctokit({
      defaultBranch: [commit('shared')],
      branches: ['main', 'feat/insights'],
      ahead: { 'feat/insights': [commit('shared')] },
    })

    const activities = await collect()

    expect(activities).toHaveLength(1)
    expect(activities[0]?.details).toMatchObject({ branch: 'main' })
  })

  it('leaves out commits on a side branch that someone else wrote', async () => {
    const stranger = { ...commitFixture, sha: 'theirs', author: { login: 'someone', id: 99 } }
    stubOctokit({
      defaultBranch: [],
      branches: ['main', 'feat/theirs'],
      ahead: { 'feat/theirs': [stranger as unknown as GithubCommit] },
    })

    await expect(collect()).resolves.toHaveLength(0)
  })

  it('spends the diff budget on the newest commits instead of dropping every diff', async () => {
    const commits = Array.from({ length: 201 }, (_unused, index) => commit(`sha-${index}`))
    const { detailRequests } = stubOctokit({ defaultBranch: commits })

    const activities = await collect()

    expect(detailRequests).toHaveLength(200)
    expect(activities[0]?.details).toMatchObject({ filesTruncated: false, additions: 120 })
    expect(activities[200]?.details).toMatchObject({ filesTruncated: true, additions: null })
  })
})
