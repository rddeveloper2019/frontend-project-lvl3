import axios from 'axios';

const allOriginsAPIUrl = 'https://hhexlet-allorigins.herokuapp.com/get?disableCache=true&charset=utf-8&url=';

const generateUrl = (url) => `${allOriginsAPIUrl}${`${url}`}`;

const fetchRSSFeeds = (url) => new Promise((resolve, reject) => {
  resolve(
    axios.get(
      generateUrl(url),
    ).catch(() => {
      reject(new Error('Network Error'));
    }),
  );
});

export default fetchRSSFeeds;
