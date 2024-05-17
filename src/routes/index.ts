import { Hono } from 'hono'
import { categoryRoute } from './category'
import { commentRoute } from './comment'
import { userRoute } from './user'

export function setupRoutes(app: Hono) {
  categoryRoute(app)
  commentRoute(app)
  userRoute(app)
}
