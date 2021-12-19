import onChange from 'on-change';
import app from '../view';
import stateHandlers from './stateHandlers';
import UiStateHandlers from './UiStateHandlers';
import utils from './utils';

const model = (initialState, i18n, elements) => {
  const state = onChange(initialState, app(elements));

  const {
    handleFormState, autoUpdate, handleFeedsStore, handlePostsStore,
  } = stateHandlers(state);
  const { addVisitedPostId } = UiStateHandlers(state);
  const { getCurrentState, getPostData } = utils(state);
  autoUpdate();
  return {
    state,
    handlers: {
      handleFormState, handleFeedsStore, handlePostsStore, UiHandlers: { addVisitedPostId },
    },
    utilities: { getCurrentState, getPostData },
  };
};

export default model;
