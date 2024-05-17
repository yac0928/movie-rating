import { sign } from 'hono/jwt'

import { User } from '../models'

import { errorMessage } from '../helpers/error-message'

export const userController = {
  signUp: async (c: any) => {
    const { name, email, password } = await c.req.json()
    const registeredEmail = await User.findOne({ email }).lean()

    if (registeredEmail != null) {
      const message = 'Email has already been registered.'
      const name = 'DataBaseError'

      return errorMessage(c, 409, message, name)
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

    return c.json({ success: true, data: user })
  },
  signIn: async (c: any) => {
    const { email, password } = await c.req.json()
    const user = await User.findOne({ email }).lean()

    if (user == null) {
      const message = 'Incorrect username or password!'
      const name = 'DataBaseError'

      return errorMessage(c, 401, message, name)
    }

    if (!(await Bun.password.verify(password, user.password))) {
      const message = 'Incorrect username or password!'
      const name = 'DataBaseError'

      return errorMessage(c, 401, message, name)
    } else if (process.env.JWT_SECRET == null) {
      const message = 'JWT token encountered a generation error.'
      const name = 'ServerError'

      return errorMessage(c, 500, message, name)
    } else {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
      }

      return c.json({
        success: true,
        data: {
          ...payload,
          token: await sign(payload, process.env.JWT_SECRET),
        },
      })
    }
  },
}
