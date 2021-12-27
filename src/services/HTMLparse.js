import uniqid from 'uniqid';

const getTextContent = (elelemt, selector) => {
  const elem = elelemt.querySelector(selector);
  if (elem) {
    return elem.textContent;
  }
  return null;
};

const parse = (xml) => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(xml, 'application/xml');
  const fetchedItems = htmlDoc.querySelectorAll('item');
  const parserError = htmlDoc.querySelector('parsererror');

  if (parserError) {
    throw new Error('Invalid Xml Data');
  }

  const parsed = {
    channel: {
      id: uniqid('feed_'),
      title: getTextContent(htmlDoc, 'title'),
      description: getTextContent(htmlDoc, 'description'),
      link: getTextContent(htmlDoc, 'link'),
      webMaster: getTextContent(htmlDoc, 'webMaster'),
      language: getTextContent(htmlDoc, 'language'),
      lastBuildDate: getTextContent(htmlDoc, 'lastBuildDate'),
      items: [],
      image: {
        url: getTextContent(htmlDoc, 'image url'),
        title: getTextContent(htmlDoc, 'image title'),
        description: getTextContent(htmlDoc, 'image description'),
        link: getTextContent(htmlDoc, 'image link'),

      },
    },
  };

  fetchedItems.forEach((item) => {
    const itemObj = {
      channelId: parsed.channel.id,
      id: uniqid('item_'),
      title: getTextContent(item, 'title'),
      guid: getTextContent(item, 'guid'),
      link: getTextContent(item, 'link'),
      description: getTextContent(item, 'description'),
      pubDate: getTextContent(item, 'pubDate'),
      category: getTextContent(item, 'category'),
      author: getTextContent(item, 'author'),
      visited: false,
    };
    parsed.channel.items.push(itemObj);
  });

  return parsed;
};

// const HTMLparse = (xml) => new Promise((resolve) => {
//   resolve(parse(xml));
// });

// export default HTMLparse;
export default parse;
