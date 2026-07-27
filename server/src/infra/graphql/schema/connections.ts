import { builder } from '../builder.js'
import { requireUser } from '../context.js'
import { ConnectionStatusEnum, ProviderEnum } from './enums.js'

import type { Connection } from '../../../domain/index.js'


const ConnectionType = builder.objectRef<Connection>('Connection').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    provider: t.field({ type: ProviderEnum, resolve: (connection) => connection.provider }),
    accountLogin: t.exposeString('accountLogin'),
    accountName: t.exposeString('accountName', { nullable: true }),
    avatarUrl: t.exposeString('avatarUrl', { nullable: true }),
    status: t.field({ type: ConnectionStatusEnum, resolve: (connection) => connection.status }),
    lastSyncedAt: t.field({
      type: 'DateTime',
      nullable: true,
      resolve: (connection) => connection.lastSyncedAt,
    }),
    createdAt: t.field({ type: 'DateTime', resolve: (connection) => connection.createdAt }),
  }),
})

const ConnectInitPayloadType = builder
  .objectRef<{ authorizeUrl: string }>('ConnectInitPayload')
  .implement({
    fields: (t) => ({
      authorizeUrl: t.exposeString('authorizeUrl'),
    }),
  })

builder.queryField('connections', (t) =>
  t.field({
    type: [ConnectionType],
    resolve: (_root, _args, context) =>
      context.useCases.listConnections(requireUser(context).id),
  }),
)

builder.mutationField('connectProvider', (t) =>
  t.field({
    type: ConnectInitPayloadType,
    args: { provider: t.arg({ type: ProviderEnum, required: true }) },
    resolve: (_root, args, context) =>
      context.useCases.startProviderConnection({
        userId: requireUser(context).id,
        provider: args.provider,
      }),
  }),
)

builder.mutationField('disconnectProvider', (t) =>
  t.field({
    type: 'Boolean',
    args: { connectionId: t.arg.id({ required: true }) },
    resolve: async (_root, args, context) => {
      await context.useCases.disconnectProvider({
        userId: requireUser(context).id,
        connectionId: String(args.connectionId),
      })
      return true
    },
  }),
)
