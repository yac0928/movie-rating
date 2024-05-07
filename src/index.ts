import { Hono } from 'hono'
import mongoose from 'mongoose'

const app = new Hono()

mongoose.connect(process.env.MONGODB_URI!)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
}
