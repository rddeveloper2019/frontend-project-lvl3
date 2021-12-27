// eslint-disable-next-line no-unused-vars
import Modal from 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import stateHandlers, { UiStateHandlers } from './handlers';
import utils from './utils';
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
    },
    autoRefresh: 'on',
  };

  const schema = yup.object().shape({
    value: yup
      .string()
      .url(i18n.t('form.feedback.invalidUrl'))
      .required(i18n.t('form.feedback.valueRequired'))
      .nullable(),
  });

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
      modal,
      modalBody,
      modalTitle,
      modalReadMoreLink,
    },
    postsContainer,
    feedsContainer,
  };

  const state = onChange(initialState, view(elements, i18n));

  const {
    handleFormState,
    autoUpdate,
    handleFeedsStore,
    handlePostsStore,
    manualFetch,
  } = stateHandlers(state);

  const { addVisitedPostId } = UiStateHandlers(state);
  const { getCurrentState, getPostData } = utils(state);

  autoUpdate();

  const isUrlUnique = (feeds, url) => {
    if (feeds.length === 0) {
      return true;
    }
    return feeds.every((item) => item.url !== url);
  };

  const elementsEventsController = () => {
    postsContainer.addEventListener('click', (e) => {
      const dataId = e.target.dataset.id;
      const link = document.querySelector(`a[data-id=${dataId}]`);

      if (e.target === link) {
        addVisitedPostId(dataId);
      }

      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'LI') {
        const { title, description, link: postLink } = getPostData(dataId);
        addVisitedPostId(dataId);
        modalTitle.textContent = title;
        modalBody.textContent = description;
        modalReadMoreLink.setAttribute('href', postLink);
      }
    });
  };

  const validateInput = (value) => new Promise((resolve) => {
    resolve(schema.validate({ value }));
  })
    .then(() => '')
    .catch((err) => {
      const error = err.errors;
      if (error.length > 0) {
        return error;
      }
      return '';
    });

  input.focus();

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    handleFormState({ status: 'editing', inputValue: value });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    handleFormState({ status: 'sending' });

    const inputValue = input.value;
    const { feeds } = getCurrentState('feedsStore');

    validateInput(inputValue)
      .then((errorData) => {
        if (errorData) {
          handleFormState({ status: 'error', message: errorData });
          return;
        }

        if (isUrlUnique(feeds, inputValue)) {
          manualFetch(inputValue)
            .then((parsed) => {
              const {
                title, description, id, items,
              } = parsed;
              handleFeedsStore({
                title,
                description,
                id,
                url: inputValue,
              });
              handlePostsStore(items);
              handleFormState({
                status: 'ready',
                message: [`${i18n.t('form.feedback.success')}`],
                inputValue: '',
              });
              elementsEventsController();
            })
            .catch((err) => {
              let errorMessage;
              if (err.message) {
                errorMessage = err.message === 'Invalid Xml Data'
                  ? err.message
                  : 'Network Error';
              } else {
                errorMessage = 'Network Error';
              }
              handleFormState({
                status: 'error',
                message: [
                  `${i18n.t(`form.feedback.fetchErrors.${errorMessage}`)}`,
                ],
              });
            });
        } else {
          handleFormState({
            status: 'error',
            message: [`${i18n.t('form.feedback.duplicatedURL')}`],
          });
        }
      })
      .catch((err) => console.error(err));
  });
};

export default app;
