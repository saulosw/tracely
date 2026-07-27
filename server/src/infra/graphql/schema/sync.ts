import { builder } from '../builder.js'
import { requireUser } from '../context.js'
import { SyncStatusEnum } from './enums.js'

import type { SyncRun } from '../../../domain/index.js'


const SyncRunType = builder.objectRef<SyncRun>('SyncRun').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    status: t.field({ type: SyncStatusEnum, resolve: (run) => run.status }),
    startedAt: t.field({ type: 'DateTime', resolve: (run) => run.startedAt }),
    finishedAt: t.field({ type: 'DateTime', nullable: true, resolve: (run) => run.finishedAt }),
    stats: t.field({ type: 'JSON', resolve: (run) => run.stats }),
    error: t.exposeString('error', { nullable: true }),
  }),
})

builder.queryField('syncStatus', (t) =>
  t.field({
    type: SyncRunType,
    nullable: true,
    args: { connectionId: t.arg.id({ required: true }) },
    resolve: (_root, args, context) =>
      context.useCases.getSyncStatus({
        userId: requireUser(context).id,
        connectionId: String(args.connectionId),
      }),
  }),
)

builder.mutationField('triggerSync', (t) =>
  t.field({
    type: SyncRunType,
    args: { connectionId: t.arg.id({ required: true }) },
    resolve: async (_root, args, context) => {
      const trigger = await context.useCases.syncConnection({
        userId: requireUser(context).id,
        connectionId: String(args.connectionId),
      })
      trigger.completion?.catch((error: unknown) => {
        context.logger.error({ err: error, runId: trigger.run.id }, 'background sync failed')
      })
      return trigger.run
    },
  }),
)
