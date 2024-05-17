import { Movie, Comment } from '../models'
import { Context } from 'hono'

import { idCheck } from '../middlewares/validation'

export const commentController = {
  getComments: async (c: Context) => {
    const comments = await Comment.find()
    return c.json(comments)
  },

  addComment: async (c: Context) => {
    const { id: userId } = c.get('jwtPayload')
    const { movieId } = c.req.param()
    const { rating, comment } = await c.req.json()

    if (idCheck(movieId)) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Invalid movieId.' }],
      })
    }

    const [currentMovie, commentedMovie] = await Promise.all([
      Movie.findById(movieId),
      Comment.findOne({ userId, movieId }),
    ])

    if (currentMovie == null) {
      c.status(400)
      return c.json({
        errors: [{ message: "Movie doesn't existed." }],
      })
    }

    if (commentedMovie != null) {
      c.status(400)
      return c.json({
        errors: [{ message: 'You already commented this movie before.' }],
      })
    }

    return c.json(await Comment.create({ userId, movieId, rating, comment }))
  },

  updateComment: async (c: Context) => {
    const { id: userId } = c.get('jwtPayload')
    const { movieId } = c.req.param()
    const { rating, comment } = await c.req.json()

    if (idCheck(movieId)) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Invalid movieId.' }],
      })
    }

    const commentedMovie = await Comment.findOne({ userId, movieId })

    if (commentedMovie == null) {
      c.status(400)
      return c.json({
        errors: [{ message: "You haven't make comments on this movie yet." }],
      })
    }

    if (String(commentedMovie.userId) !== userId) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Insufficient permissions.' }],
      })
    }

    commentedMovie.rating = rating
    commentedMovie.comment = comment

    return c.json(await commentedMovie.save())
  },

  removeComment: async (c: Context) => {
    const { id: userId } = c.get('jwtPayload')
    const { movieId } = c.req.param()

    if (idCheck(movieId)) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Invalid movieId.' }],
      })
    }

    const commentedMovie = await Comment.findOne({ userId, movieId })

    if (commentedMovie == null) {
      c.status(400)
      return c.json({
        errors: [{ message: "You haven't make comments on this movie yet." }],
      })
    }

    if (String(commentedMovie.userId) !== userId) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Insufficient permissions.' }],
      })
    }

    return c.json(await Comment.findOneAndDelete({ userId, movieId }))
  },
}
