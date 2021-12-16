import axios from 'axios';

const allOriginsAPIUrl = 'https://hexlet-allorigins.herokuapp.com/get?charset=utf-8&url=';

const fetchRSSFeeds = (url) => new Promise((resolve) => {
  const testUrl = 'http://lorem-rss.herokuapp.com/feed';
  const currnentUrl = url || testUrl;
  const RSSUrl = `${allOriginsAPIUrl}${currnentUrl}`;

  resolve(
    axios.get(
      RSSUrl,
    ),
  );
});

export default fetchRSSFeeds;
