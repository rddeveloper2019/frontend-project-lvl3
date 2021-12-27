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

  const getNewUniquePosts = (oldPosts, newPosts) => {
    const isPostUnique = (newPost) => oldPosts.every((oldPost) => oldPost.guid !== newPost.guid);
    return newPosts.filter(isPostUnique);
  };

  const setPostsStore = (newPosts) => {
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
    .then(({ data }) => HTMLparse(data.contents))
    .then((parsed) => parsed.channel)
    .catch((err) => {
      throw new Error(err.message);
    });

  const autoFetch = (feeds) => {
    const fetches = feeds.map((feed) => fetchRSS(feed.url));
    Promise.all(fetches).then((response) => {
      response.forEach(({ data }) => {
        const parsed = HTMLparse(data.contents);
        const { items } = parsed.channel;
        setPostsStore(items);
      });
    });
  };

  const autoUpdate = () => {
    const { feedsStore, formState, autoRefresh } = onChange.target(state);
    const { feeds } = feedsStore;

    let needUpdate;

    if (autoRefresh === 'on' && feeds.length > 0) {
      needUpdate = formState.status === 'ready' || formState.status === 'error';
    }

    setTimeout(() => {
      if (needUpdate) {
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
