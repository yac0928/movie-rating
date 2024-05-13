import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { commentController } from '../controllers/comment'
import { validationErrorHandler } from '../middlewares/validation'

const secret = process.env.JWT_SECRET as string

const commentSchema = z.object({
  rating: z.number().positive().int().lte(5),
  comment: z.string(),
})

export function commentRoute(app: Hono) {
  app.get('/api/comments', commentController.getComments)
  app.post(
    '/api/comments/:movieId',
    zValidator('json', commentSchema, (result, c) =>
      validationErrorHandler(result, c, 400)
    ),
    jwt({
      secret,
    }),
    commentController.addComment
  )
  app.put(
    '/api/comments/:movieId',
    zValidator('json', commentSchema, (result, c) =>
      validationErrorHandler(result, c, 400)
    ),
    jwt({
      secret,
    }),
    commentController.updateComment
  )
  app.delete(
    '/api/comments/:movieId',
    jwt({
      secret,
    }),
    commentController.removeComment
  )
}
