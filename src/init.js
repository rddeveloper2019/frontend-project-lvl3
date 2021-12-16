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
  const { state, handlers } = model(initialState, elements);
  controller(state, elements, handlers);
  document.querySelector('#current-state').addEventListener('click', () => {
    console.log(onChange.target(state));
  });
};

export default init;
