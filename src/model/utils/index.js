import onChange from 'on-change';

const utils = (state) => {
  const getCurrentState = (field = null, subField = null) => {
    const currentState = onChange.target(state);
    if (!field) {
      return currentState;
    }
    if (!subField) {
      return currentState[field];
    }
    return currentState[field][subField];
  };

  const getPostData = (id, selector = 'all') => {
    const { posts } = getCurrentState('postsStore');
    const [currentPost] = posts.filter((post) => post.id === id);
    const postData = { ...currentPost };
    if (selector === 'all') {
      return postData;
    }
    return postData[selector];
  };

  return {
    getCurrentState, getPostData,
  };
};
export default utils;
