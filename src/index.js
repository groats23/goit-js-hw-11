import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.getElementById('search-form'),
  imgGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  appSlogan: document.querySelector('.app-slogan'),
};

const API_KEY = '37014373-51d1c962a9905aff05771b673';

class ImageFinder {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.totalHits = 0;
  }

  async fetchImages() {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: this.perPage,
        },
      });

      const data = response.data;
      this.totalHits = data.totalHits;
      this.incrementPage();

      return data;
    } catch (error) {
      console.log('Error fetching images:', error);
      return { hits: [] };
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

const imageFinder = new ImageFinder();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onSearchClick(e) {
  e.preventDefault();

  resetMarkup();

  const searchName = e.currentTarget.elements.searchQuery.value.trim();
  imageFinder.searchQuery = searchName;

  if (searchName !== '') {
    imageFinder.resetPage();
    const imgDataSet = await imageFinder.fetchImages();

    if (imgDataSet.hits.length > 0) {
      hideSlogan();
    } else {
      showNoImagesMessage();
    }

    renderImgGallery(imgDataSet);

    if (imgDataSet.hits.length < imgDataSet.totalHits) {
      showLoadBtn();
    } else {
      hideLoadBtn();
    }
  } else {
    notifySearchNameAbsence();
    showSlogan();
  }
}

async function onLoadMoreClick() {
  const nextImgDataSet = await imageFinder.fetchImages();
  renderImgGallery(nextImgDataSet);

  if ((imageFinder.page - 1) * imageFinder.perPage >= imageFinder.totalHits) {
    hideLoadBtn();
  }
}

function renderImgGallery(data) {
  const imgCards = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
        <a class="photo-card__item" href="${largeImageURL}">
          <div class="photo-card__tumb">
            <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </div>
          <div class="info">
            <p class="info-item">
              <b class="info-item__param">Likes</b>
              <span class="info-item__num">${likes}</span>
            </p>
            <p class="info-item">
              <b class="info-item__param">Views</b>
              <span class="info-item__num">${views}</span>
            </p>
            <p class="info-item">
              <b class="info-item__param">Comments</b>
              <span class="info-item__num">${comments}</span>
            </p>
            <p class="info-item">
              <b class="info-item__param">Downloads</b>
              <span class="info-item__num">${downloads}</span>
            </p>
          </div>
        </a>
      </div>`
    )
    .join('');

  refs.imgGallery.insertAdjacentHTML('beforeend', imgCards);

  lightbox.refresh();

  makeSmoothScroll();
}

function resetMarkup() {
  if (refs.imgGallery.childNodes.length !== 0) {
    refs.imgGallery.innerHTML = '';
    hideLoadBtn();
    showSlogan();
  }
}

function hideLoadBtn() {
  refs.loadMoreBtn.classList.add('js-hidden');
}

function showLoadBtn() {
  refs.loadMoreBtn.classList.remove('js-hidden');
}

function hideSlogan() {
  refs.appSlogan.classList.add('js-hidden');
}

function showSlogan() {
  refs.appSlogan.classList.remove('js-hidden');
}

function notifySearchNameAbsence() {
  Notiflix.Notify.info(
    'No, no, no! God, no! To search for pictures you need to specify what you are looking for.',
    {
      position: 'right-bottom',
    }
  );
}

function makeSmoothScroll() {
  if (imageFinder.page - 1 > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 1.72,
      behavior: 'smooth',
    });
  }
}
