// eslint-disable-next-line no-unused-vars
import Modal from 'bootstrap';
import controller from './controller';
import model from './model';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const app = (i18n) => {
  const initialState = {
    formState: {
      status: 'ready',
      inputValue: null,
      message: null,
    },

    feedsStore: {
      feeds: [],
    },
    postsStore: {
      posts: [],

    },

    UI: {
      visitedPostsIDs: [],
    },
    autoRefresh: 'on',
  };

  const form = document.querySelector('form');
  const input = form.elements['url-input'];
  const addBtn = form.elements['add-feed-button'];
  const formFeedbackEl = document.querySelector('.feedback');

  const postsContainer = document.querySelector('.posts');
  const feedsContainer = document.querySelector('.feeds');

  const modal = document.querySelector('#modal');
  const modalBody = modal.querySelector('.modal-body');
  const modalTitle = modal.querySelector('.modal-title');
  const modalReadMoreLink = modal.querySelector('[data-more-link]');

  const elements = {

    formContainer: {
      form, input, addBtn, formFeedbackEl,
    },
    modalContainer: {
      modal, modalBody, modalTitle, modalReadMoreLink,
    },
    postsContainer,
    feedsContainer,

  };

  const { handlers, utilities } = model(initialState, i18n, elements);
  controller(elements, handlers, utilities, i18n);
};

export default app;
