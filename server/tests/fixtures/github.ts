import type {
  GithubCommit,
  GithubCommitDetail,
  GithubIssue,
  GithubPullRequest,
  GithubRelease,
  GithubRepository,
} from '../../src/infra/providers/index.js'


export const repositoryFixture = {
  id: 1001,
  name: 'tracely',
  full_name: 'saulo/tracely',
  owner: { login: 'saulo', id: 42, type: 'User' },
  description: 'Narrative timeline',
  private: true,
  fork: false,
  archived: false,
  default_branch: 'main',
  language: 'TypeScript',
  created_at: '2026-01-01T00:00:00Z',
  pushed_at: '2026-07-01T12:00:00Z',
} as unknown as GithubRepository

export const commitFixture = {
  sha: 'abc123',
  html_url: 'https://github.com/saulo/tracely/commit/abc123',
  author: { login: 'saulo', id: 42, type: 'User' },
  committer: { login: 'web-flow', id: 19864447, type: 'User' },
  commit: {
    message: 'feat: add narrative timeline\n\nLonger body explaining the change.',
    author: { name: 'Saulo', email: 'saulo@example.com', date: '2026-07-10T12:00:00Z' },
    committer: { name: 'GitHub', email: 'noreply@github.com', date: '2026-07-10T12:00:00Z' },
  },
} as unknown as GithubCommit

export const unlinkedCommitFixture = {
  sha: 'def456',
  html_url: 'https://github.com/saulo/tracely/commit/def456',
  author: null,
  committer: null,
  commit: {
    message: 'chore: local commit without a linked github account',
    author: { name: 'Saulo', email: 'saulo@example.com', date: '2026-07-11T09:00:00Z' },
    committer: { name: 'Saulo', email: 'saulo@example.com', date: '2026-07-11T09:00:00Z' },
  },
} as unknown as GithubCommit

export const botCommitFixture = {
  sha: 'bot789',
  html_url: 'https://github.com/saulo/tracely/commit/bot789',
  author: { login: 'dependabot[bot]', id: 49699333, type: 'Bot' },
  committer: { login: 'dependabot[bot]', id: 49699333, type: 'Bot' },
  commit: {
    message: 'build(deps): bump express from 5.1.0 to 5.2.1',
    author: { name: 'dependabot[bot]', email: 'bot@github.com', date: '2026-07-12T03:00:00Z' },
    committer: { name: 'dependabot[bot]', email: 'bot@github.com', date: '2026-07-12T03:00:00Z' },
  },
} as unknown as GithubCommit

export const commitDetailFixture = {
  sha: 'abc123',
  stats: { additions: 120, deletions: 30, total: 150 },
  files: [
    { filename: 'src/domain/entities/activity.ts', status: 'added', additions: 100, deletions: 0 },
    { filename: 'src/main/server.ts', status: 'modified', additions: 20, deletions: 30 },
  ],
} as unknown as GithubCommitDetail

export const pullRequestFixture = {
  id: 5001,
  number: 12,
  title: 'Add GitHub OAuth connection flow',
  body: 'Implements the OAuth web flow with encrypted token storage.',
  html_url: 'https://github.com/saulo/tracely/pull/12',
  state: 'closed',
  draft: false,
  user: { login: 'saulo', id: 42, type: 'User' },
  created_at: '2026-07-05T10:00:00Z',
  updated_at: '2026-07-08T15:00:00Z',
  closed_at: '2026-07-08T15:00:00Z',
  merged_at: '2026-07-08T15:00:00Z',
  base: { ref: 'main' },
  head: { ref: 'feat/github-oauth' },
  labels: [{ name: 'feature' }, { name: 'backend' }],
} as unknown as GithubPullRequest

export const issueFixture = {
  id: 6001,
  number: 30,
  title: 'Sync fails on empty repositories',
  body: 'Repositories without commits return 409.',
  html_url: 'https://github.com/saulo/tracely/issues/30',
  state: 'closed',
  user: { login: 'saulo', id: 42, type: 'User' },
  created_at: '2026-07-02T08:00:00Z',
  updated_at: '2026-07-03T09:00:00Z',
  closed_at: '2026-07-03T09:00:00Z',
  comments: 2,
  labels: ['bug', { name: 'sync' }],
} as unknown as GithubIssue

export const releaseFixture = {
  id: 7001,
  tag_name: 'v0.1.0',
  name: 'First public preview',
  body: 'Initial release with the GitHub source.',
  html_url: 'https://github.com/saulo/tracely/releases/tag/v0.1.0',
  prerelease: true,
  author: { login: 'saulo', id: 42, type: 'User' },
  created_at: '2026-07-15T00:00:00Z',
  published_at: '2026-07-15T10:00:00Z',
} as unknown as GithubRelease
