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
