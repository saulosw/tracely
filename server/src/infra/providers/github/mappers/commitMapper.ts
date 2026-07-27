import { mapActor } from './actorMapper.js'

import type { RestEndpointMethodTypes } from '@octokit/rest'

import type { ProviderAccount, SourceActivity } from '../../../../domain/index.js'


export type GithubCommit =
  RestEndpointMethodTypes['repos']['listCommits']['response']['data'][number]

export type GithubCommitDetail =
  RestEndpointMethodTypes['repos']['getCommit']['response']['data']

const TITLE_LIMIT = 140

const firstLine = (text: string): string => {
  const line = text.split('\n', 1)[0] ?? text
  return line.slice(0, TITLE_LIMIT)
}

export const mapCommit = (input: {
  commit: GithubCommit
  detail: GithubCommitDetail | null
  branch: string | null
  account: ProviderAccount
}): SourceActivity => {
  const { commit, detail, branch, account } = input
  const message = commit.commit.message
  const authorEmail = commit.commit.author?.email ?? null
  const actor = mapActor(commit.author, account)
  const isConnectedUser =
    actor.isConnectedUser || (authorEmail !== null && account.emails.includes(authorEmail))
  const occurredAtRaw = commit.commit.author?.date ?? commit.commit.committer?.date
  const files =
    detail?.files?.map((file) => ({
      path: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
    })) ?? null

  return {
    provider: 'github',
    type: 'commit',
    externalId: commit.sha,
    title: firstLine(message),
    summary: null,
    url: commit.html_url,
    actor: { ...actor, isConnectedUser },
    occurredAt: occurredAtRaw ? new Date(occurredAtRaw) : new Date(),
    details: {
      kind: 'commit',
      sha: commit.sha,
      message,
      authorName: commit.commit.author?.name ?? null,
      authorEmail,
      branch,
      additions: detail?.stats?.additions ?? null,
      deletions: detail?.stats?.deletions ?? null,
      filesChanged: files?.length ?? null,
      files,
      filesTruncated: detail === null,
    },
  }
}
