import Category from "../models/category"
import { Context } from 'hono'

export const categoryController = {
  getCategories: async (c: Context, next: (error?: any) => void) => {
    try {
      const categories = await Category.find()
      console.log('categories:', categories)
      return c.json(categories)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  postCategory: async (c: Context, next: (error?: any) => void) => {
    try {
      const { name, icon } = await c.req.parseBody()
      console.log('---', name, icon)
      if (!name) throw new Error('Name is required!')
      const newCategory = new Category({ name, icon })
      newCategory.save()
      return c.json(newCategory)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
}