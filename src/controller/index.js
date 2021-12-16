/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import onChange from 'on-change';
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

const getCurrentState = (state, field = null) => {
  const currentState = onChange.target(state);
  return field ? currentState[field] : currentState;
};

const controller = (state, elements, handlers) => {
  const { handleFormState, fetchRSSFeeds } = handlers;
  const { form, input } = elements.form;
  input.focus();

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    handleFormState({ status: 'editing', inputValue: value });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    handleFormState({ status: 'sending' });

    const { inputValue } = getCurrentState(state, 'form');
    const { feeds } = getCurrentState(state, 'feedsStore');

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
};

export default controller;
