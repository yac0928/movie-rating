import { Hono } from 'hono'
import { categoryController } from '../controllers/category'

export function categoryRoute(app: Hono) {
  app.get('/api/category', categoryController.getCategories)
  app.post('/api/category', categoryController.postCategory)
}
