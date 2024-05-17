import { OpenAPIHono } from '@hono/zod-openapi'
import { categoryRoute } from './category'
import { commentRoute } from './comment'
import { userRoute } from './user'

export function setupRoutes(app: OpenAPIHono) {
  categoryRoute(app)
  commentRoute(app)
  userRoute(app)
}
