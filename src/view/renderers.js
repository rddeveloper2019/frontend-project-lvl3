/* eslint-disable no-lone-blocks */
import i18n from '../locales';

const clearForm = (elements) => {
  const {
    input, formFeedbackEl, addBtn,
  } = elements;

  formFeedbackEl.classList.remove('text-success');
  formFeedbackEl.classList.remove('text-danger');
  formFeedbackEl.textContent = '';
  input.classList.remove('is-invalid');
  addBtn.removeAttribute('disabled');
};

const renderForm = (elements, flag, message) => {
  const classes = {
    ready: 'text-success',
    editing: 'text-success',
    error: 'text-danger',
  };

  const {
    form,
    input, formFeedbackEl, addBtn,
  } = elements;

  if (flag !== 'editing') {
    clearForm(elements);
  }

  switch (flag) {
    case 'ready': {
      formFeedbackEl.classList.add(classes[flag]);
      formFeedbackEl.textContent = message;
      form.reset();
      input.focus();
    }
      break;
    case 'editing': {
      formFeedbackEl.classList.add(classes[flag]);
      input.classList.remove('is-invalid');
    }
      break;

    case 'sending': {
      addBtn.disabled = true;
    }
      break;
    case 'error': {
      input.classList.add('is-invalid');
      formFeedbackEl.classList.add(classes[flag]);
      formFeedbackEl.textContent = message;
    }
      break;
    default:
  }
};

const addVisitedPost = (elements, data) => {
  const selector = data[data.length - 1];
  const visitedPostEl = elements.postsContainer.querySelector(`a[data-id=${selector}]`);
  visitedPostEl.classList.remove('fw-bold');
  visitedPostEl.classList.remove('link-dark');
  visitedPostEl.classList.add('fw-normal');
  visitedPostEl.classList.add('link-secondary');
};

const renderPosts = (elements, data) => {
  const { posts } = data;
  const { postsContainer } = elements;
  const postsEl = document.createElement('div');
  postsEl.classList.add('card', 'border-0');

  const getLinkClass = (post) => {
    if (post.visited) {
      return 'fw-normal link-dark';
    }
    return 'fw-bold link-dark';
  };

  const template = `
    <div class="card-body"><h2 class="card-title h4">${i18n.t('posts')}</h2></div>
      <ul class="list-group border-0 rounded-0">
        ${posts.map((post) => `
        <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href=${post.link} class=${getLinkClass(post)} data-id=${post.id}
        target="_blank" rel="noopener noreferrer">${post.title}</a><button type="button" class="btn btn-outline-dark btn-sm" data-id=${post.id} data-bs-toggle="modal"
        data-bs-target="#modal">${i18n.t('viewButton')}</button></li>`).join('')}
      </ul>`;
  postsEl.innerHTML = template;
  postsContainer.innerHTML = '';
  postsContainer.append(postsEl);
};

const renderFeeds = (elements, data) => {
  const { feeds } = data;
  const { feedsContainer } = elements;
  const feedsEl = document.createElement('div');
  feedsEl.classList.add('card', 'border-0');

  const template = `
    <div class="card-body"><h2 class="card-title h4">${i18n.t('feeds')}</h2></div>
      <ul class="list-group border-0 rounded-0">
        ${feeds.map((feed) => `<li class="list-group-item border border-dark mb-1 bg-light" data-feed-id="${feed.id}"><h3 class="h6 fw-bold m-0">${feed.title}</h3>
        <p class="m-0 small text-black-50">${feed.description}</p>
        </li>`).join('')}
      </ul>`;

  feedsEl.innerHTML = template;
  feedsContainer.innerHTML = '';
  feedsContainer.append(feedsEl);
};

export default {
  renderForm, renderFeeds, renderPosts, addVisitedPost,
};
