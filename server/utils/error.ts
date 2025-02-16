import type { PostgresError } from 'postgres'
import { pick } from 'lodash-es'

export function parseError(error: any) {
  if (error.name === 'PostgresError') {
    const _error: PostgresError = error

    return createError({
      statusCode: 400,
      statusMessage: _error.message,
      data: pick(_error, ['code', 'table_name', 'constraint_name', 'detail']),
    })
  }

  return createError({
    statusCode: error.statusCode || 500,
    statusMessage: error.message,
    data: error,
  })
}
