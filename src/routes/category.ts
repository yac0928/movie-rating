import { OpenAPIHono } from '@hono/zod-openapi'
import { categoryController } from '../controllers/category'

export function categoryRoute(app: OpenAPIHono) {
  app.get('/api/category', categoryController.getCategories)
  app.get('/api/category/:categoryId', categoryController.getCategory)
  app.post('/api/category', categoryController.postCategory)
  app.post('/api/fetch-category', categoryController.postCategoriesFromTMDB)
  app.put('/api/category/:categoryId', categoryController.putCategory)
  app.delete('/api/category/:categoryId', categoryController.deleteCategory)
}
