import renderers from './renderers';

const {
  renderForm, renderFeeds, renderPosts, addVisitedPost,
} = renderers;

const switchFormByStatus = (elements, path, value) => {
  const { status, message } = value;

  const renderBy = {
    editing: () => { renderForm(elements, status); },
    sending: () => { renderForm(elements, status); },
    error: () => { renderForm(elements, status, message); },
    ready: () => { renderForm(elements, status, message); },
  };
  renderBy[status]();
};

const app = (elements) => (path, value) => {
  console.log(path);
  if (path === 'form' || path === 'formState') {
    switchFormByStatus(elements.formContainer, path, value);
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

export default app;
