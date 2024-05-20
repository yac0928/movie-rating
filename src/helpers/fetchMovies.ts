import { Movie } from '../models'
export async function fetchMovieIds(page: number): Promise<number[]> {
  const baseUrl =
    'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page='
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  }
  const url = `${baseUrl}${page}`
  const response = await fetch(url, options)
  const data = await response.json()
  const movieIds = data.results.map((movie: { id: number }) => movie.id)
  // 該頁的ids
  return movieIds
}

export async function fetchMovieDetails(movieId: number) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  }

  const response = await fetch(url, options)
  const data = await response.json()
  const categoryIds: number[] = data.genres.map(
    (genre: { id: number }) => genre.id
  )
  return {
    id: movieId,
    title: data.title,
    release_date: data.release_date,
    runtime: data.runtime,
    overview: data.overview,
    budget: data.budget,
    avg_rating: 0,
    view: 0,
    trailer_link:
      'https://www.youtube.com/embed/DHUpvwyb49o?si=ux2vrgadtB_pJKLm',
    poster_path: data.poster_path,
    category_ids: categoryIds,
  }
}

export async function saveMovieDetailsBatch(movieDetailsBatch: any[]) {
  const movieIds = movieDetailsBatch.map((movie) => movie.id)
  const existingMovies = await Movie.find({ id: { $in: movieIds } })
    .select('id')
    .lean()
  const existingMovieIds = new Set(existingMovies.map((movie) => movie.id))
  const newMovies = movieDetailsBatch.filter(
    (movie) => !existingMovieIds.has(movie.id)
  )
  if (newMovies.length > 0) {
    await Movie.insertMany(newMovies)
  }
}
