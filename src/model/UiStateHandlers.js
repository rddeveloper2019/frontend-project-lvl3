/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const getUpdatedPosts = (posts, id) => posts.map((post) => {
  if (post.id === id) {
    return { ...post, visited: true };
  }
  return post;
});

const UiStateHandlers = (state) => {
  const addVisitedPostId = (id) => {
    const { posts } = onChange.target(state.postsStore);
    console.log('addvisitedPosts');
    console.log(posts);
    state.postsStore.posts = [...getUpdatedPosts(posts, id)];
    state.UI.visitedPostsIDs = [...state.UI.visitedPostsIDs, id];
  };
  return { addVisitedPostId };
};
export default UiStateHandlers;
