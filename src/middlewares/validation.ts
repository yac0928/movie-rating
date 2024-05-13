import { Context } from 'hono'
import { StatusCode } from 'hono/utils/http-status'
import mongoose, { Types } from 'mongoose'
import { ZodError } from 'zod'

// 定義 data 物件的索引簽名
interface Data {
  [key: string]: string | number
}

// 定義成功時的結果類型
interface SuccessResult {
  success: true
  data: Data // 使用通用的 Data 類型
}

// 定義失敗時的結果類型
interface FailureResult {
  success: false
  error: ZodError<any>
  data: Data // 使用通用的 Data 類型
}

// 將兩種結果類型組合成聯合類型
type ValidationResult = SuccessResult | FailureResult

export function validationErrorHandler(
  result: ValidationResult,
  c: Context,
  status?: StatusCode | undefined
) {
  if (!result.success) {
    // Extract error issues from `result.error`
    const issues = result?.error.issues.map((issue) => {
      let expectedType
      let receivedType

      if ('expected' in issue) {
        expectedType = issue.expected
      }

      if ('received' in issue) {
        receivedType = issue.received
      }

      return {
        param: issue.path.join('.'),
        message: issue.message,
        expectedType,
        receivedType,
      }
    })
    return c.json({ errors: issues }, status)
  }
}

export function idCheck(id: Types.ObjectId | string): boolean {
  return !mongoose.Types.ObjectId.isValid(id)
}
