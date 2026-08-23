import { builder } from '../builder.js'
import { requireUser } from '../context.js'
import {
  ActivityTypeEnum,
  ArtifactKindEnum,
  ArtifactPeriodEnum,
  JournalGranularityEnum,
  ProviderEnum,
} from './enums.js'

import type {
  Artifact,
  ArtifactPage,
  ArtifactVersion,
  JournalEntry,
  JournalItem,
  JournalPayload,
  JournalSection,
  Measure,
} from '../../../domain/index.js'


const MeasureType = builder.objectRef<Measure>('JournalMeasure').implement({
  description:
    'A quantity one source can answer and another cannot — changed lines for a repository, a duration for a calendar. Absent means unmeasured, never zero; `partial` means only part of the sample could answer, so the value is a floor.',
  fields: (t) => ({
    key: t.exposeString('key'),
    value: t.exposeFloat('value'),
    partial: t.exposeBoolean('partial'),
  }),
})

const JournalItemType = builder.objectRef<JournalItem>('JournalItem').implement({
  description:
    'One of the activities an aggregated entry stands for, so a grouped line can still be followed back to its source.',
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    url: t.exposeString('url', { nullable: true }),
    at: t.exposeString('at'),
  }),
})

const JournalEntryType = builder.objectRef<JournalEntry>('JournalEntry').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    provider: t.field({ type: ProviderEnum, resolve: (entry) => entry.provider }),
    type: t.field({ type: ActivityTypeEnum, resolve: (entry) => entry.type }),
    variant: t.exposeString('variant', { nullable: true }),
    reference: t.exposeString('reference', { nullable: true }),
    title: t.exposeString('title'),
    project: t.exposeString('project', { nullable: true }),
    count: t.exposeInt('count'),
    measures: t.field({ type: [MeasureType], resolve: (entry) => entry.measures }),
    items: t.field({ type: [JournalItemType], resolve: (entry) => entry.items }),
    url: t.exposeString('url', { nullable: true }),
    at: t.exposeString('at', { nullable: true }),
  }),
})

const JournalSectionType = builder.objectRef<JournalSection>('JournalSection').implement({
  fields: (t) => ({
    from: t.exposeString('from'),
    to: t.exposeString('to'),
    overflow: t.exposeInt('overflow'),
    entries: t.field({ type: [JournalEntryType], resolve: (section) => section.entries }),
  }),
})

const JournalPayloadType = builder.objectRef<JournalPayload>('JournalPayload').implement({
  fields: (t) => ({
    granularity: t.field({
      type: JournalGranularityEnum,
      resolve: (payload) => payload.granularity,
    }),
    activityCount: t.exposeInt('activityCount'),
    truncated: t.exposeBoolean('truncated'),
    sections: t.field({ type: [JournalSectionType], resolve: (payload) => payload.sections }),
  }),
})

const ArtifactVersionType = builder.objectRef<ArtifactVersion>('ArtifactVersion').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    generatedAt: t.field({ type: 'DateTime', resolve: (version) => version.generatedAt }),
  }),
})

const ArtifactType = builder.objectRef<Artifact>('Artifact').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    kind: t.field({ type: ArtifactKindEnum, resolve: (artifact) => artifact.kind }),
    period: t.field({ type: ArtifactPeriodEnum, resolve: (artifact) => artifact.period }),
    from: t.field({ type: 'DateTime', resolve: (artifact) => artifact.from }),
    to: t.field({ type: 'DateTime', resolve: (artifact) => artifact.to }),
    timezone: t.exposeString('timezone'),
    providers: t.field({ type: [ProviderEnum], resolve: (artifact) => artifact.providers }),
    activityCount: t.int({ resolve: (artifact) => artifact.payload.activityCount }),
    journal: t.field({
      type: JournalPayloadType,
      nullable: true,
      resolve: (artifact) => (artifact.payload.kind === 'journal' ? artifact.payload : null),
    }),
    versions: t.field({
      type: [ArtifactVersionType],
      resolve: (artifact, _args, context) =>
        context.useCases.listArtifactVersions({
          userId: requireUser(context).id,
          artifactId: artifact.id,
        }),
    }),
    generatedAt: t.field({ type: 'DateTime', resolve: (artifact) => artifact.generatedAt }),
  }),
})

const ArtifactPageType = builder.objectRef<ArtifactPage>('ArtifactPage').implement({
  fields: (t) => ({
    items: t.field({ type: [ArtifactType], resolve: (page) => page.items }),
    nextCursor: t.exposeString('nextCursor', { nullable: true }),
  }),
})

const GenerateJournalInputType = builder.inputType('GenerateJournalInput', {
  fields: (t) => ({
    period: t.field({ type: ArtifactPeriodEnum, required: true }),
    timezone: t.string({ required: true }),
    from: t.string(),
    to: t.string(),
    providers: t.field({ type: [ProviderEnum], required: true }),
  }),
})

builder.queryField('artifacts', (t) =>
  t.field({
    type: ArtifactPageType,
    args: {
      kind: t.arg({ type: ArtifactKindEnum }),
      first: t.arg.int(),
      after: t.arg.string(),
    },
    resolve: (_root, args, context) =>
      context.useCases.listArtifacts({
        userId: requireUser(context).id,
        ...(args.kind != null ? { kind: args.kind } : {}),
        ...(args.first != null ? { first: args.first } : {}),
        ...(args.after != null ? { after: args.after } : {}),
      }),
  }),
)

builder.queryField('artifact', (t) =>
  t.field({
    type: ArtifactType,
    args: { id: t.arg.id({ required: true }) },
    resolve: (_root, args, context) =>
      context.useCases.getArtifact({
        userId: requireUser(context).id,
        artifactId: String(args.id),
      }),
  }),
)

builder.mutationField('generateJournal', (t) =>
  t.field({
    type: ArtifactType,
    args: { input: t.arg({ type: GenerateJournalInputType, required: true }) },
    resolve: (_root, args, context) =>
      context.useCases.generateJournal({
        userId: requireUser(context).id,
        period: args.input.period,
        timezone: args.input.timezone,
        from: args.input.from ?? null,
        to: args.input.to ?? null,
        providers: [...args.input.providers],
      }),
  }),
)

builder.mutationField('regenerateArtifact', (t) =>
  t.field({
    type: ArtifactType,
    args: { id: t.arg.id({ required: true }) },
    resolve: (_root, args, context) =>
      context.useCases.regenerateArtifact({
        userId: requireUser(context).id,
        artifactId: String(args.id),
      }),
  }),
)
