import onChange from 'on-change';

const utils = (state) => {
  const getCurrentState = (field = null) => {
    const currentState = onChange.target(state);
    return field ? currentState[field] : currentState;
  };

  return {
    getCurrentState,
  };
};
export default utils;
