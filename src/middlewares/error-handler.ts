import { Context } from 'hono'

export function handleApiError(err: Error, c: Context, next: () => void) {
  // 如果有錯誤發生，則處理錯誤；如果沒有錯誤，將控制權交給下一個中間件或路由
  return err != null
    ? err.message != null
      ? c.json({
          errors: [{ message: err.message }],
        })
      : c.json({
          errors: [{ message: err }],
        })
    : next()
}
