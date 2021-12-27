import axios from 'axios';

const allOriginsAPIUrl = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&charset=utf-8&url=';

const fetchRSSFeeds = (url) => new Promise((resolve) => {
  const RSSUrl = new URL(allOriginsAPIUrl + url);
  resolve(
    axios.get(
      RSSUrl,
    ).catch(() => {
      throw new Error('Network Error');
    }),
  );
});

export default fetchRSSFeeds;
