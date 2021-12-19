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

  // eslint-disable-next-line no-unused-vars
  const { handlers, utilities, state } = model(initialState, i18n, elements);
  controller(elements, handlers, utilities, i18n);

  //! remove

  // document.querySelector('#current-state').addEventListener('click', () => {
  //   console.log(onChange.target(state));
  // });

  // form.parentElement.querySelectorAll('p.text-muted').forEach((p) => {
  //   p.addEventListener('click', (e) => {
  //     const text = e.target.textContent.split('Пример: ')[1].trim();
  //     input.value = `${text} `;
  //   });
  // });
};

export default app;
