/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import i18n from '../locales';

const schema = yup.object().shape({
  value: yup.string()
    .url(i18n.t('form.feedback.invalidUrl'))
    .required(i18n.t('form.feedback.valueRequired'))
    .nullable(),
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
  const { getCurrentState, getPostData } = utilities;
  const { addVisitedPostId } = UiHandlers;
  const { form, input } = elements.formContainer;

  const {
    postsContainer,
  } = elements;

  const {
    modalBody, modalTitle, modalReadMoreLink,
  } = elements.modalContainer;

  input.focus();

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    handleFormState({ status: 'editing', inputValue: value });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    handleFormState({ status: 'sending' });

    const { inputValue } = getCurrentState('formState');
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
    }).catch((err) => console.error(err));
  });

  postsContainer.addEventListener('click', (e) => {
    const dataId = e.target.dataset.id;

    const link = document.querySelector(`a[data-id=${dataId}]`);
    const button = document.querySelector(`button[data-id=${dataId}]`);

    if (e.target === link) {
      addVisitedPostId(dataId);
    }
    if (e.target === button) {
      const { title, description, link: postLink } = getPostData(dataId);
      addVisitedPostId(dataId);
      modalTitle.textContent = title;
      modalBody.textContent = description;
      modalReadMoreLink.setAttribute('href', postLink);
    }
  });
};

export default controller;
