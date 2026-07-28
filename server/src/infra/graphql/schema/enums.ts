import { builder } from '../builder.js'


export const ProviderEnum = builder.enumType('Provider', {
  values: { GITHUB: { value: 'github' } } as const,
})

export const ActivityTypeEnum = builder.enumType('ActivityType', {
  values: {
    COMMIT: { value: 'commit' },
    PULL_REQUEST: { value: 'pull_request' },
    ISSUE: { value: 'issue' },
    RELEASE: { value: 'release' },
  } as const,
})

export const ConnectionStatusEnum = builder.enumType('ConnectionStatus', {
  values: {
    ACTIVE: { value: 'active' },
    REVOKED: { value: 'revoked' },
    ERROR: { value: 'error' },
  } as const,
})

export const SyncStatusEnum = builder.enumType('SyncStatus', {
  values: {
    RUNNING: { value: 'running' },
    SUCCEEDED: { value: 'succeeded' },
    FAILED: { value: 'failed' },
    PARTIAL: { value: 'partial' },
  } as const,
})
