// @ts-check

// eslint-disable-next-line no-unused-vars
import Modal from 'bootstrap';
import init from './init.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const form = document.querySelector('form');
const input = document.querySelector('#url-input');
const addBtn = document.querySelector('#add-feed-button');
const formFeedbackEl = document.querySelector('.feedback');

const postsContainer = document.querySelector('.posts');
const feedsContainer = document.querySelector('.feeds');

const modal = document.querySelector('#modal');
const modalBody = document.querySelector('.modal-body');
const modalTitle = document.querySelector('.modal-title');
const modalReadMoreLink = document.querySelector('[data-more-link]');

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
