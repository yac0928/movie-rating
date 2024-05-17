import { StatusCode } from 'hono/utils/http-status'

export function errorMessage(
  c: any,
  status: StatusCode,
  message: string,
  name: string = 'ServerError'
) {
  c.status(status)
  return c.json({
    success: false,
    error: {
      issues: [
        {
          message,
        },
      ],
      name,
    },
  })
}
