import onChange from 'on-change';
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

  const handlers = {
    handleFormState, handleFeedState,
  };

  return { state, handlers };
};

export default model;

fetchRSS('https://ru.hexlet.io/lesson.rss').then((data) => {
  const res = HTMLparse(data.data.contents);
  console.log(res);
}).catch((err) => console.error(err));
