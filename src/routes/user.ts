import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { jwt } from 'hono/jwt'

import { favoriteController } from '../controllers/favorite'
import { dislikeController } from '../controllers/dislike'
import { likeController } from '../controllers/like'
import { userController } from '../controllers/user'

const secret = process.env.JWT_SECRET as string

const signupSchema = z
  .object({
    name: z.string().min(1).openapi({
      example: 'test',
    }),
    email: z.string().email().openapi({
      example: 'test@example.com',
    }),
    password: z.string().min(3).openapi({
      example: '123456',
    }),
    confirmedPassword: z.string().min(3).openapi({
      example: '123456',
    }),
  })
  .refine(
    (data) => data.password === data.confirmedPassword,
    () => ({
      code: undefined,
      message: "Passwords don't match",
      path: ['confirmedPassword'],
    })
  )

const signinSchema = z.object({
  email: z.string().email().openapi({
    example: 'test@example.com',
  }),
  password: z.string().openapi({
    example: '123456',
  }),
})

const POST_signUp = createRoute({
  tags: ['User'],
  summary: '送出使用者註冊資料',
  description: 'name, email, password, confirmedPassword 為必填',
  method: 'post',
  path: '/api/signup',
  request: {
    body: { content: { 'application/json': { schema: signupSchema } } },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({
              example: true,
            }),
            data: z.object({
              name: z.string().openapi({
                example: 'Jarred Sumner',
              }),
              email: z.string().openapi({
                example: 'jarred@example.com',
              }),
              _id: z.string().openapi({
                example: '66443b101236ec4082a30b40',
              }),
              createAt: z.string().openapi({
                example: '2024-05-15T03:30:00.000Z',
              }),
              __v: z.number().openapi({
                example: 0,
              }),
            }),
          }),
        },
      },
      description: '註冊成功的使用者資料',
    },
  },
})

const POST_signIn = createRoute({
  tags: ['User'],
  summary: '送出使用者登入資料',
  description: 'email 及 password 為必填',
  method: 'post',
  path: '/api/signin',
  request: {
    body: { content: { 'application/json': { schema: signinSchema } } },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({
              example: true,
            }),
            data: z.object({
              _id: z.string().openapi({
                example: '66443b101236ec4082a30b40',
              }),
              name: z.string().openapi({
                example: 'Jarred Sumner',
              }),
              email: z.string().openapi({
                example: 'jarred@example.com',
              }),
              token: z.string().openapi({
                example:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDQzYjEwMTIzNmVjNDA4MmEzMGI0MCIsIm5hbWUiOiJKYXJyZWQgU3VtbmVyIiwiZW1haWwiOiJqYXJyZWRAZXhhbXBsZS5jb20ifQ.t3mKE4aRvDxAbV1GV_Zi8J7iTSGTI378uZXvBIOW_iE',
              }),
            }),
          }),
        },
      },
      description: '登入成功的使用者資料',
    },
  },
})

const FavoriteParamsSchema = z.object({
  movieId: z.string().openapi({
    param: {
      name: 'movieId',
      in: 'path',
      description: '請輸入電影 ID',
      required: true,
    },
    example: '663f7907f5b09cc307e80780',
  }),
})

const POST_favorite = createRoute({
  tags: ['Favorite'],
  summary: '新增使用者收藏電影',
  method: 'post',
  path: '/api/favorites/{movieId}',
  security: [
    {
      JWT_Token: [],
    },
  ],
  request: {
    params: FavoriteParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({
              example: true,
            }),
            data: z.object({
              userId: z.string().openapi({
                example: '663df6eb5ea60afb31e42eef',
              }),
              movieId: z.string().openapi({
                example: '663f7907f5b09cc307e80780',
              }),
              _id: z.string().openapi({
                example: '66446fe8027b6f10ffae65e0',
              }),
              __v: z.number().openapi({
                example: 0,
              }),
            }),
          }),
        },
      },
      description: '成功新增收藏電影',
    },
  },
})

const DELETE_favorite = createRoute({
  tags: ['Favorite'],
  summary: '移除使用者收藏電影',
  method: 'delete',
  path: '/api/favorites/{movieId}',
  request: {
    params: FavoriteParamsSchema,
  },
  security: [
    {
      JWT_Token: [],
    },
  ],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({
              example: true,
            }),
            data: z.object({
              _id: z.string().openapi({
                example: '66446fe8027b6f10ffae65e0',
              }),
              userId: z.string().openapi({
                example: '663df6eb5ea60afb31e42eef',
              }),
              movieId: z.string().openapi({
                example: '663f7907f5b09cc307e80780',
              }),
              __v: z.number().openapi({
                example: 0,
              }),
            }),
          }),
        },
      },
      description: '成功移除收藏電影',
    },
  },
})

const LikeAndDislikeParamsSchema = z.object({
  commentId: z.string().openapi({
    param: {
      name: 'commentId',
      in: 'path',
      description: '請輸入評論 ID',
      required: true,
    },
    example: '66422b160cf8b035aa816225',
  }),
})

const POST_like = createRoute({
  tags: ['Like'],
  summary: '新增使用者按攢評論',
  method: 'post',
  path: '/api/like/{commentId}',
  security: [
    {
      JWT_Token: [],
    },
  ],
  request: {
    params: LikeAndDislikeParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({
              example: true,
            }),
            data: z.object({
              userId: z.string().openapi({
                example: '663df6eb5ea60afb31e42eef',
              }),
              commentId: z.string().openapi({
                example: '66422b160cf8b035aa816225',
              }),
              _id: z.string().openapi({
                example: '664716496456e9695a421cfa',
              }),
              __v: z.number().openapi({
                example: 0,
              }),
            }),
          }),
        },
      },
      description: '成功按攢評論',
    },
  },
})

const DELETE_like = createRoute({
  tags: ['Like'],
  summary: '移除使用者按攢評論',
  method: 'delete',
  path: '/api/like/{commentId}',
  security: [
    {
      JWT_Token: [],
    },
  ],
  request: {
    params: LikeAndDislikeParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({
              example: true,
            }),
            data: z.object({
              _id: z.string().openapi({
                example: '664716496456e9695a421cfa',
              }),
              userId: z.string().openapi({
                example: '663df6eb5ea60afb31e42eef',
              }),
              commentId: z.string().openapi({
                example: '66422b160cf8b035aa816225',
              }),
              __v: z.number().openapi({
                example: 0,
              }),
            }),
          }),
        },
      },
      description: '收回按攢評論',
    },
  },
})

const POST_dislike = createRoute({
  tags: ['Dislike'],
  summary: '新增使用者倒攢評論',
  method: 'post',
  path: '/api/dislike/{commentId}',
  security: [
    {
      JWT_Token: [],
    },
  ],
  request: {
    params: LikeAndDislikeParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({
              example: true,
            }),
            data: z.object({
              userId: z.string().openapi({
                example: '663df6eb5ea60afb31e42eef',
              }),
              commentId: z.string().openapi({
                example: '66422b160cf8b035aa816225',
              }),
              _id: z.string().openapi({
                example: '664717b600608c91153b6ffd',
              }),
              __v: z.number().openapi({
                example: 0,
              }),
            }),
          }),
        },
      },
      description: '成功倒攢評論',
    },
  },
})

const DELETE_dislike = createRoute({
  tags: ['Dislike'],
  summary: '移除使用者倒攢評論',
  method: 'delete',
  path: '/api/dislike/{commentId}',
  security: [
    {
      JWT_Token: [],
    },
  ],
  request: {
    params: LikeAndDislikeParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({
              example: true,
            }),
            data: z.object({
              _id: z.string().openapi({
                example: '664717b600608c91153b6ffd',
              }),
              userId: z.string().openapi({
                example: '663df6eb5ea60afb31e42eef',
              }),
              commentId: z.string().openapi({
                example: '66422b160cf8b035aa816225',
              }),
              __v: z.number().openapi({
                example: 0,
              }),
            }),
          }),
        },
      },
      description: '收回倒攢評論',
    },
  },
})

export function userRoute(app: OpenAPIHono) {
  app.openapi(POST_signUp, userController.signUp)
  app.openapi(POST_signIn, userController.signIn)
  app.openapi(POST_favorite, favoriteController.addFavorite)
  app.openapi(DELETE_favorite, favoriteController.removeFavorite)
  app.openapi(POST_like, likeController.likeComment)
  app.openapi(DELETE_like, likeController.undoLikeComment)
  app.openapi(POST_dislike, dislikeController.dislikeComment)
  app.openapi(DELETE_dislike, dislikeController.undoDislikeComment)
}
