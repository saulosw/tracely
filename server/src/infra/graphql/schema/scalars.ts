import { GraphQLError, GraphQLScalarType, Kind } from 'graphql'

import { builder } from '../builder.js'


const parseDate = (value: unknown): Date => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new GraphQLError('DateTime must be an ISO-8601 string')
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new GraphQLError('DateTime must be a valid date')
  }
  return date
}

const DateTimeScalar = new GraphQLScalarType<Date, string>({
  name: 'DateTime',
  serialize: (value) => (value as Date).toISOString(),
  parseValue: parseDate,
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('DateTime must be an ISO-8601 string')
    }
    return parseDate(ast.value)
  },
})

const JsonScalar = new GraphQLScalarType({
  name: 'JSON',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: () => {
    throw new GraphQLError('JSON literals are not supported')
  },
})

builder.addScalarType('DateTime', DateTimeScalar, {})
builder.addScalarType('JSON', JsonScalar, {})
