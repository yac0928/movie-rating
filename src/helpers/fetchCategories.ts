export async function fetchCategories() {
  const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  }
  const response = await fetch(url, options)
  const data = await response.json() // 將回應轉換為 JSON
  return data
}
