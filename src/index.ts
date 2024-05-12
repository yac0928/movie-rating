import { Context, Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import mongoose from 'mongoose'

import { setupRoutes } from './routes'

const app = new Hono()

mongoose.connect(process.env.MONGODB_URI!)

app.use('*', logger())
app.use(cors())

setupRoutes(app) // 添加新的路由

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
;(app.onError as any)(async (err: Error, c: Context, next: () => void) => {
  // 如果有錯誤發生，則處理錯誤；如果沒有錯誤，將控制權交給下一個中間件或路由
  return err != null
    ? err.message != null
      ? c.json({
          errors: [{ message: err.message }],
        })
      : c.json({
          errors: [{ message: err }],
        })
    : next()
})

export default {
  port: process.env.PORT || 3000,
  hostname: '0.0.0.0',
  fetch: app.fetch,
}
