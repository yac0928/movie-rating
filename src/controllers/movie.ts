import mongoose from 'mongoose'
import { Movie } from '../models'
import { Category } from '../models'
import { Context } from 'hono'
import {
  fetchMovieIds,
  fetchMovieDetails,
  saveMovieDetailsBatch,
} from '../helpers/fetchMovies'

export const movieController = {
  getMovies: async (c: any) => {
    const { limit, offset } = c.req.query()
    const startDate = new Date()
    console.log(startDate)
    const movies = await Movie.find({ release_date: { $lte: startDate } })
      .select('_id title poster_path')
      .sort({ release_date: -1 })
      .skip(offset ? parseInt(offset, 10) : 0)
      .limit(limit ? parseInt(limit, 10) : 100)
    return c.json(movies)
  },
  // 需要使用ObjectId
  getMovie: async (c: any) => {
    const { movieId } = c.req.param()
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      c.status(400)
      return c.json({ error: 'Invalid movie ID' })
    }
    const movie = await Movie.findByIdAndUpdate(
      movieId,
      { $inc: { view: 1 } },
      { new: true }
    ).populate({
      path: 'category_id',
      model: 'Category',
      select: 'id name',
    })
    if (!movie) {
      c.status(404)
      return c.json({ error: 'Movie not found' })
    }
    return c.json(movie)
  },
  getUpcomingMovies: async (c: any) => {
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
  fetchMoviesFromTMDB: async (c: any) => {
    const data = await c.req.json()
    const pages = data.pages
    for (let i = 1; i <= pages; i++) {
      const movieIds = await fetchMovieIds(i)
      const movieDetailsBatch = []
      for (const movieId of movieIds) {
        const movieDetails = await fetchMovieDetails(movieId)
        movieDetailsBatch.push(movieDetails)
      }
      await saveMovieDetailsBatch(movieDetailsBatch)
    }
    return c.json({ success: true })
  },
}
