import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
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

const app = new OpenAPIHono()

app.use('*', logger())
app.use(cors())

setupRoutes(app) // 添加新的路由

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Movie Rating',
  },
})

app.openAPIRegistry.registerComponent('securitySchemes', 'JWT_Token', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

app.get('/ui', swaggerUI({ url: '/doc' }))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.onError((err: Error, c: any) => handleApiError(err, c))

export default app
