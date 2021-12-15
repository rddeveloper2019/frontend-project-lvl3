import controller from './controller';
import model from './model';

const initialState = {
  appLanguage: 'ru',
  form: {
    value: '',
    error: null,
  },
  feed: {
    activeFeedId: '',
    feeds: [],
    posts: {
      feedId: [],
    },
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

formFeedbackEl.textContent = '';

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
  const state = model(initialState, elements);

  controller(state, elements);
};

export default init;
