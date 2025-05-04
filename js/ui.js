import { fetchMovieDetails, IMG_URL } from "./api.js";

// 영화 리스트 렌더링
export function renderMovies(movies, container) {
  container.innerHTML = "";
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");

  movies.forEach((movie) => {
    const isBookmarked = bookmarks[movie.id]; // 북마크 상태 확인

    const card = document.createElement("div");
    card.className = "movie-card";
    card.dataset.id = movie.id;

    // 영화 카드
    card.innerHTML = `
      <img src="${
        movie.poster_path
          ? IMG_URL + movie.poster_path
          : "https://via.placeholder.com/200x300"
      }">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}</p>
        <button class="bookmark-button" data-id="${movie.id}">
          ${isBookmarked ? "💜" : "🤍"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// 상세 모달 표시
export async function showModal(movieId) {
  const modal = document.getElementById("modal");
  const modalDetails = document.getElementById("modalDetails");
  const movie = await fetchMovieDetails(movieId);
  modalDetails.innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.overview || "줄거리가 없습니다."}</p>
  `;
  modal.classList.remove("hidden");
}

// 모달 숨기기
export function hideModal() {
  document.getElementById("modal").classList.add("hidden");
}
