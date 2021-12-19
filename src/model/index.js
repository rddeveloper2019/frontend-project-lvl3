import onChange from 'on-change';
import app from '../view';
import stateHandlers from './stateHandlers';
import UiStateHandlers from './UiStateHandlers';
import utils from './utils';

const model = (initialState, elements) => {
  const state = onChange(initialState, app(elements));

  const {
    handleFormState, fetchRSSFeeds, autoUpdate,
  } = stateHandlers(state);
  const { addVisitedPostId } = UiStateHandlers(state);
  const { getCurrentState, getPostData } = utils(state);
  autoUpdate();
  return {
    state,
    handlers: {
      handleFormState, fetchRSSFeeds, UiHandlers: { addVisitedPostId },
    },
    utilities: { getCurrentState, getPostData },
  };
};

export default model;
