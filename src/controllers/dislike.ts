import jwt from 'jsonwebtoken'

import { Comment, Dislike } from '../models'

import { idCheck } from '../middlewares/validation'
import { errorMessage } from '../helpers/error-message'

export const dislikeController = {
  dislikeComment: async (c: any) => {
    const token = c.req.header('Authorization')?.split(' ')[1]

    if (token == null) {
      const message = 'no authorization included in request.'
      const name = 'ServerError'

      return errorMessage(c, 401, message, name)
    }

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!)
    const { id: userId } = payload
    const { commentId } = c.req.param()

    if (idCheck(commentId)) {
      const message = 'Invalid commentId.'
      const name = 'ZodError'

      return errorMessage(c, 400, message, name)
    }

    const [currentComment, likedComment] = await Promise.all([
      Comment.findById(commentId),
      Dislike.findOne({ userId, commentId }),
    ])

    if (currentComment == null) {
      const message = "Comment doesn't existed."
      const name = 'DataBaseError'

      return errorMessage(c, 404, message, name)
    }

    if (likedComment != null) {
      const message = 'You already disliked this comment.'
      const name = 'DataBaseError'

      return errorMessage(c, 400, message, name)
    }

    return c.json({
      success: true,
      data: await Dislike.create({ userId, commentId }),
    })
  },
  undoDislikeComment: async (c: any) => {
    const token = c.req.header('Authorization')?.split(' ')[1]

    if (token == null) {
      const message = 'no authorization included in request.'
      const name = 'ServerError'

      return errorMessage(c, 401, message, name)
    }

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!)
    const { id: userId } = payload
    const { commentId } = c.req.param()

    if (idCheck(commentId)) {
      const message = 'Invalid commentId.'
      const name = 'ZodError'

      return errorMessage(c, 400, message, name)
    }

    const likedComment = await Dislike.findOne({ userId, commentId })

    if (likedComment == null) {
      const message = "You haven't disliked this comment yet."
      const name = 'DataBaseError'

      return errorMessage(c, 400, message, name)
    }

    return c.json({
      success: true,
      data: await Dislike.findOneAndDelete({ userId, commentId }),
    })
  },
}
