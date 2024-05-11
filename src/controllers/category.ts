import Category from '../models/category'
import { Context } from 'hono'
// import { HTTPException } from 'hono/http-exception'

export const categoryController = {
  getCategories: async (c: Context, next: (error?: any) => void) => {
    try {
      const categories = await Category.find()
      return c.json(categories)
    } catch (err) {
      next(err)
    }
  },
  getCategory: async (c: Context, next: (error?: any) => void) => {
    try {
      const { cid } = c.req.param()
      const category = await Category.findById(cid)
      if (!category) throw new Error('Category not found!')
      return c.json(category)
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (c: Context, next: (error?: any) => void) => {
    try {
      const { name, icon } = await c.req.json()
      if (!name) throw new Error('Name is required!')
      const newCategory = new Category({ name, icon })
      await newCategory.save()
      return c.json(newCategory)
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (c: Context, next: (error?: any) => void) => {
    try {
      const { cid } = c.req.param()
      const { name, icon } = await c.req.json()
      if (!name) throw new Error('Name is required!')
      const updatedCategory = await Category.findByIdAndUpdate(
        cid,
        { name, icon },
        { new: true }
      )
      if (!updatedCategory) throw new Error('Category not found!')
      return c.json(updatedCategory)
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async (c: Context, next: (error?: any) => void) => {
    try {
      const { cid } = c.req.param()
      const deletedCategory = await Category.findByIdAndDelete(cid)
      if (!deletedCategory) throw new Error('Category not found!')
      return c.json(deletedCategory)
    } catch (err) {
      next(err)
    }
  },
}
