import { mapActor } from './actorMapper.js'

import type { RestEndpointMethodTypes } from '@octokit/rest'

import type { ProviderAccount, SourceActivity } from '../../../../domain/index.js'


export type GithubRelease =
  RestEndpointMethodTypes['repos']['listReleases']['response']['data'][number]

const SUMMARY_LIMIT = 500

export const mapRelease = (input: {
  release: GithubRelease
  account: ProviderAccount
}): SourceActivity => {
  const { release, account } = input

  return {
    provider: 'github',
    type: 'release',
    externalId: String(release.id),
    title: release.name || release.tag_name,
    summary: release.body ? release.body.slice(0, SUMMARY_LIMIT) : null,
    url: release.html_url,
    actor: mapActor(release.author, account),
    occurredAt: new Date(release.published_at ?? release.created_at),
    details: {
      kind: 'release',
      tagName: release.tag_name,
      name: release.name ?? null,
      isPrerelease: release.prerelease,
    },
  }
}
