/* eslint-disable no-param-reassign */
import onChange from 'on-change';

import fetchRSS from './services/fetchRSS';
import HTMLparse from './services/HTMLparse';

const stateHandlers = (state) => {
  const setFormState = (payload = {}) => {
    const { formState } = onChange.target(state);
    state.formState = { ...formState, ...payload };
  };

  const setFeedsStore = (payload) => {
    const { feeds } = onChange.target(state.feedsStore);
    const newStore = {
      feeds: [payload, ...feeds],
    };
    state.feedsStore = newStore;
  };

  const setPostsStore = (newPosts) => {
    const getNewUniquePosts = (oldPosts, receivedPosts) => {
      const isPostUnique = (newPost) => oldPosts.every((oldPost) => oldPost.guid !== newPost.guid);
      return receivedPosts.filter(isPostUnique);
    };

    const { posts } = onChange.target(state.postsStore);
    const updatedPosts = [...getNewUniquePosts(posts, newPosts), ...posts];
    state.postsStore = { posts: updatedPosts };
  };

  const setPostAsVisited = (id) => {
    const getUpdatedPosts = (posts, postId) => posts.map((post) => {
      if (post.id === postId) {
        return { ...post, visited: true };
      }
      return post;
    });

    const { posts } = onChange.target(state.postsStore);

    state.postsStore.posts = [...getUpdatedPosts(posts, id)];
    state.UI.visitedPostsIDs = [...state.UI.visitedPostsIDs, id];
  };

  const fetch = (url) => fetchRSS(url)
    .then(({ data }) => {
      const { channel } = HTMLparse(data.contents);
      // channel.id = uniqid('feed_');
      return channel;
    });

  const autoFetch = (feeds) => {
    const fetches = feeds.map((feed) => fetchRSS(feed.url));
    Promise.all(fetches).then((response) => {
      response.forEach(({ data }) => {
        const { channel } = HTMLparse(data.contents);
        const { items } = channel;
        setPostsStore(items);
      });
    });
  };

  const autoUpdate = () => {
    const { feeds } = onChange.target(state.feedsStore);

    setTimeout(() => {
      if (feeds.length > 0) {
        autoFetch(feeds);
        autoUpdate();
      } else {
        autoUpdate();
      }
    }, 5000);
  };

  return {
    setFormState,
    setFeedsStore,
    setPostsStore,
    setPostAsVisited,
    autoUpdate,
    fetch,

  };
};

export default stateHandlers;
