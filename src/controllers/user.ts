import { User } from '../models'
import { Context } from 'hono'
import { sign } from 'hono/jwt'

export const userController = {
  signUp: async (c: Context, next: (error?: any) => void) => {
    try {
      const { name, email, password } = await c.req.json()
      const registeredEmail = await User.findOne({ email }).lean()

      if (registeredEmail != null) {
        c.status(409)
        return c.json({
          errors: [{ message: 'Email has already been registered.' }],
        })
      }

      const newUser = await User.create({
        name,
        email,
        password: await Bun.password.hash(password, {
          algorithm: 'bcrypt',
          cost: 10, // number between 4-31
        }),
      })

      const { password: removedPassword, ...user } = newUser.toJSON()

      return c.json(user)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  signIn: async (c: Context, next: (error?: any) => void) => {
    try {
      const { email, password } = await c.req.json()
      const user = await User.findOne({ email }).lean()

      if (user == null) {
        c.status(401)
        return c.json({
          errors: [{ message: 'Incorrect username or password!' }],
        })
      }

      if (!(await Bun.password.verify(password, user.password))) {
        c.status(401)
        return c.json({
          errors: [{ message: 'Incorrect username or password!' }],
        })
      } else if (process.env.JWT_SECRET == null) {
        c.status(500)
        return c.json({
          errors: [{ message: 'JWT token encountered a generation error.' }],
        })
      } else {
        const payload = {
          id: user._id,
          name: user.name,
          email: user.email,
        }

        return c.json({
          ...payload,
          token: await sign(payload, process.env.JWT_SECRET),
        })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
}
