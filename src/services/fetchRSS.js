import axios from 'axios';

const generateUrl = (url) => {
  const baseUrl = new URL('https://hexlet-allorigins.herokuapp.com');
  baseUrl.pathname = 'get';
  baseUrl.searchParams.append('disableCache', true);
  baseUrl.searchParams.append('charset', 'utf-8');
  baseUrl.searchParams.append('url', url);
  return baseUrl.toString();
};

const fetchRSSFeeds = (url) => new Promise((resolve) => {
  resolve(
    axios.get(
      generateUrl(url),
    ).catch(() => {
      throw new Error('Network Error');
    }),
  );
});

export default fetchRSSFeeds;
