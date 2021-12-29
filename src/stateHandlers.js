/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import uniqid from 'uniqid';
import fetchRSS from './services/fetchRSS';
import HTMLparse from './services/HTMLparse';

const stateHandlers = (state) => {
  const setFormState = (payload = {}) => {
    const { formState } = onChange.target(state);
    state.formState = { ...formState, ...payload };
  };

  const setFeedsStore = (feed) => {
    const { feeds } = onChange.target(state.feedsStore);

    const newStore = {
      feeds: [{ ...feed, id: uniqid('feed_') }, ...feeds],
    };
    state.feedsStore = newStore;
  };

  const setPostsStore = (newPosts) => {
    const getNewUniquePosts = (oldPosts, receivedPosts) => {
      const isPostUnique = (newPost) => oldPosts.every((oldPost) => oldPost.guid !== newPost.guid);
      return receivedPosts.filter(isPostUnique);
    };

    const { posts } = onChange.target(state.postsStore);

    const newAddedPosts = getNewUniquePosts(posts, newPosts)
      .map((post) => ({ ...post, id: uniqid('item_'), visited: false }));

    state.postsStore = { posts: [...newAddedPosts, ...posts] };
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
      return channel;
    });

  const autoUpdate = () => {
    const { feeds } = onChange.target(state.feedsStore);
    if (feeds.length > 0) {
      const fetches = feeds.map((feed) => fetchRSS(feed.url).then(({ data }) => {
        const { channel } = HTMLparse(data.contents);
        const { items } = channel;
        setPostsStore(items);
      }));
      Promise.all(fetches).finally(() => {
        setTimeout(() => { autoUpdate(); }, 5000);
      });
    } else {
      setTimeout(() => { autoUpdate(); }, 5000);
    }
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
