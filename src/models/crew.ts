import mongoose, { Document, Schema } from 'mongoose'

export interface ICrew extends Document {
  name: string
  description: string
  avatar: string
}

const crewSchema: Schema<ICrew> = new Schema({
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

const Crew = mongoose.model<ICrew>('Crew', crewSchema)

export default Crew
