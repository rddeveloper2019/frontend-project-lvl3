/* eslint-disable no-lone-blocks */
const createElement = (tagName = 'div', classes = [], attributes = null, textContent = '') => {
  const newElement = document.createElement(tagName);
  if (textContent) {
    newElement.textContent = textContent;
  }
  if (classes.length > 0) {
    classes.forEach((cl) => {
      newElement.classList.add(cl);
    });
  }
  if (attributes) {
    Object.entries(attributes).forEach(([attrName, attrValue]) => {
      newElement.setAttribute(attrName, attrValue);
    });
  }
  return newElement;
};

const createCardsContainer = ({ title }) => {
  const container = createElement('div', ['card', 'border-0']);
  const cartBody = createElement('div', ['card-body']);
  const cardTitle = createElement('h2', ['card-title', 'h4'], null, title);
  cartBody.append(cardTitle);
  container.append(cartBody);
  return container;
};

const clearForm = (formContainer) => {
  const { input, formFeedbackEl, addBtn } = formContainer;

  formFeedbackEl.classList.remove('text-success');
  formFeedbackEl.classList.remove('text-danger');
  formFeedbackEl.textContent = '';
  input.classList.remove('is-invalid');
  addBtn.removeAttribute('disabled');
  input.removeAttribute('readonly');
};

const renderForm = (formContainer, flag, message) => {
  const classes = {
    ready: 'text-success',
    editing: 'text-success',
    error: 'text-danger',
  };
  const {
    form, input, formFeedbackEl, addBtn,
  } = formContainer;

  if (flag !== 'editing') {
    clearForm(formContainer);
  }

  switch (flag) {
    case 'ready':
      {
        formFeedbackEl.classList.add(classes[flag]);
        formFeedbackEl.textContent = message;
        form.reset();
        input.focus();
      }
      break;
    case 'editing':
      {
        formFeedbackEl.classList.add(classes[flag]);
        input.classList.remove('is-invalid');
      }
      break;

    case 'sending':
      {
        addBtn.disabled = true;
        input.setAttribute('readonly', 'readonly');
      }
      break;
    case 'error':
      {
        input.classList.add('is-invalid');
        formFeedbackEl.classList.add(classes[flag]);
        formFeedbackEl.textContent = message;
      }
      break;
    default:
  }
};

const addVisitedPost = (postsContainer, data) => {
  const selector = data[data.length - 1];
  const visitedPostEl = postsContainer.querySelector(`a[data-id=${selector}]`);

  visitedPostEl.classList.remove('fw-bold');
  visitedPostEl.classList.remove('link-dark');
  visitedPostEl.classList.add('fw-normal');
  visitedPostEl.classList.add('link-secondary');
};

const renderPosts = (container, data, i18n) => {
  const { posts } = data;
  const getLinkClass = (post) => {
    if (post.visited) {
      return ['fw-normal', 'link-dark'];
    }
    return ['fw-bold', 'link-dark'];
  };

  const postsContainer = createCardsContainer({
    title: i18n.t(
      'posts',
    ),
  });

  const ul = createElement('ul', ['list-group', 'border-0', 'rounded-0']);
  posts.forEach((post) => {
    const li = createElement('li', ['list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0']);

    const linkAttributes = {
      href: post.link,
      'data-id': post.id,
      target: '_blank',
      rel: 'noopener',
      noreferrer: '',
    };
    const a = createElement('a', getLinkClass(post), linkAttributes, post.title);

    const buttonAttributes = {
      'data-id': post.id,
      'data-bs-toggle': 'modal',
      'data-bs-target': '#modal',
      type: 'button',
    };

    const button = createElement('button', ['btn', 'btn-outline-dark', 'btn-sm'], buttonAttributes, i18n.t('viewButton'));

    li.append(a);
    li.append(button);
    ul.append(li);
  });

  postsContainer.append(ul);
  // eslint-disable-next-line no-param-reassign
  container.innerHTML = '';
  container.append(postsContainer);
};

const renderFeeds = (container, data, i18n) => {
  const { feeds } = data;

  const feedsContainer = createCardsContainer({
    title: i18n.t(
      'feeds',
    ),
  });
  const ul = createElement('ul', ['list-group', 'border-0', 'rounded-0']);
  feeds.forEach((feed) => {
    const li = createElement('li', ['list-group-item', 'border', 'border-dark', 'mb-1', 'bg-light'], { 'data-feed-id': feed.id });
    const titleEl = createElement('h3', ['h6', 'fw-bold', 'm-0'], null, feed.title);
    const descrEl = createElement('p', ['m-0', 'small', 'text-black-50'], null, feed.description);
    li.append(titleEl);
    li.append(descrEl);
    ul.append(li);
  });
  feedsContainer.append(ul);

  // eslint-disable-next-line no-param-reassign
  container.innerHTML = '';
  container.append(feedsContainer);
};

const switchFormByStatus = (container, data) => {
  const { status, message } = data;

  const renderBy = {
    editing: () => {
      renderForm(container, status);
    },
    sending: () => {
      renderForm(container, status);
    },
    error: () => {
      renderForm(container, status, message);
    },
    ready: () => {
      renderForm(container, status, message);
    },
  };
  renderBy[status]();
};

const view = (elements, i18n) => (path, value) => {
  if (path === 'formState') {
    switchFormByStatus(elements.formContainer, value);
  }
  switch (path) {
    case 'feedsStore':
      renderFeeds(elements.feedsContainer, value, i18n);
      break;

    case 'postsStore':
      renderPosts(elements.postsContainer, value, i18n);
      break;

    case 'UI.visitedPostsIDs':
      addVisitedPost(elements.postsContainer, value);
      break;

    default:
      break;
  }
};

export default view;
