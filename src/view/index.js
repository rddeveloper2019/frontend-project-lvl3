/* eslint-disable no-lone-blocks */

const clearForm = (elements) => {
  const {
    input, formFeedbackEl, addBtn,
  } = elements;

  formFeedbackEl.classList.remove('text-success');
  formFeedbackEl.classList.remove('text-danger');
  formFeedbackEl.textContent = '';
  input.classList.remove('is-invalid');
  addBtn.removeAttribute('disabled');
};

const renderForm = (elements, flag, message) => {
  const classes = {
    ready: 'text-success',
    editing: 'text-success',
    error: 'text-danger',
  };

  console.log(elements);
  const {
    form,
    input, formFeedbackEl, addBtn,
  } = elements;

  switch (flag) {
    case 'ready': {
      clearForm(elements);
      formFeedbackEl.classList.add(classes[flag]);
      formFeedbackEl.textContent = message;
      form.reset();
      input.focus();
    }
      break;
    case 'editing': {
      formFeedbackEl.classList.add(classes[flag]);
      input.classList.remove('is-invalid');
    }
      break;

    case 'sending': {
      clearForm(elements);
      addBtn.disabled = true;
    }
      break;
    case 'error': {
      clearForm(elements);
      input.classList.add('is-invalid');
      formFeedbackEl.classList.add(classes[flag]);
      formFeedbackEl.textContent = message;
    }
      break;
    default:
      return;
  }

  if (flag === 'success') {
    form.reset();
    input.focus();
  }
};

const app = (elements) => (path, value) => {
  console.log(path);
  console.log(value);

  switch (path) {
    case 'form': {
      const { status, message } = value;

      if (status === 'editing') {
        renderForm(elements.form, status);
      }
      if (status === 'sending') {
        renderForm(elements.form, status);
      }
      if (status === 'error') {
        renderForm(elements.form, status, message);
      }
      if (status === 'ready') {
        renderForm(elements.form, status, message);
      }
    }
      break;
    default: {
      console.log('default');
    }
  }
};

export default { app };
