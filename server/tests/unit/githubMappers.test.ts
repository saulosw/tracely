import { describe, expect, it } from 'vitest'

import { activityDetailsSchema } from '../../src/domain/index.js'
import {
  mapActor,
  mapCommit,
  mapIssue,
  mapPullRequest,
  mapRelease,
  mapRepository,
} from '../../src/infra/providers/index.js'
import { fakeAccount } from '../fakes/fakes.js'
import {
  botCommitFixture,
  commitDetailFixture,
  commitFixture,
  issueFixture,
  pullRequestFixture,
  releaseFixture,
  repositoryFixture,
  unlinkedCommitFixture,
} from '../fixtures/github.js'


describe('mapRepository', () => {
  it('normalizes a private repository into a provider-agnostic project', () => {
    const project = mapRepository(repositoryFixture)
    expect(project).toMatchObject({
      provider: 'github',
      externalId: '1001',
      fullName: 'octocat/tracely',
      visibility: 'private',
      primaryLanguage: 'TypeScript',
      defaultBranch: 'main',
    })
    expect(project.providerPushedAt).toEqual(new Date('2026-07-01T12:00:00Z'))
  })
})

describe('mapActor', () => {
  it('recognizes the connected user by external id', () => {
    const actor = mapActor({ id: 42, login: 'octocat', type: 'User' }, fakeAccount)
    expect(actor).toEqual({
      externalId: '42',
      login: 'octocat',
      isConnectedUser: true,
      isBot: false,
    })
  })

  it('flags [bot] suffixes and known automation logins', () => {
    expect(mapActor({ id: 1, login: 'dependabot[bot]', type: 'Bot' }, fakeAccount).isBot).toBe(
      true,
    )
    expect(mapActor({ id: 2, login: 'renovate', type: 'User' }, fakeAccount).isBot).toBe(true)
    expect(mapActor({ id: 3, login: 'claude', type: 'User' }, fakeAccount).isBot).toBe(true)
    expect(mapActor({ id: 4, login: 'human-dev', type: 'User' }, fakeAccount).isBot).toBe(false)
  })
})

describe('mapCommit', () => {
  it('maps a commit with details into a valid commit activity', () => {
    const activity = mapCommit({
      commit: commitFixture,
      detail: commitDetailFixture,
      branch: 'main',
      account: fakeAccount,
    })

    expect(activity.type).toBe('commit')
    expect(activity.externalId).toBe('abc123')
    expect(activity.title).toBe('feat: add narrative timeline')
    expect(activity.actor.isConnectedUser).toBe(true)
    expect(activity.occurredAt).toEqual(new Date('2026-07-10T12:00:00Z'))
    expect(activity.details).toMatchObject({
      kind: 'commit',
      additions: 120,
      deletions: 30,
      filesChanged: 2,
      filesTruncated: false,
      branch: 'main',
    })
    expect(activityDetailsSchema.parse(activity.details)).toBeTruthy()
  })

  it('matches an unlinked author through the verified account emails', () => {
    const activity = mapCommit({
      commit: unlinkedCommitFixture,
      detail: null,
      branch: 'main',
      account: fakeAccount,
    })
    expect(activity.actor.login).toBeNull()
    expect(activity.actor.isConnectedUser).toBe(true)
    expect(activity.details).toMatchObject({ filesTruncated: true, files: null })
  })

  it('keeps bot commits attributed to the bot, not the user', () => {
    const activity = mapCommit({
      commit: botCommitFixture,
      detail: null,
      branch: 'main',
      account: fakeAccount,
    })
    expect(activity.actor.isBot).toBe(true)
    expect(activity.actor.isConnectedUser).toBe(false)
  })
})

describe('mapPullRequest', () => {
  it('anchors a merged pull request at its merge time', () => {
    const activity = mapPullRequest({
      pull: pullRequestFixture,
      detail: null,
      account: fakeAccount,
    })

    expect(activity.type).toBe('pull_request')
    expect(activity.occurredAt).toEqual(new Date('2026-07-08T15:00:00Z'))
    expect(activity.details).toMatchObject({
      kind: 'pull_request',
      number: 12,
      merged: true,
      state: 'closed',
      baseBranch: 'main',
      headBranch: 'feat/github-oauth',
      labels: ['feature', 'backend'],
      additions: null,
    })
    expect(activityDetailsSchema.parse(activity.details)).toBeTruthy()
  })
})

describe('mapIssue', () => {
  it('handles mixed string and object labels', () => {
    const activity = mapIssue({ issue: issueFixture, account: fakeAccount })
    expect(activity.type).toBe('issue')
    expect(activity.occurredAt).toEqual(new Date('2026-07-03T09:00:00Z'))
    expect(activity.details).toMatchObject({
      kind: 'issue',
      number: 30,
      state: 'closed',
      labels: ['bug', 'sync'],
      comments: 2,
    })
    expect(activityDetailsSchema.parse(activity.details)).toBeTruthy()
  })
})

describe('mapRelease', () => {
  it('maps a prerelease anchored at its publish time', () => {
    const activity = mapRelease({ release: releaseFixture, account: fakeAccount })
    expect(activity.type).toBe('release')
    expect(activity.title).toBe('First public preview')
    expect(activity.occurredAt).toEqual(new Date('2026-07-15T10:00:00Z'))
    expect(activity.details).toMatchObject({
      kind: 'release',
      tagName: 'v0.1.0',
      isPrerelease: true,
    })
    expect(activityDetailsSchema.parse(activity.details)).toBeTruthy()
  })
})
