import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { movieController } from '../controllers/movie'

const getMoviesRequestSchema = z.object({
  limit: z.number().openapi({
    param: {
      description: '請輸入要取得的電影數量',
    },
    example: 100,
  }),
  offset: z.number().openapi({
    param: {
      description: '請輸入要跳過的電影數量',
    },
    example: 0,
  }),
})

const getMoviesResponseSchema = z.object({
  success: z.boolean().openapi({
    example: true,
  }),
  data: z.array(
    z.object({
      _id: z.string().openapi({
        example: '664ace4026c18b73c494aaf8',
      }),
      title: z.string().openapi({
        example: 'Misericordia',
      }),
      poster_path: z.string().openapi({
        example: '/i1eFKvcUNdyNd53YeEOK2vNkBsL.jpg',
      }),
    })
  ),
})

const GET_Movies = createRoute({
  tags: ['Movie'],
  summary: '取得多筆電影資料',
  description: 'limit, offset 為必填',
  method: 'get',
  path: '/api/movie',
  request: {
    query: getMoviesRequestSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getMoviesResponseSchema,
        },
      },
      description: '成功取得多筆電影資料',
    },
  },
})

const GET_Movie = createRoute({
  tags: ['Movie'],
  summary: '取得單筆電影資料',
  method: 'get',
  path: '/api/movie/{movieId}',
  request: {
    params: z.object({
      movieId: z.string().openapi({
        param: {
          description: '請輸入電影 ID',
        },
        example: '664ace4026c18b73c494aaf8',
      }),
    }),
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
                example: '66446fe8027b6f10ffae65e0',
              }),
              id: z.number().openapi({
                example: 1063574,
              }),
              title: z.string().openapi({
                example: 'Misericordia',
              }),
              release_date: z.date().openapi({
                example: '2024-05-20T00:00:00.000Z',
              }),
              runtime: z.number().openapi({
                example: 102,
              }),
              overview: z.string().openapi({
                example:
                  'This is about 31 year-old Jérémie who returns to Saint-Martial...',
              }),
              budget: z.number().openapi({
                example: 50000000,
              }),
              avg_rating: z.number().openapi({
                example: 3.5,
              }),
              view: z.number().openapi({
                example: 26,
              }),
              trailer_link: z.string().openapi({
                example:
                  'https://www.youtube.com/embed/DHUpvwyb49o?si=ux2vrgadtB_pJKLm',
              }),
              poster_path: z.string().openapi({
                example: '/i1eFKvcUNdyNd53YeEOK2vNkBsL.jpg',
              }),
              category_id: z.array(
                z.number().openapi({
                  example: 35,
                })
              ),
              __v: z.number().openapi({
                example: 0,
              }),
            }),
          }),
        },
      },
      description: '成功取得單筆電影資料',
    },
  },
})

const GET_UpcomingMovies = createRoute({
  tags: ['Movie'],
  summary: '取得多筆即將上映的電影資料',
  description: 'limit, offset 為必填',
  method: 'get',
  path: '/api/upcoming-movie',
  request: {
    query: getMoviesRequestSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getMoviesResponseSchema,
        },
      },
      description: '成功取得多筆即將上映的電影資料',
    },
  },
})

export function movieRoute(app: OpenAPIHono) {
  app.openapi(GET_Movies, movieController.getMovies)
  app.openapi(GET_Movie, movieController.getMovie)
  app.openapi(GET_UpcomingMovies, movieController.getUpcomingMovies)
  app.post('/api/fetch-movie', movieController.fetchMoviesFromTMDB)
}
