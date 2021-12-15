import onChange from 'on-change';
import View from '../view';

const { app } = View;

const model = (initialState, elements) => {
  const state = onChange(initialState, app(elements));
  return state;
};

export default model;
