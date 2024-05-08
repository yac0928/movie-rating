import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  createAt: Date
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    },
  },
  password: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
})

const User = model('User', userSchema)

export default User
