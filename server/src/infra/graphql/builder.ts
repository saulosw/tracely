import SchemaBuilder from '@pothos/core'

import type { GraphQLContext } from './context.js'


export const builder = new SchemaBuilder<{
  Context: GraphQLContext
  DefaultFieldNullability: false
  Scalars: {
    DateTime: { Input: Date; Output: Date }
    JSON: { Input: unknown; Output: unknown }
  }
}>({ defaultFieldNullability: false })
