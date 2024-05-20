export async function fetchCategories() {
  const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OWNiMTFkNmQwODhiOTk0OWNiZmM2MmZiMWIwMWU4OCIsInN1YiI6IjY2NDA2ODAzYjkwN2E3NGRhNmZhNmM4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XyahbHwzi6wuhSVL6IEBiElIDZ75rR4ZyX9ZCILMebk',
    },
  }
  const response = await fetch(url, options)
  const data = await response.json() // 將回應轉換為 JSON
  return data
}
