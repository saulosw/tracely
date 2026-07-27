import { throttling } from '@octokit/plugin-throttling'
import { Octokit } from '@octokit/rest'


const ThrottledOctokit = Octokit.plugin(throttling)

const MAX_RETRY_WAIT_SECONDS = 60

export const createOctokit = (accessToken: string): Octokit =>
  new ThrottledOctokit({
    auth: accessToken,
    throttle: {
      onRateLimit: (retryAfter, _options, _octokit, retryCount) =>
        retryCount === 0 && retryAfter <= MAX_RETRY_WAIT_SECONDS,
      onSecondaryRateLimit: (retryAfter, _options, _octokit, retryCount) =>
        retryCount === 0 && retryAfter <= MAX_RETRY_WAIT_SECONDS,
    },
  })
