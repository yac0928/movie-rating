import { Hono } from 'hono'
import { logger } from 'hono/logger'
import mongoose from 'mongoose'

import { setupRoutes } from './routes'

const app = new Hono()

mongoose.connect(process.env.MONGODB_URI!)

app.use('*', logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

setupRoutes(app) // 添加新的路由

export default {
  port: process.env.PORT || 3000,
  hostname: '0.0.0.0',
  fetch: app.fetch,
}
