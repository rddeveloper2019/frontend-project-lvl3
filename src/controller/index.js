/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import i18n from '../locales';

yup.setLocale({
  string: {
    url: i18n.t('form.feedback.invalidUrl'),
  },
});

const schema = yup.object().shape({
  value: yup.string().url().required(),
});

const validateInput = (value) => new Promise((resolve) => {
  resolve(schema.validate({ value }));
}).then(() => '').catch((err) => {
  const error = err.errors;
  if (error.length > 0) {
    return error;
  }
  return '';
});

const isUrlUnique = (feeds, url) => {
  if (feeds.length === 0) {
    return true;
  }
  return feeds.every((item) => item.url !== url);
};

const controller = (elements, handlers, utilities) => {
  const { handleFormState, fetchRSSFeeds, UiHandlers } = handlers;
  const { getCurrentState } = utilities;
  const { addVisitedPostId } = UiHandlers;
  const { form, input } = elements.form;

  const {
    postsContainer,
  } = elements.post;

  input.focus();

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    handleFormState({ status: 'editing', inputValue: value });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    handleFormState({ status: 'sending' });

    const { inputValue } = getCurrentState('form');
    const { feeds } = getCurrentState('feedsStore');

    validateInput(inputValue).then((errorData) => {
      if (errorData) {
        handleFormState({ status: 'error', message: errorData });
        return;
      }

      if (isUrlUnique(feeds, inputValue)) {
        fetchRSSFeeds(inputValue);
      } else {
        handleFormState({ status: 'error', message: [`${i18n.t('form.feedback.duplicatedURL')}`] });
      }
    }).catch((err) => console.log(err));
  });

  postsContainer.addEventListener('click', (e) => {
    e.preventDefault();
    const dataId = e.target.dataset.id;
    // const postElement = document.querySelector(`li[data-id=${dataId}]`);
    const link = document.querySelector(`a[data-id=${dataId}]`);
    const button = document.querySelector(`button[data-id=${dataId}]`);

    if (e.target === link) {
      addVisitedPostId(dataId);
    }
    if (e.target === button) {
      addVisitedPostId(dataId);
    }
  });
};

export default controller;
