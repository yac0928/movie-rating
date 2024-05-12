import { Hono } from 'hono'
import { validationErrorHandler } from '../middlewares/validation'
import { userController } from '../controllers/user'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

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
}
