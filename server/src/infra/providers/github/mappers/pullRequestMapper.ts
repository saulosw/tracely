import { mapActor } from './actorMapper.js'

import type { RestEndpointMethodTypes } from '@octokit/rest'

import type { ProviderAccount, SourceActivity } from '../../../../domain/index.js'


export type GithubPullRequest =
  RestEndpointMethodTypes['pulls']['list']['response']['data'][number]

export type GithubPullRequestDetail =
  RestEndpointMethodTypes['pulls']['get']['response']['data']

const SUMMARY_LIMIT = 500

export const mapPullRequest = (input: {
  pull: GithubPullRequest
  detail: GithubPullRequestDetail | null
  account: ProviderAccount
}): SourceActivity => {
  const { pull, detail, account } = input

  return {
    provider: 'github',
    type: 'pull_request',
    externalId: String(pull.id),
    title: pull.title,
    summary: pull.body ? pull.body.slice(0, SUMMARY_LIMIT) : null,
    url: pull.html_url,
    actor: mapActor(pull.user, account),
    occurredAt: new Date(pull.merged_at ?? pull.closed_at ?? pull.created_at),
    details: {
      kind: 'pull_request',
      number: pull.number,
      state: pull.state === 'open' ? 'open' : 'closed',
      isDraft: Boolean(pull.draft),
      merged: Boolean(pull.merged_at),
      createdAt: pull.created_at,
      mergedAt: pull.merged_at ?? null,
      baseBranch: pull.base.ref,
      headBranch: pull.head.ref,
      additions: detail?.additions ?? null,
      deletions: detail?.deletions ?? null,
      changedFiles: detail?.changed_files ?? null,
      commits: detail?.commits ?? null,
      labels: pull.labels.map((label) => label.name).filter((name): name is string => Boolean(name)),
      comments: detail?.comments ?? 0,
    },
  }
}
