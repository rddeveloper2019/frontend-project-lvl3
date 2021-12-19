// @ts-check

// eslint-disable-next-line no-unused-vars
import Modal from 'bootstrap';
import init from './init.js';
import elementCreators from './templates';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const { createBootstrapForm } = elementCreators;
  const rootFormBlock = document.querySelector('#root-form');
  const formFeedbackEl = document.querySelector('.feedback');

  const postsContainer = document.querySelector('.posts');
  const feedsContainer = document.querySelector('.feeds');

  const modal = document.querySelector('#modal');
  const modalBody = document.querySelector('.modal-body');
  const modalTitle = document.querySelector('.modal-title');
  const modalReadMoreLink = document.querySelector('[data-more-link]');

  const { form, input, addBtn } = createBootstrapForm();
  rootFormBlock.appendChild(form);

  const elements = {

    formContainer: {
      form, input, addBtn, formFeedbackEl,
    },
    modalContainer: {
      modal, modalBody, modalTitle, modalReadMoreLink,
    },
    postsContainer,
    feedsContainer,

  };

  init(elements);
});
