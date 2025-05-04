import { MY_API_KEY } from "/js/config.js";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// 영화 검색 api
export async function fetchMovies(query) {
  const url = `${BASE_URL}/search/movie?api_key=${MY_API_KEY}&language=ko-KR&query=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

// 인기 영화
export async function fetchPopularMovies() {
  const url = `${BASE_URL}/movie/popular?api_key=${MY_API_KEY}&language=ko-KR`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

// 영화 상세 정보 + 북마크 정보
export async function fetchMovieDetails(movieId) {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${MY_API_KEY}&language=ko-KR`;
  const res = await fetch(url);
  return await res.json();
}

export { IMG_URL };
