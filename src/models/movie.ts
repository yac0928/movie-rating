import mongoose, { Document, Schema } from 'mongoose'
import Crew from './crew'
import Category from './category'

export interface IMovie extends Document {
  title: string
  date: Date
  duration: number
  info: string
  avg_rating: number
  categoryId: Schema.Types.ObjectId
  view: number
  crewId: Schema.Types.ObjectId
  trailer_link: string
  photo: string
}

const movieSchema: Schema<IMovie> = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  avg_rating: {
    type: Number,
    default: 0,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: Category,
    required: true,
  },
  view: {
    type: Number,
    default: 0,
  },
  crewId: {
    type: Schema.Types.ObjectId,
    ref: Crew,
    required: true,
  },
  trailer_link: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        return /^(http|https):\/\/[^ "]+$/.test(value)
      },
      message: 'Invalid URL format',
    },
  },
  photo: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(value)
      },
      message: 'Invalid photo format',
    },
  },
})

const Movie = mongoose.model<IMovie>('Movie', movieSchema)

export default Movie
