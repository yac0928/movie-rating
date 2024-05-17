import { Context } from 'hono'
import { StatusCode } from 'hono/utils/http-status'
import { errorMessage } from '../helpers/error-message'

interface ApiError extends Error {
  status?: StatusCode
}

export function handleApiError(err: ApiError, c: Context) {
  return errorMessage(c, err.status ?? 500, err.message ?? err)
}
