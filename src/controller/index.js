/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import uniqid from 'uniqid';
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

const isUrlUnique = (array, url) => {
  if (array.length === 0) {
    return true;
  }
  return array.every((item) => item.url !== url);
};

const validateInput = (value) => new Promise((resolve) => {
  resolve(schema.validate({ value }));
}).then(() => '').catch((err) => {
  const error = err.errors;
  if (error.length > 0) {
    return error;
  }
  return '';
});

const controller = (state, elements) => {
  const { form, input } = elements.form;
  input.focus();
  input.addEventListener('input', (e) => {
    const { value } = e.target;
    state.form.value = value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentState = onChange.target(state);
    const { value } = currentState.form;
    validateInput(value).then((errorData) => {
      if (errorData) {
        state.form.error = errorData;
      } else if (isUrlUnique(currentState.feed.feeds, value)) {
        const newFeed = { id: uniqid(), url: value };
        state.feed.feeds = [newFeed, ...currentState.feed.feeds];
        state.form.success = [`${i18n.t('form.feedback.success')}`];
      } else {
        state.form.success = null;
        state.form.error = [`${i18n.t('form.feedback.duplicatedURL')}`];
      }
    }).catch((err) => console.log(err));
  });
};

export default controller;
