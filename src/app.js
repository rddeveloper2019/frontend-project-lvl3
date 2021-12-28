// eslint-disable-next-line no-unused-vars
import Modal from 'bootstrap';
import * as yup from 'yup';
import uniqid from 'uniqid';
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
    setFormState,
    setFeedsStore,
    setPostsStore,
    setPostAsVisited,
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
        const channelId = uniqid('feed_');
        setFeedsStore({
          title,
          description,
          id: channelId,
          url: input.value,
        });
        const itemsWithAdditionalData = items.map((item) => ({
          ...item, channelId, id: uniqid('item_'), visited: false,
        }));
        setPostsStore(itemsWithAdditionalData);
        setFormState({
          status: 'ready',
          message: [`${i18n.t('form.feedback.success')}`],
          inputValue: '',
        });
      })
      .catch((err) => {
        setFormState({
          status: 'error',
          message: [`${i18n.t(`form.feedback.${err.message}`)}`],
        });
      });

    // Promise.all([validateInput(input.value), fetch(input.value)])
    //   .then(([, parsed]) => {
    //     const {
    //       title, description, id, items,
    //     } = parsed;

    //     setFeedsStore({
    //       title,
    //       description,
    //       id,
    //       url: input.value,
    //     });
    //     setPostsStore(items);
    //     setFormState({
    //       status: 'ready',
    //       message: [`${i18n.t('form.feedback.success')}`],
    //       inputValue: '',
    //     });
    //   })
    //   .catch((err) => {
    //     setFormState({
    //       status: 'error',
    //       message: [`${i18n.t(`form.feedback.${err.message}`)}`],
    //     });
    //   });
  });

  postsContainer.addEventListener('click', (e) => {
    const dataId = e.target.dataset.id;

    if (e.target.tagName === 'BUTTON') {
      const { posts } = onChange.target(state).postsStore;
      const [currentPost] = posts.filter((post) => post.id === dataId);
      const { title, description, link } = currentPost;
      modalTitle.textContent = title;
      modalBody.textContent = description;
      modalReadMoreLink.setAttribute('href', link);
      setPostAsVisited(dataId);
    }

    if (e.target.tagName === 'A') {
      setPostAsVisited(dataId);
    }
  });
};

export default app;
