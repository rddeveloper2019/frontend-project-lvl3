import axios from 'axios';

const allOriginsAPIUrl = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&charset=utf-8&url=';

const testUrl = 'http://lorem-rss.herokuapp.com/feed';

const generateUrl = (url, mode) => {
  if (mode === 'test') {
    return `${allOriginsAPIUrl}${testUrl}`;
  }
  if (mode === 'develop') {
    return `${allOriginsAPIUrl}${url}`;
  }
  return url;
};

const fetchRSSFeeds = (url) => new Promise((resolve) => {
  resolve(
    axios.get(
      generateUrl(url, 'develop'),
    ),
  );
});

export default fetchRSSFeeds;
