import { Hono } from 'hono'
import { categoryRoute } from './category'
import { userRoute } from './user'
import { movieRoute } from './movie'

export function setupRoutes(app: Hono) {
  categoryRoute(app)
  userRoute(app)
  movieRoute(app)
}
