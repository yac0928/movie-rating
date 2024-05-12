export function checkEnvironmentVariables() {
  if (process.env.MONGODB_URI == null || process.env.MONGODB_URI === '') {
    throw new Error('MONGODB_URI is not defined.')
  }
  if (process.env.JWT_SECRET == null || process.env.JWT_SECRET === '') {
    throw new Error('JWT_SECRET is not defined.')
  }
}
