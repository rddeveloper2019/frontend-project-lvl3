import onChange from 'on-change';
import view from '../view';
import stateHandlers from './stateHandlers';

const { app } = view;

const model = (initialState, elements) => {
  const state = onChange(initialState, app(elements));

  const {
    handleFormState, handleFeedState, fetchRSSFeeds, autoUpdate,
  } = stateHandlers(state);

  const handlers = {
    handleFormState, handleFeedState, fetchRSSFeeds,
  };

  autoUpdate('on');
  return { state, handlers };
};

export default model;
