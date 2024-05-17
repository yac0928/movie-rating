import mongoose from 'mongoose'
import { Movie } from '../models'
import { Context } from 'hono'

export const movieController = {
  getMovies: async (c: Context) => {
    const { limit, offset } = c.req.query()
    const startDate = new Date()
    const movies = await Movie.find({ date: { $lte: startDate } })
      // .select('_id title photo')
      .sort({ date: -1 })
      .skip(offset ? parseInt(offset, 10) : 0)
      .limit(limit ? parseInt(limit, 10) : 100)
    return c.json(movies)
  },
  getMovie: async (c: Context) => {
    const { mid } = c.req.param()
    if (!mongoose.Types.ObjectId.isValid(mid)) {
      c.status(400)
      return c.json({ error: 'Invalid movie ID' })
    }
    const movie = await Movie.findById(mid)
    return c.json(movie)
  },
  getUpcomingMovies: async (c: Context) => {
    const { limit, offset } = c.req.query()
    const today = new Date()
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    )
    const movies = await Movie.find({ date: { $gte: tomorrow } })
      .sort({ date: 1 })
      .skip(offset ? parseInt(offset, 10) : 0)
      .limit(limit ? parseInt(limit, 10) : 100)
    return c.json(movies)
  },
}
