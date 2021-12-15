/* eslint-disable no-lone-blocks */
import _ from 'lodash';

const clearForm = (elements) => {
  const {
    input, formFeedbackEl,
  } = elements;

  formFeedbackEl.classList.remove('text-success');
  formFeedbackEl.classList.remove('text-danger');
  formFeedbackEl.textContent = '';
  input.classList.remove('is-invalid');
};

const renderForm = (elements, feedbackText, flag) => {
  console.log(feedbackText);
  if (!feedbackText) {
    return;
  }
  const classes = {
    success: 'text-success',
    error: 'text-danger',
  };

  const {
    form,
    input, formFeedbackEl,
  } = elements;

  clearForm(elements);

  if (flag === 'error') {
    input.classList.add('is-invalid');
  }
  if (flag === 'success') {
    form.reset();
    input.focus();
  }
  formFeedbackEl.classList.add(classes[flag]);
  formFeedbackEl.textContent = feedbackText;
};

const app = (elements) => (path, value, prevValue) => {
  console.log(path);
  console.log(value);
  console.log(elements);

  switch (path) {
    case 'form.error': {
      if (value !== prevValue) {
        renderForm(elements.form, value, 'error');
      }
    }
      break;
    case 'form.inputData': {
      if (!_.isEqual(value, prevValue)) {
        clearForm(elements.form);
      }
    }
      break;
    case 'form.success': {
      renderForm(elements.form, value, 'success');
    }
      break;
    case 'feed.feeds': {
      console.log(value);
    }
      break;
    default: {
      console.log('default');
    }
  }
};

export default { app };
