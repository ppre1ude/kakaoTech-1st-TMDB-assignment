import { fetchMovies, fetchPopularMovies, fetchMovieDetails } from "./api.js";
import { renderMovies, showModal, hideModal } from "./ui.js";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const movieList = document.getElementById("movieList");
const pageTitle = document.getElementById("page-title");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

async function loadHome() {
  pageTitle.textContent = "검색하기 🔍";
  movieList.innerHTML = ""; // 빈 상태
}

async function loadPopular() {
  pageTitle.textContent = "최근 핫한 영화 둘러보기 😎";
  const movies = await fetchPopularMovies();
  renderMovies(movies, movieList);
}

async function loadBookmarks() {
  pageTitle.textContent = "내 북마크 📚";
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
  const ids = Object.keys(bookmarks);
  const movies = await Promise.all(ids.map((id) => fetchMovieDetails(id)));
  renderMovies(movies, movieList);
}

function updateActiveLink() {
  document.querySelectorAll("nav a").forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === location.hash
    );
  });
}

// SPA 라우팅 기능 만들기
async function router() {
  updateActiveLink();
  switch (location.hash) {
    case "#/popular":
      await loadPopular();
      break;
    case "#/bookmark":
      await loadBookmarks();
      break;
    default:
      await loadHome();
      break;
  }
}

// 검색 기능
async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  location.hash = "#/";
  pageTitle.textContent = `"${query}" 검색 결과`;
  const movies = await fetchMovies(query);
  renderMovies(movies, movieList);
}

// 이벤트 바인딩
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  router();
});

// 검색 버튼 클릭
searchButton.addEventListener("click", handleSearch);

// 엔터로 검색 기능 수행
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// 3. 영화 카드, 북마크 버튼 클릭 이벤트
movieList.addEventListener("click", (e) => {
  const bookmarkBtn = e.target.closest(".bookmark-button");
  if (bookmarkBtn) {
    const id = bookmarkBtn.dataset.id;
    toggleBookmark(id);
    return;
  }

  const card = e.target.closest(".movie-card");
  if (card) {
    const movieId = card.dataset.id;
    showModal(movieId);
  }
});

// 모달 닫기 버튼 클릭
closeModal.addEventListener("click", hideModal);

// 모달 바깥 영역 클릭 시 닫기
modal.addEventListener("click", (e) => {
  if (e.target === modal) hideModal();
});

// 북마크 상태
function toggleBookmark(movieId) {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");

  if (bookmarks[movieId]) {
    delete bookmarks[movieId]; // 이미 북마크 된 경우 제거
  } else {
    bookmarks[movieId] = true; // 북마크 추가
  }

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  // 버튼 ui 업데이트
  const button = document.querySelector(
    `.bookmark-button[data-id="${movieId}"]`
  );
  if (button) {
    button.textContent = bookmarks[movieId] ? "💜" : "🤍";
  }
}
