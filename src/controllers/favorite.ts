import jwt from 'jsonwebtoken'

import { Favorite, Movie } from '../models'

import { idCheck } from '../middlewares/validation'
import { errorMessage } from '../helpers/error-message'

export const favoriteController = {
  addFavorite: async (c: any) => {
    const token = c.req.header('Authorization')?.split(' ')[1]

    if (token == null) {
      const message = 'no authorization included in request.'
      const name = 'ServerError'

      return errorMessage(c, 401, message, name)
    }

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!)
    const { id: userId } = payload
    const { movieId } = c.req.param()

    if (idCheck(movieId)) {
      const message = 'Invalid movieId.'
      const name = 'ZodError'

      return errorMessage(c, 400, message, name)
    }

    const [currentMovie, favoriteMovie] = await Promise.all([
      Movie.findById(movieId),
      Favorite.findOne({ userId, movieId }),
    ])

    if (currentMovie == null) {
      const message = "Movie doesn't existed."
      const name = 'DataBaseError'

      return errorMessage(c, 404, message, name)
    }

    if (favoriteMovie != null) {
      const message = 'The movie is already in your favorites list.'
      const name = 'DataBaseError'

      return errorMessage(c, 400, message, name)
    }

    return c.json({
      success: true,
      data: await Favorite.create({ userId, movieId }),
    })
  },
  removeFavorite: async (c: any) => {
    const token = c.req.header('Authorization')?.split(' ')[1]

    if (token == null) {
      const message = 'no authorization included in request.'
      const name = 'ServerError'

      return errorMessage(c, 401, message, name)
    }

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!)
    const { id: userId } = payload
    const { movieId } = c.req.param()

    if (idCheck(movieId)) {
      const message = 'Invalid movieId.'
      const name = 'ZodError'

      return errorMessage(c, 400, message, name)
    }

    const favoriteMovie = await Favorite.findOne({ userId, movieId })

    if (favoriteMovie == null) {
      const message = "You haven't favorited this movie yet."
      const name = 'DataBaseError'

      return errorMessage(c, 400, message, name)
    }

    return c.json({
      success: true,
      data: await Favorite.findOneAndDelete({ userId, movieId }),
    })
  },
}
