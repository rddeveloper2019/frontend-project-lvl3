import onChange from 'on-change';
import controller from './controller';
import model from './model';

const initialState = {
  form: {
    status: 'ready',
    inputValue: null,
    message: null,
  },
  feedsStore: {
    activeFeedId: '',
    feeds: [],
  },
  postsStore: {
    posts: [],
  },
  UI: {
    visitedPostsIDs: [],
  },
};

const form = document.querySelector('form');
const input = form.elements['url-input'];
const addBtn = form.elements['add-feed-button'];
const formFeedbackEl = document.querySelector('.feedback');
const postsContainer = document.querySelector('.posts');
const posts = postsContainer.querySelectorAll('li');
const feedsContainer = document.querySelector('.feeds');
const feeds = feedsContainer.querySelectorAll('li');

const elements = {
  form: {
    form, input, addBtn, formFeedbackEl,
  },
  post: {
    postsContainer, posts,
  },
  feed: {
    feedsContainer, feeds,
  },

};

const init = () => {
  const { state, handlers, utilities } = model(initialState, elements);
  controller(elements, handlers, utilities);

  //! remove

  document.querySelector('#current-state').addEventListener('click', () => {
    console.log(onChange.target(state));
  });

  form.parentElement.querySelectorAll('p.text-muted').forEach((p) => {
    p.addEventListener('click', (e) => {
      const text = e.target.textContent.split('Пример: ')[1].trim();
      input.value = `${text} `;
    });
  });
};

export default init;
