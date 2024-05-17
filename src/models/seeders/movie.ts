import mongoose, { Schema } from 'mongoose'
import Movie, { IMovie } from '../movie'

// 連接到 MongoDB 數據庫
mongoose.connect(process.env.MONGODB_URI!)

// 生成指定範圍內的隨機整數
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 生成指定範圍內的隨機浮點數
function getRandomFloat(
  min: number,
  max: number,
  decimalPlaces: number
): number {
  const rand = Math.random() * (max - min) + min
  return parseFloat(rand.toFixed(decimalPlaces))
}

// 生成指定範圍日期的隨機日期
function getRandomDate(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime()
  const end = endDate.getTime()
  const randomTime = start + Math.random() * (end - start)
  return new Date(randomTime)
}

// 生成假資料的數量
const numOfFakeData = 900

// 建立假資料
const fakeMovies: IMovie[] = []
for (let i = 101; i <= numOfFakeData; i++) {
  const fakeMovie: IMovie = new Movie({
    title: `Fake Movie ${i}`,
    date: getRandomDate(new Date('2022-01-01'), new Date('2024-06-30')),
    duration: getRandomInt(90, 180),
    info: `This is a fake movie ${i}`,
    avg_rating: getRandomFloat(1, 5, 1),
    view: getRandomInt(500, 1000),
    trailer_link: `https://www.youtube.com/watch?v=${i}`,
    photo: `fake_movie_${i}.jpg`,
  })
  fakeMovies.push(fakeMovie)
}

// 將假資料插入到 MongoDB 中
async function insertFakeData() {
  Promise.all(fakeMovies.map((movie) => movie.save()))
    .then(() => console.log('All fake movies saved successfully'))
    .catch((err) => console.error('Error saving fake movies:', err))
}

// 執行插入假資料的函式
insertFakeData()
