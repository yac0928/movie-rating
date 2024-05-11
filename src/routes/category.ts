import { Hono } from 'hono'
import { categoryController } from '../controllers/category'

export function categoryRoute(app: Hono) {
  app.get('/api/category', categoryController.getCategories)
  app.get('/api/category/:cid', categoryController.getCategory)
  app.post('/api/category', categoryController.postCategory)
  app.put('/api/category/:cid', categoryController.putCategory)
  app.delete('/api/category/:cid', categoryController.deleteCategory)
}
