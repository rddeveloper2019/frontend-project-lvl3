/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import uniqid from 'uniqid';
import onChange from 'on-change';

const schema = yup.object().shape({
  value: yup.string().url().required(),
});

const isUrlUnique = (array, url) => {
  if (array.length === 0) {
    return true;
  }
  let result = true;
  array.forEach((feed) => {
    if (feed.value === url) {
      result = false;
    }
  });
  return result;
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
        const newFeed = { id: uniqid(), value };
        state.feed.feeds = [newFeed, ...currentState.feed.feeds];
        state.form.success = ['RSS успешно загружен'];
      } else {
        state.form.success = null;
        state.form.error = ['RSS уже существует'];
      }
    }).catch((err) => console.log(err));
  });
};

export default controller;
