import { Context, Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import mongoose from 'mongoose'

import { checkEnvironmentVariables } from './config/environment'
import { handleApiError } from './middlewares/error-handler'
import { setupRoutes } from './routes'

checkEnvironmentVariables()

mongoose.connect(process.env.MONGODB_URI!)

const app = new Hono()

app.use('*', logger())
app.use(cors())

setupRoutes(app) // 添加新的路由

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
;(app.onError as any)((err: Error, c: Context, next: () => void) =>
  handleApiError(err, c, next)
)

export default {
  port: process.env.PORT || 3000,
  hostname: '0.0.0.0',
  fetch: app.fetch,
}
