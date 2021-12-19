/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import i18n from '../locales';
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

  const getNewUniquePosts = (oldPosts, newPosts) => {
    const isPostUnique = (newPost) => oldPosts.every((oldPost) => oldPost.guid !== newPost.guid);
    return newPosts.filter(isPostUnique);
  };

  const handlePostsStore = (newPosts) => {
    const { posts } = onChange.target(state.postsStore);
    state.postsStore = { posts: [...getNewUniquePosts(posts, newPosts), ...posts] };
  };

  const fetchRSSFeeds = (url) => {
    fetchRSS(url).then(({ data }) => HTMLparse(data.contents))
      .then((parsed) => {
        const {
          title, description, id, items,
        } = parsed.channel;

        handleFeedsStore({
          title, description, id, url,
        });
        handlePostsStore(items);
        handleFormState({ status: 'ready', message: [`${i18n.t('form.feedback.success')}`], inputValue: '' });
      }).catch((err) => {
        handleFormState({ status: 'error', message: [`${i18n.t(`form.feedback.fetchErrors.${err.message}`)}`] });
        throw new Error(err);
      });
  };

  const autoFetch = (feeds) => {
    const fetches = feeds.map((feed) => Promise.resolve(fetchRSS(feed.url, 'auto')));
    Promise.all(fetches)
      .then((response) => {
        response.forEach(({ data }) => {
          HTMLparse(data.contents).then((parsed) => {
            const {
              items,
            } = parsed.channel;
            handlePostsStore(items);
          });
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
    handleFormState, handleFeedsStore, handlePostsStore, fetchRSSFeeds, autoUpdate,
  };
};

export default stateHandlers;
