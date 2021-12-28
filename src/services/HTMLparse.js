const getTextContent = (element, selector) => {
  const elem = element.querySelector(selector);
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
      title: getTextContent(htmlDoc, 'title'),
      description: getTextContent(htmlDoc, 'description'),
      link: getTextContent(htmlDoc, 'link'),
      items: [],
    },
  };

  fetchedItems.forEach((item) => {
    const itemObj = {
      title: getTextContent(item, 'title'),
      guid: getTextContent(item, 'guid'),
      link: getTextContent(item, 'link'),
      description: getTextContent(item, 'description'),
    };
    parsed.channel.items.push(itemObj);
  });

  return parsed;
};

export default parse;
