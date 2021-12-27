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

  // const elementsEventsController = () => {
  //   postsContainer.addEventListener('click', (e) => {
  //     const dataId = e.target.dataset.id;
  //     const link = document.querySelector(`a[data-id=${dataId}]`);

  //     if (e.target === link) {
  //       addVisitedPostId(dataId);
  //     }

  //     if (e.target.tagName === 'BUTTON' || e.target.tagName === 'LI') {
  //       const { title, description, link: postLink } = getPostData(dataId);
  //       addVisitedPostId(dataId);
  //       modalTitle.textContent = title;
  //       modalBody.textContent = description;
  //       modalReadMoreLink.setAttribute('href', postLink);
  //     }
  //   });
  // };

  const validateInput = (value) => {
    const currentFeeds = getCurrentState('feedsStore', 'feeds').map((feed) => feed.url);
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

  input.focus();

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    handleFormState({ status: 'editing', inputValue: value });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    handleFormState({ status: 'sending' });

    const inputValue = input.value;

    Promise.all([validateInput(inputValue), manualFetch(inputValue)])
      .then(([, parsed]) => {
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
        // elementsEventsController();
      })
      .catch((err) => {
        handleFormState({
          status: 'error',
          message: [
            `${i18n.t(`form.feedback.${err.message}`)}`,
          ],
        });
      });
  });

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

export default app;
