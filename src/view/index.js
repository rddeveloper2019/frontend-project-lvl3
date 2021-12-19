import renderers from './renderers';

const {
  renderForm, renderFeeds, renderPosts, addVisitedPost,
} = renderers;

const renderFormByStatus = (elements, path, value) => {
  const { status, message } = value;

  const renderBy = {
    editing: () => { renderForm(elements.form, status); },
    sending: () => { renderForm(elements.form, status); },
    error: () => { renderForm(elements.form, status, message); },
    ready: () => { renderForm(elements.form, status, message); },
  };
  renderBy[status]();
};

const app = (elements) => (path, value) => {
  if (path === 'form') {
    renderFormByStatus(elements, path, value);
  } else {
    switch (path) {
      case 'feedsStore':
        renderFeeds(elements.feed, value);
        break;

      case 'postsStore':
        renderPosts(elements.post, value);
        break;

      case 'UI.visitedPostsIDs':
        addVisitedPost(elements.post, value);
        break;

      default:

        break;
    }
  }
};

export default { app };
