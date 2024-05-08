import { Document, Schema, model } from 'mongoose'
import User from './user'
import Movie from './movie'

export interface IFavorite extends Document {
  userId: Schema.Types.ObjectId
  movieId: Schema.Types.ObjectId
}

const favoriteSchema: Schema<IFavorite> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    index: true,
    required: true,
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: Movie,
    index: true,
    required: true,
  },
})

const Favorite = model<IFavorite>('Favorite', favoriteSchema)

export default Favorite
