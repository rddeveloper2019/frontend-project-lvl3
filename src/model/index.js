import onChange from 'on-change';
import i18n from '../locales';
import fetchRSS from '../services/fetchRSS';
import HTMLparse from '../services/HTMLparse';
import view from '../view';

const { app } = view;

const model = (initialState, elements) => {
  const state = onChange(initialState, app(elements));

  const handleFormState = (payload = {}) => {
    state.form = { ...state.form, ...payload };
  };

  const handleFeedState = (payload) => {
    const { feeds } = state.feed;
    state.feed.feeds = [...feeds, payload.feed];
  };

  const handleFeedsStore = (payload) => {
    const { feeds } = onChange.target(state).feedsStore;
    const newStore = {
      activeFeedId: payload.id,
      feeds: [payload, ...feeds],
    };
    state.feedsStore = newStore;
  };

  const handlePostsStore = (feedId, newPosts) => {
    const { posts } = onChange.target(state).postsStore;
    if (newPosts.length > 20) {
      // eslint-disable-next-line no-param-reassign
      newPosts.length = 20;
    }
    state.postsStore = { posts: [...newPosts, ...posts] };
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
        handlePostsStore(id, items);
        handleFormState({ status: 'ready', message: [`${i18n.t('form.feedback.success')}`] });
      }).catch((err) => {
        handleFormState({ status: 'error', message: [`${i18n.t('form.feedback.fetchError')}`] });
        throw new Error(err);
      });
  };

  const handlers = {
    handleFormState, handleFeedState, fetchRSSFeeds,
  };

  return { state, handlers };
};

export default model;
