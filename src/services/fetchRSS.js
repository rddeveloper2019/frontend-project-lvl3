import axios from 'axios';

const allOriginsAPIUrl = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&charset=utf-8&url=';

const generateUrl = (url) => `${allOriginsAPIUrl}${`${url}`}`;

const fetchRSSFeeds = (url) => new Promise((resolve) => {
  resolve(
    axios.get(
      generateUrl(url),
    ),
  );
});

export default fetchRSSFeeds;
