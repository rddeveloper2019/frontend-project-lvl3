import onChange from 'on-change';
import view from '../view';
import stateHandlers from './stateHandlers';
import UiStateHandlers from './UiStateHandlers';
import utils from './utils';

const { app } = view;

const model = (initialState, elements) => {
  const state = onChange(initialState, app(elements));

  const {
    handleFormState, handleFeedState, fetchRSSFeeds, autoUpdate,
  } = stateHandlers(state);

  const { addVisitedPostId } = UiStateHandlers(state);
  const { getCurrentState, getPostData } = utils(state);

  const handlers = {
    handleFormState, handleFeedState, fetchRSSFeeds, UiHandlers: { addVisitedPostId },
  };
  const utilities = { getCurrentState, getPostData };

  autoUpdate();
  return { state, handlers, utilities };
};

export default model;
