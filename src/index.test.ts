import { afterAll, expect, test, describe } from 'bun:test'
import mongoose from 'mongoose'
import app from './app'

const MOCK_ENV = {
  NODE_ENV: 'test',
}

afterAll(async () => {
  await mongoose.connection.dropDatabase()
})

describe('# 測試環境初始化', () => {
  test('GET /', async () => {
    const res = await app.request('/', {}, MOCK_ENV)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello Hono!')
  })
})

describe('# 測試新用戶註冊功能', () => {
  test('POST /api/signup', async () => {
    const newUser = {
      name: 'test',
      email: 'test@example.com',
      password: '12345678',
      confirmedPassword: '12345678',
    }

    const res = await app.request(
      '/api/signup',
      {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      MOCK_ENV
    )
    const { name, email } = await res.json()
    expect(res.status).toBe(200)
    expect(name).toBe(newUser.name)
    expect(email).toBe(newUser.email)
  })
})

describe('# 測試註冊的帳戶名稱已經有人使用', () => {
  test('POST /api/signup', async () => {
    const newUser = {
      name: 'test',
      email: 'test@example.com',
      password: '12345678',
      confirmedPassword: '12345678',
    }

    const res = await app.request(
      '/api/signup',
      {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      MOCK_ENV
    )
    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({
      errors: [
        {
          message: 'Email has already been registered.',
        },
      ],
    })
  })
})

describe('# 測試帳戶登入功能', () => {
  test('POST /api/signin', async () => {
    const newUser = {
      email: 'test@example.com',
      password: '12345678',
    }

    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/

    const res = await app.request(
      '/api/signin',
      {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      MOCK_ENV
    )
    const { email, token } = await res.json()
    expect(res.status).toBe(200)
    expect(email).toBe(newUser.email)
    expect(jwtRegex.test(token)).toBe(true)
  })
})
