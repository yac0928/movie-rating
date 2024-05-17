import Category from '../models/category'
import { Context } from 'hono'

export const categoryController = {
  getCategories: async (c: Context) => {
    const categories = await Category.find()
    return c.json(categories)
  },
  getCategory: async (c: Context) => {
    const { cid } = c.req.param()
    const category = await Category.findById(cid)
    if (!category) throw new Error('Category not found!')
    return c.json(category)
  },
  postCategory: async (c: Context) => {
    const { name, icon } = await c.req.json()
    if (!name) throw new Error('Name is required!')
    const newCategory = new Category({ name, icon })
    await newCategory.save()
    return c.json(newCategory)
  },
  putCategory: async (c: Context) => {
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
  },
  deleteCategory: async (c: Context) => {
    const { cid } = c.req.param()
    const deletedCategory = await Category.findByIdAndDelete(cid)
    if (!deletedCategory) throw new Error('Category not found!')
    return c.json(deletedCategory)
  },
}
