import { Document, Schema, model } from 'mongoose'
import User from './user'
import Comment from './comment'

export interface IDislike extends Document {
  userId: Schema.Types.ObjectId
  commentId: Schema.Types.ObjectId
}

const dislikeSchema: Schema<IDislike> = new Schema({
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

const Dislike = model<IDislike>('Dislike', dislikeSchema)

export default Dislike
