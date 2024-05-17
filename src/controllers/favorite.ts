import { Favorite, Movie } from '../models'
import { Context } from 'hono'

import { idCheck } from '../middlewares/validation'

export const favoriteController = {
  addFavorite: async (c: Context) => {
    const { id: userId } = c.get('jwtPayload')
    const { movieId } = c.req.param()

    if (idCheck(movieId)) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Invalid movieId.' }],
      })
    }

    const [currentMovie, favoriteMovie] = await Promise.all([
      Movie.findById(movieId),
      Favorite.findOne({ userId, movieId }),
    ])

    if (currentMovie == null) {
      c.status(400)
      return c.json({
        errors: [{ message: "Movie doesn't existed." }],
      })
    }

    if (favoriteMovie != null) {
      c.status(400)
      return c.json({
        errors: [{ message: 'The movie is already in your favorites list.' }],
      })
    }

    return c.json(await Favorite.create({ userId, movieId }))
  },
  removeFavorite: async (c: Context) => {
    const { id: userId } = c.get('jwtPayload')
    const { movieId } = c.req.param()

    if (idCheck(movieId)) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Invalid movieId.' }],
      })
    }

    const favoriteMovie = await Favorite.findOne({ userId, movieId })

    if (favoriteMovie == null) {
      c.status(400)
      return c.json({
        errors: [{ message: "You haven't favorited this movie yet." }],
      })
    }

    if (String(favoriteMovie.userId) !== userId) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Insufficient permissions.' }],
      })
    }

    return c.json(await Favorite.findOneAndDelete({ userId, movieId }))
  },
}
