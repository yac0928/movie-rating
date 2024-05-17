import { Context, Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import mongoose from 'mongoose'

import { checkEnvironmentVariables } from './config/environment'
import { handleApiError } from './middlewares/error-handler'
import { setupRoutes } from './routes'

checkEnvironmentVariables()

const mongodbUri =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI!
    : process.env.DEV_MONGODB_URI!

mongoose.connect(mongodbUri)

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

export default app
