import { buildApp } from './app.js'
import { loadConfig } from './config/index.js'
import { composeServer } from './factories/index.js'


const config = loadConfig()
const deps = composeServer(config)
const app = buildApp(deps)

try {
  const swept = await deps.sweepStaleSyncRuns()
  if (swept > 0) {
    deps.logger.warn({ swept }, 'marked stale sync runs as failed')
  }
} catch (error) {
  deps.logger.warn({ err: error }, 'could not sweep stale sync runs (database unreachable?)')
}

app.listen(config.port, () => {
  deps.logger.info(`listening on http://localhost:${config.port}`)
})
