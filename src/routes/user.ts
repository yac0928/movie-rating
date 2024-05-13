import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { validationErrorHandler } from '../middlewares/validation'
import { favoriteController } from '../controllers/favorite'
import { dislikeController } from '../controllers/dislike'
import { likeController } from '../controllers/like'
import { userController } from '../controllers/user'

const secret = process.env.JWT_SECRET as string

const signupSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmedPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords don't match",
    path: ['confirmedPassword'],
  })

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export function userRoute(app: Hono) {
  app.post(
    '/api/signup',
    zValidator('json', signupSchema, (result, c) =>
      validationErrorHandler(result, c, 400)
    ),
    userController.signUp
  )
  app.post(
    '/api/signin',
    zValidator('json', signinSchema, (result, c) =>
      validationErrorHandler(result, c, 400)
    ),
    userController.signIn
  )
  app.post(
    '/api/favorites/:movieId',
    jwt({
      secret,
    }),
    favoriteController.addFavorite
  )
  app.delete(
    '/api/favorites/:movieId',
    jwt({
      secret,
    }),
    favoriteController.removeFavorite
  )
  app.post(
    '/api/like/:commentId',
    jwt({
      secret,
    }),
    likeController.likeComment
  )
  app.delete(
    '/api/like/:commentId',
    jwt({
      secret,
    }),
    likeController.undoLikeComment
  )
  app.post(
    '/api/dislike/:commentId',
    jwt({
      secret,
    }),
    dislikeController.dislikeComment
  )
  app.delete(
    '/api/dislike/:commentId',
    jwt({
      secret,
    }),
    dislikeController.undoDislikeComment
  )
}
