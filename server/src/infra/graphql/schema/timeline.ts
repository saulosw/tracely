import { builder } from '../builder.js'
import { requireUser } from '../context.js'
import { ActivityTypeEnum, ProviderEnum } from './enums.js'

import type { ActivityPage, ActivityWithProject } from '../../../domain/index.js'


const ActivityGqlType = builder.objectRef<ActivityWithProject>('Activity').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    provider: t.field({ type: ProviderEnum, resolve: (activity) => activity.provider }),
    type: t.field({ type: ActivityTypeEnum, resolve: (activity) => activity.type }),
    title: t.exposeString('title'),
    summary: t.exposeString('summary', { nullable: true }),
    url: t.exposeString('url', { nullable: true }),
    occurredAt: t.field({ type: 'DateTime', resolve: (activity) => activity.occurredAt }),
    projectId: t.exposeID('projectId', { nullable: true }),
    projectName: t.exposeString('projectName', { nullable: true }),
    projectFullName: t.exposeString('projectFullName', { nullable: true }),
    actorLogin: t.string({ nullable: true, resolve: (activity) => activity.actor.login }),
    actorIsConnectedUser: t.boolean({ resolve: (activity) => activity.actor.isConnectedUser }),
    actorIsBot: t.boolean({ resolve: (activity) => activity.actor.isBot }),
    details: t.field({ type: 'JSON', resolve: (activity) => activity.details }),
  }),
})

const ActivityPageType = builder.objectRef<ActivityPage>('ActivityPage').implement({
  fields: (t) => ({
    items: t.field({ type: [ActivityGqlType], resolve: (page) => page.items }),
    nextCursor: t.exposeString('nextCursor', { nullable: true }),
  }),
})

builder.queryField('activities', (t) =>
  t.field({
    type: ActivityPageType,
    args: {
      from: t.arg({ type: 'DateTime', required: true }),
      to: t.arg({ type: 'DateTime', required: true }),
      providers: t.arg({ type: [ProviderEnum] }),
      types: t.arg({ type: [ActivityTypeEnum] }),
      projectIds: t.arg.idList(),
      first: t.arg.int(),
      after: t.arg.string(),
    },
    resolve: (_root, args, context) =>
      context.useCases.listActivities({
        userId: requireUser(context).id,
        from: args.from,
        to: args.to,
        ...(args.providers?.length ? { providers: [...args.providers] } : {}),
        ...(args.types?.length ? { types: [...args.types] } : {}),
        ...(args.projectIds?.length ? { projectIds: args.projectIds.map(String) } : {}),
        ...(args.first != null ? { first: args.first } : {}),
        ...(args.after != null ? { after: args.after } : {}),
      }),
  }),
)
