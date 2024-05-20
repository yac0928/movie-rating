import mongoose, { Document, Schema } from 'mongoose'
import Category from './category'

export interface IMovie extends Document {
  id: number
  title: string
  release_date: Date
  runtime: number
  overview: string
  budget: number
  avg_rating: number
  view: number
  trailer_link: string
  poster_path: string
  category_ids: number[]
}

const movieSchema: Schema<IMovie> = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  release_date: {
    type: Date,
    required: true,
  },
  runtime: {
    type: Number,
  },
  overview: {
    type: String,
  },
  budget: {
    type: Number,
  },
  avg_rating: {
    type: Number,
    default: 0,
  },
  view: {
    type: Number,
    default: 0,
  },
  trailer_link: {
    type: String,
  },
  poster_path: {
    type: String,
  },
  category_ids: [
    {
      type: Number,
      ref: 'Category',
      localField: 'category_ids',
      foreignField: 'id',
    },
  ],
})
movieSchema.virtual('category_id', {
  ref: 'Category',
  localField: 'category_ids',
  foreignField: 'id',
})

const Movie = mongoose.model<IMovie>('Movie', movieSchema)

export default Movie
