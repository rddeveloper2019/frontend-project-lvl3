/* eslint-disable no-param-reassign */
import * as yup from 'yup';

const isUrlUnique = (feeds, url) => {
  if (feeds.length === 0) {
    return true;
  }
  return feeds.every((item) => item.url !== url);
};

const elementsEventsController = (elements, { UiHandlers }, { getPostData }) => {
  const { addVisitedPostId } = UiHandlers;
  const {
    modalBody, modalTitle, modalReadMoreLink,
  } = elements.modalContainer;

  const {
    postsContainer,
  } = elements;

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

const controller = (elements, handlers, utilities, i18n) => {
  const {
    handleFormState, handleFeedsStore, handlePostsStore, manualFetch,
  } = handlers.stateHandlers;
  const { getCurrentState } = utilities;

  const { form, input } = elements.formContainer;

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

  input.focus();

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    handleFormState({ status: 'editing', inputValue: value });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    handleFormState({ status: 'sending' });

    const inputValue = input.value;
    const { feeds } = getCurrentState('feedsStore');

    validateInput(inputValue).then((errorData) => {
      if (errorData) {
        handleFormState({ status: 'error', message: errorData });
        return;
      }

      if (isUrlUnique(feeds, inputValue)) {
        manualFetch(inputValue).then((parsed) => {
          const {
            title, description, id, items,
          } = parsed;
          handleFeedsStore({
            title, description, id, url: inputValue,
          });
          handlePostsStore(items);
          handleFormState({ status: 'ready', message: [`${i18n.t('form.feedback.success')}`], inputValue: '' });
          elementsEventsController(elements, handlers, utilities);
        }).catch((err) => {
          let errorMessage;
          if (err.message) {
            errorMessage = err.message === 'Invalid Xml Data' ? err.message : 'Network Error';
          } else {
            errorMessage = 'Network Error';
          }
          handleFormState({ status: 'error', message: [`${i18n.t(`form.feedback.fetchErrors.${errorMessage}`)}`] });
        });
      } else {
        handleFormState({ status: 'error', message: [`${i18n.t('form.feedback.duplicatedURL')}`] });
      }
    }).catch((err) => console.error(err));
  });
};

export default controller;
