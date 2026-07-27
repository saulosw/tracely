import { mapActor } from './actorMapper.js'

import type { RestEndpointMethodTypes } from '@octokit/rest'

import type { ProviderAccount, SourceActivity } from '../../../../domain/index.js'


export type GithubIssue =
  RestEndpointMethodTypes['issues']['listForRepo']['response']['data'][number]

const SUMMARY_LIMIT = 500

export const mapIssue = (input: {
  issue: GithubIssue
  account: ProviderAccount
}): SourceActivity => {
  const { issue, account } = input
  const labels = issue.labels
    .map((label) => (typeof label === 'string' ? label : label.name))
    .filter((name): name is string => Boolean(name))

  return {
    provider: 'github',
    type: 'issue',
    externalId: String(issue.id),
    title: issue.title,
    summary: issue.body ? issue.body.slice(0, SUMMARY_LIMIT) : null,
    url: issue.html_url,
    actor: mapActor(issue.user, account),
    occurredAt: new Date(issue.closed_at ?? issue.created_at),
    details: {
      kind: 'issue',
      number: issue.number,
      state: issue.state === 'open' ? 'open' : 'closed',
      closedAt: issue.closed_at ?? null,
      labels,
      comments: issue.comments,
    },
  }
}
