import { OpenAPIHono } from '@hono/zod-openapi'
import { categoryController } from '../controllers/category'

export function categoryRoute(app: OpenAPIHono) {
  app.get('/api/category', categoryController.getCategories)
  app.get('/api/category/:cid', categoryController.getCategory)
  app.post('/api/category', categoryController.postCategory)
  app.put('/api/category/:cid', categoryController.putCategory)
  app.delete('/api/category/:cid', categoryController.deleteCategory)
}
