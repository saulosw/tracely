import { InfraError } from '../../domain/index.js'


export const requireRow = <T>(row: T | undefined): T => {
  if (row === undefined) {
    throw new InfraError('Expected the database to return a row')
  }
  return row
}

export const chunked = <T>(items: T[], size: number): T[][] => {
  const result: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size))
  }
  return result
}
