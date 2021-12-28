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
    const addedPosts = getNewUniquePosts(posts, newPosts)
      .map((post) => ({ ...post, id: uniqid('item_'), visited: false }));
    const updatedPosts = [...addedPosts, ...posts];
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
      return channel;
    });

  // const autoFetch = (feeds) => {
  //   const fetches = feeds.map((feed) => fetchRSS(feed.url));
  //   Promise.all(fetches).then((response) => {
  //     response.forEach(({ data }) => {
  //       const { channel } = HTMLparse(data.contents);
  //       const { items } = channel;
  //       setPostsStore(items);
  //     });
  //   });
  // };
  const autoFetch = (feeds) => {
    const fetches = feeds.map((feed) => fetchRSS(feed.url));
    Promise.all(fetches).then((response) => {
      response.forEach(({ data }) => {
        const { channel } = HTMLparse(data.contents);
        const { items } = channel;
        setPostsStore(items);
      });
    }).finally(() => {
      const { posts } = onChange.target(state.postsStore);
      setPostsStore(posts);
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
