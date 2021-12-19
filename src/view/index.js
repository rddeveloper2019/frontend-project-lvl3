import renderers from './renderers';

const switchFormByStatus = (elements, cb, value) => {
  const { status, message } = value;

  const renderBy = {
    editing: () => { cb(elements, status); },
    sending: () => { cb(elements, status); },
    error: () => { cb(elements, status, message); },
    ready: () => { cb(elements, status, message); },
  };
  renderBy[status]();
};

const view = (elements, i18n) => (path, value) => {
  // console.log('view');
  // console.log(path);
  // console.log(value);

  const {
    renderForm, renderFeeds, renderPosts, addVisitedPost,
  } = renderers(i18n);

  if (path === 'formState') {
    switchFormByStatus(elements.formContainer, renderForm, value);
  } else {
    switch (path) {
      case 'feedsStore':
        renderFeeds(elements.feedsContainer, value);
        break;

      case 'postsStore':
        renderPosts(elements.postsContainer, value);
        break;

      case 'UI.visitedPostsIDs':
        addVisitedPost(elements.postsContainer, value);
        break;

      default:

        break;
    }
  }
};

export default view;
