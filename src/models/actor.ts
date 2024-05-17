import mongoose, { Document, Schema } from 'mongoose'

export interface IActor extends Document {
  name: string
  description: string
  avatar: string
}

const actorSchema: Schema<IActor> = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
})

const Actor = mongoose.model<IActor>('Actor', actorSchema)

export default Actor
