import controller from './controller';
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

const init = (elements) => {
  const { handlers, utilities } = model(initialState, elements);
  controller(elements, handlers, utilities);
};

export default init;
