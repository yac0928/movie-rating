import mongoose, { Document, Schema } from 'mongoose'

export interface ICategory extends Document {
  name: string
  icon: string
}

const categorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
})

const Category = mongoose.model<ICategory>('Category', categorySchema)

export default Category
