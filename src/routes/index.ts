import { Hono } from 'hono'
import { categoryRoute } from './category'
import { userRoute } from './user'

export function setupRoutes(app: Hono) {
  categoryRoute(app)
  userRoute(app)
}
