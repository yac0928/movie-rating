import { Hono } from 'hono'
import { movieController } from '../controllers/movie'

export function movieRoute(app: Hono) {
  app.get('/api/movie', movieController.getMovies)
  app.get('/api/movie/:mid', movieController.getMovie)
  app.get('/api/upcomingmovie', movieController.getUpcomingMovies)
}
