export function checkEnvironmentVariables() {
  if (
    process.env.DEV_MONGODB_URI == null ||
    process.env.DEV_MONGODB_URI === ''
  ) {
    throw new Error('DEV_MONGODB_URI is not defined.')
  }
  if (process.env.JWT_SECRET == null || process.env.JWT_SECRET === '') {
    throw new Error('JWT_SECRET is not defined.')
  }
}
