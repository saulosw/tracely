import { pino } from 'pino'

import type { Logger } from 'pino'


export type { Logger }

export const createLogger = (level: string, pretty: boolean): Logger =>
  pino({
    level,
    ...(pretty ? { transport: { target: 'pino-pretty' } } : {}),
  })
