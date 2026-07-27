import { ProviderError } from '../../../domain/index.js'
import { createOctokit } from './octokitFactory.js'
import { fetchGithubAccount } from './githubAccount.js'
import { translateGithubError } from './githubErrors.js'

import type { ProviderOAuthClient } from '../../../domain/index.js'
import type { Logger } from '../../logging/index.js'


export type GithubOAuthConfig = {
  clientId: string
  clientSecret: string
  callbackUrl: string
  scopes: string[]
}

type TokenResponse = {
  access_token?: string
  scope?: string
  error?: string
}

export const createGithubOAuthClient = (
  config: GithubOAuthConfig,
  logger: Logger,
): ProviderOAuthClient => ({
  buildAuthorizeUrl(state) {
    const url = new URL('https://github.com/login/oauth/authorize')
    url.searchParams.set('client_id', config.clientId)
    url.searchParams.set('redirect_uri', config.callbackUrl)
    url.searchParams.set('scope', config.scopes.join(' '))
    url.searchParams.set('state', state)
    return url.toString()
  },

  async exchangeCode(code) {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.callbackUrl,
        code,
      }),
    })
    if (!response.ok) {
      throw new ProviderError('GitHub token exchange failed')
    }
    const payload = (await response.json()) as TokenResponse
    if (!payload.access_token) {
      logger.warn({ error: payload.error }, 'github token exchange returned no token')
      throw new ProviderError('GitHub did not return an access token')
    }
    return {
      accessToken: payload.access_token,
      scopes: payload.scope?.split(',').filter(Boolean) ?? [],
    }
  },

  async fetchAccount(accessToken) {
    try {
      return await fetchGithubAccount(createOctokit(accessToken))
    } catch (error) {
      throw translateGithubError(error)
    }
  },

  async revokeGrant(accessToken) {
    try {
      const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString(
        'base64',
      )
      const response = await fetch(
        `https://api.github.com/applications/${config.clientId}/grant`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Basic ${credentials}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: accessToken }),
        },
      )
      if (!response.ok && response.status !== 404) {
        logger.warn({ status: response.status }, 'github grant revocation failed')
      }
    } catch (error) {
      logger.warn({ err: error }, 'github grant revocation failed')
    }
  },
})
