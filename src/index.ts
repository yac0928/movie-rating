import { Hono } from 'hono'
import mongoose from 'mongoose'
import { categoryRoute } from './routes/category'

const app = new Hono()

mongoose.connect(process.env.MONGODB_URI!)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


const apiRoutes = app
  .basePath('/api')
  .route('/category', categoryRoute)

export default {
  port: process.env.PORT || 3000,
  hostname: '0.0.0.0',
  fetch: app.fetch,
}

export type ApiRoutes = typeof apiRoutes