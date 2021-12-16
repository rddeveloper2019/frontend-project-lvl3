import uniqid from 'uniqid';

const HTMLparse = (xml) => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(xml, 'application/xml');
  const getTextContent = (elelemt, selector) => {
    const elem = elelemt.querySelector(selector);
    if (elem) {
      return elem.textContent;
    }
    return null;
  };
  const parsed = {
    channel: {
      id: uniqid('channel_'),
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

  htmlDoc.querySelectorAll('item').forEach((item) => {
    const itemObj = {
      id: uniqid('item_'),
      title: getTextContent(item, 'title'),
      guid: getTextContent(item, 'guid'),
      link: getTextContent(item, 'link'),
      description: getTextContent(item, 'description'),
      pubDate: getTextContent(item, 'pubDate'),
      category: getTextContent(item, 'category'),
      author: getTextContent(item, 'author'),
    };
    parsed.channel.items.push(itemObj);
  });

  return parsed;
};

export default HTMLparse;
