// eslint-disable-next-line no-unused-vars
import Modal from 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import stateHandlers from './stateHandlers';
import view from './view';
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
      modalData: null,
    },
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
      form,
      input,
      addBtn,
      formFeedbackEl,
    },
    modalContainer: {
      modalBody,
      modalTitle,
      modalReadMoreLink,
    },
    postsContainer,
    feedsContainer,
  };

  const state = onChange(initialState, view(elements, i18n));

  const {
    setFormState,
    setFeedsStore,
    setPostsStore,
    setPostAsVisited,
    setModalData,
    autoUpdate,
    fetch,
  } = stateHandlers(state);

  autoUpdate();

  const validateInput = (value, currentFeeds) => {
    const schema = yup.object().shape({
      value: yup
        .string()
        .url('invalid URL')
        .required('value required')
        .notOneOf(currentFeeds, 'duplicated URL')
        .nullable(),
    });

    return schema.validate({ value });
  };

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    setFormState({ status: 'editing', inputValue: value });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    setFormState({ status: 'sending' });

    const { feeds } = onChange.target(state).feedsStore;
    const currentFeeds = feeds.map((feed) => feed.url);
    validateInput(input.value, currentFeeds)
      .then(() => fetch(input.value))
      .then((channel) => {
        const {
          title, description, items,
        } = channel;
        setFeedsStore({
          title,
          description,
          url: input.value,
        });

        setPostsStore(items);
        setFormState({
          status: 'ready',
          message: 'fetching success',
          inputValue: '',
        });
      })
      .catch((err) => {
        let { message } = err;
        if (message.includes('404') || message.includes('fail')) {
          message = 'Network Error';
        }
        setFormState({
          status: 'error',
          message,
        });
      });
  });

  postsContainer.addEventListener('click', (e) => {
    const dataId = e.target.dataset.id;

    if (e.target.tagName === 'BUTTON') {
      const { posts } = onChange.target(state).postsStore;
      const [currentPost] = posts.filter((post) => post.id === dataId);
      setModalData(currentPost);
      setPostAsVisited(dataId);
    } else if (e.target.tagName === 'A') {
      setPostAsVisited(dataId);
    }
  });
};

export default app;
