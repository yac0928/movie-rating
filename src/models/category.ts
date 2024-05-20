import mongoose, { Document, Schema } from 'mongoose'

export interface ICategory extends Document {
  id: number,
  name: string
}

const categorySchema: Schema<ICategory> = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
})

const Category = mongoose.model<ICategory>('Category', categorySchema)

export default Category
