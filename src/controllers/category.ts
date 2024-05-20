import Category from '../models/category'
import { Context } from 'hono'
import { fetchCategories } from '../helpers/fetchCategories'

export const categoryController = {
  getCategories: async (c: any) => {
    const categories = await Category.find()
    return c.json(categories)
  },
  getCategory: async (c: any) => {
    const { categoryId } = c.req.param()
    const category = await Category.findById(categoryId)
    if (!category) throw new Error('Category not found!')
    return c.json(category)
  },
  postCategory: async (c: any) => {
    const { name, icon } = await c.req.json()
    if (!name) throw new Error('Name is required!')
    const newCategory = new Category({ name, icon })
    await newCategory.save()
    return c.json(newCategory)
  },
  putCategory: async (c: any) => {
    const { categoryId } = c.req.param()
    const { name, icon } = await c.req.json()
    if (!name) throw new Error('Name is required!')
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, icon },
      { new: true }
    )
    if (!updatedCategory) throw new Error('Category not found!')
    return c.json(updatedCategory)
  },
  deleteCategory: async (c: any) => {
    const { categoryId } = c.req.param()
    const deletedCategory = await Category.findByIdAndDelete(categoryId)
    if (!deletedCategory) throw new Error('Category not found!')
    return c.json(deletedCategory)
  },
  // 抓一次就好了，不要重複抓
  postCategoriesFromTMDB: async (c: any) => {
    const categories = await fetchCategories()
    await Category.insertMany(categories.genres)
    return c.json(categories)
  },
}
