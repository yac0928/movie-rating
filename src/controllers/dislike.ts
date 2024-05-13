import { Comment, Dislike } from '../models'
import { Context } from 'hono'

import { idCheck } from '../middlewares/validation'

export const dislikeController = {
  dislikeComment: async (c: Context) => {
    const { id: userId } = c.get('jwtPayload')
    const { commentId } = c.req.param()

    if (idCheck(commentId)) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Invalid commentId.' }],
      })
    }

    const [currentComment, likedComment] = await Promise.all([
      Comment.findById(commentId),
      Dislike.findOne({ userId, commentId }),
    ])

    if (currentComment == null) {
      c.status(400)
      return c.json({
        errors: [{ message: "Comment doesn't existed." }],
      })
    }

    if (likedComment != null) {
      c.status(400)
      return c.json({
        errors: [{ message: 'You already disliked this comment.' }],
      })
    }

    return c.json(await Dislike.create({ userId, commentId }))
  },
  undoDislikeComment: async (c: Context) => {
    const { id: userId } = c.get('jwtPayload')
    const { commentId } = c.req.param()

    if (idCheck(commentId)) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Invalid commentId.' }],
      })
    }

    const likedComment = await Dislike.findOne({ userId, commentId })

    if (likedComment == null) {
      c.status(400)
      return c.json({
        errors: [{ message: "You haven't disliked this comment yet." }],
      })
    }

    if (String(likedComment.userId) !== userId) {
      c.status(400)
      return c.json({
        errors: [{ message: 'Insufficient permissions.' }],
      })
    }

    return c.json(await Dislike.findOneAndDelete({ userId, commentId }))
  },
}
