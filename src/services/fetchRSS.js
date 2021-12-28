import axios from 'axios';

// const allOriginsAPIUrl = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&charset=utf-8&url=';

const generateUrl = (url) => {
  const baseUrl = new URL('https://hexlet-allorigins.herokuapp.com');
  baseUrl.pathname = 'get';
  baseUrl.searchParams.append('disableCache', true);
  baseUrl.searchParams.append('charset', 'utf-8');
  baseUrl.searchParams.append('url', url);
  return baseUrl.toString();
};

const fetchRSSFeeds = (url) => new Promise((resolve) => {
  // const RSSUrl = new URL(allOriginsAPIUrl + url).toString();
  resolve(
    axios.get(
      generateUrl(url),
    ).catch(() => {
      throw new Error('Network Error');
    }),
  );
});

export default fetchRSSFeeds;
