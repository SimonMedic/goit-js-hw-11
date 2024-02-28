import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '42599645-d2386b536dbb9a668471d6710';
const perPage = 40;
const currentPage = 1;

const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('[name="searchQuery"]');
const loadMoreButton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', handleSearch);
searchInput.addEventListener('input', handleInputChange);
loadMoreButton.addEventListener('click', handleLoadMore);

async function searchImages(query, page = 1) {
  try {
    const respons = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: page,
      },
    });
    return Response.data;
  } catch (error) {
    console.error('Error while fetching images:', error);
    throw error;
  }
}

async function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (query) {
    try {
      const data = await searchImages(query);
      handleSearchResults(data);
    } catch (error) {
      Notiflix.Notify.failure(
        'Error while searching for images. Please try again.'
      );
    }
  }
}

function handleSearchResults(data) {
  if (data.hits.length === 0) {
    Notiflix.Notify.info(
      'No images found. Please try a different search term.'
    );
    return;
  }
  Notiflix.Notify.success('Hooray! We found ${data.totalHits} images.');
  currentPage = 1;
  renderImages(data.hits);
  showLoadMoreButtonIfNeeded(data.totalHits);
}

function handleInputChange() {
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
}

async function handleLoadMore() {
  const query = searchInput.value.trim();
  try {
    currentPage++;
    const data = await searchImages(query, currentPage);
    renderImages(data.hits);
    showLoadMoreButtonIfNeeded(data.totalHits);
  } catch (error) {
    Notiflix.Notify.failure(
      'Error while loading more images. Please try again.'
    );
  }
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoadMoreButtonIfNeeded(totalHits) {
  if (totalHits > currentPage * perPage) {
    showLoadMoreButtonIfNeeded();
  } else {
    hideLoadMoreButton();
  }
}

function hideLoadMoreButton() {
  loadMoreButton.computedStyleMap.display = 'none';
}

function showLoadMoreButton() {
  loadMoreButton.computedStyleMap.display = 'block';
}

function renderImages(images) {
  images.forEach(image => {
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('photo-card');

    const imgLink = document.createElement('a');
    imgLink.href = image.largeImgURL;
    imgLink.setAttribute('data-lightbox', 'gallery');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';
    img.style.maxWidth = '100%';

    imgLink.appendChild(img);
    imgContainer.appendChild(imgLink);

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info');

    const infoItems = [
      { label: 'Likes', value: image.likes },
      { label: 'Views', value: image.views },
      { label: 'Comments', value: image.comments },
      { label: 'Downloads', value: image.downloads },
    ];
  });
}
