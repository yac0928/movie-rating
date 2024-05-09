import { Hono } from 'hono'
import { categoryController } from '../controllers/category'


export const categoryRoute = new Hono()
  .get('/', categoryController.getCategories)
  .post('/', categoryController.postCategory)