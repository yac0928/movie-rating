import { Document, Schema, model } from 'mongoose'
import Actor from './actor'
import Movie from './movie'

export interface IMovieActor extends Document {
  movieId: Schema.Types.ObjectId
  actorId: Schema.Types.ObjectId
}

const movieActorSchema: Schema<IMovieActor> = new Schema({
  movieId: {
    type: Schema.Types.ObjectId,
    ref: Movie,
    index: true,
    required: true,
  },
  actorId: {
    type: Schema.Types.ObjectId,
    ref: Actor,
    index: true,
    required: true,
  },
})

const MovieActor = model<IMovieActor>('MovieActor', movieActorSchema)

export default MovieActor
