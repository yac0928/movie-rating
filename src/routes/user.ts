import { Hono } from 'hono'
import { userController } from '../controllers/user'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

export const signupSchema = z
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

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export function userRoute(app: Hono) {
  app.post(
    '/api/signup',
    zValidator('json', signupSchema, (result, c) => {
      if (!result.success) {
        // Extract error issues from `result.error`
        const issues = result?.error.issues.map((issue) => {
          let expectedType
          let receivedType

          if ('expected' in issue) {
            expectedType = issue.expected
          }

          if ('received' in issue) {
            receivedType = issue.received
          }

          return {
            param: issue.path.join('.'),
            message: issue.message,
            expectedType,
            receivedType,
          }
        })
        return c.json({ errors: issues }, 400)
      }
    }),
    userController.signUp
  )
  app.post(
    '/api/signin',
    zValidator('json', signinSchema, (result, c) => {
      if (!result.success) {
        // Extract error issues from `result.error`
        const issues = result?.error.issues.map((issue) => {
          let expectedType
          let receivedType

          if ('expected' in issue) {
            expectedType = issue.expected
          }

          if ('received' in issue) {
            receivedType = issue.received
          }

          return {
            param: issue.path.join('.'),
            message: issue.message,
            expectedType,
            receivedType,
          }
        })
        return c.json({ errors: issues }, 400)
      }
    }),
    userController.signIn
  )
}
