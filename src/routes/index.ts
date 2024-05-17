import { Hono } from 'hono'
import { categoryRoute } from './category'
import { commentRoute } from './comment'
import { userRoute } from './user'
import { movieRoute } from './movie'

export function setupRoutes(app: Hono) {
  categoryRoute(app)
  commentRoute(app)
  userRoute(app)
  movieRoute(app)
}
