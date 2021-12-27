/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import fetchRSS from '../services/fetchRSS';
import HTMLparse from '../services/HTMLparse';

const stateHandlers = (state) => {
  const handleFormState = (payload = {}) => {
    const { formState } = onChange.target(state);
    state.formState = { ...formState, ...payload };
  };

  const handleFeedsStore = (payload) => {
    const { feeds } = onChange.target(state.feedsStore);
    const newStore = {
      feeds: [payload, ...feeds],
    };
    state.feedsStore = newStore;
  };

  const handlePostsStore = (newPosts) => {
    const getNewUniquePosts = (oldPosts, addedPosts) => {
      const isPostUnique = (newPost) => oldPosts.every((oldPost) => oldPost.guid !== newPost.guid);
      return addedPosts.filter(isPostUnique);
    };

    const { posts } = onChange.target(state.postsStore);
    const updatedPosts = [...getNewUniquePosts(posts, newPosts), ...posts];
    state.postsStore = { posts: updatedPosts };
  };

  const addVisitedPostId = (id) => {
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

  const manualFetch = (url) => new Promise((resolve, reject) => {
    fetchRSS(url)
      .then(({ data }) => HTMLparse(data.contents))
      .then((parsed) => {
        resolve(parsed.channel);
      })
      .catch((err) => {
        reject(err);
      });
  });

  // const manualFetch = (url) => new Promise((resolve, reject) => {
  //   fetchRSS(url)
  //     .then(({ data }) => HTMLparse(data.contents))
  //     .then((parsed) => {
  //       resolve(parsed.channel);
  //     })
  //     .catch((err) => {
  //       reject(err);
  //     });
  // });

  const autoFetch = (feeds) => {
    const fetches = feeds.map((feed) => Promise.resolve(fetchRSS(feed.url, 'auto')));
    Promise.all(fetches).then((response) => {
      response.forEach(({ data }) => {
        const parsed = HTMLparse(data.contents);
        const { items } = parsed.channel;
        handlePostsStore(items);
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
    handleFormState,
    handleFeedsStore,
    handlePostsStore,
    autoUpdate,
    manualFetch,
    addVisitedPostId,
  };
};

export default stateHandlers;
