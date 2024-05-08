import { Document, Schema, model } from 'mongoose'
import User from './user'
import Movie from './movie'

export interface IComment extends Document {
  userId: Schema.Types.ObjectId
  movieId: Schema.Types.ObjectId
  rating: number
  comment: String
}

const commentSchema: Schema<IComment> = new Schema({
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
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
})

const Comment = model<IComment>('Comment', commentSchema)

export default Comment
