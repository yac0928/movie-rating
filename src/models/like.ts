import { Document, Schema, model } from 'mongoose'
import User from './user'
import Comment from './comment'

export interface ILike extends Document {
  userId: Schema.Types.ObjectId
  commentId: Schema.Types.ObjectId
}

const likeSchema: Schema<ILike> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    index: true,
    required: true,
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: Comment,
    index: true,
    required: true,
  },
})

const Like = model<ILike>('Like', likeSchema)

export default Like
