import controller from './controller';
import elementCreators from './templates';
import model from './model';

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

const init = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const { createBootstrapForm } = elementCreators;
    const rootFormBlock = document.querySelector('#root-form');
    const formFeedbackEl = document.querySelector('.feedback');

    const postsContainer = document.querySelector('.posts');
    const feedsContainer = document.querySelector('.feeds');

    const modal = document.querySelector('#modal');
    const modalBody = document.querySelector('.modal-body');
    const modalTitle = document.querySelector('.modal-title');
    const modalReadMoreLink = document.querySelector('[data-more-link]');

    const { form, input, addBtn } = createBootstrapForm();
    rootFormBlock.appendChild(form);

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

    const { handlers, utilities } = model(initialState, elements);
    controller(elements, handlers, utilities);
  });
};

export default init;
