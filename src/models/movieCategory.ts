import { Document, Schema, model } from 'mongoose'
import Category from './category'
import Movie from './movie'

export interface IMovieCategory extends Document {
  movieId: Schema.Types.ObjectId
  categoryId: Schema.Types.ObjectId
}

const movieCategorySchema: Schema<IMovieCategory> = new Schema({
  movieId: {
    type: Schema.Types.ObjectId,
    ref: Movie,
    index: true,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: Category,
    index: true,
    required: true,
  },
})

const MovieCategory = model<IMovieCategory>(
  'MovieCategory',
  movieCategorySchema
)

export default MovieCategory
