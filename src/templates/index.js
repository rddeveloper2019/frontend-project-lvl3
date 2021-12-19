const createElement = (options = {}, elements = []) => {
  const {
    tagName = 'div', classes = [], attributes = {}, textContent = '',
  } = options;

  const newElement = document.createElement(tagName);

  newElement.textContent = textContent;
  if (classes.length > 0) {
    classes.forEach((cl) => {
      newElement.classList.add(cl);
    });
  }

  if (elements.length > 0) {
    elements.forEach((el) => {
      newElement.append(el);
    });
  }

  if (attributes) {
    Object.entries(attributes).forEach(([attrName, attrValue]) => {
      newElement.setAttribute(attrName, attrValue);
    });
  }

  return newElement;
};

const createBootstrapForm = () => {
  const form = createElement({
    tagName: 'form',
    classes: ['rss-form', 'text-body'],
  });

  const input = createElement({
    tagName: 'input',
    classes: ['form-control', 'w-100'],
    attributes: {
      id: 'url-input',
      name: 'url',
      'aria-label': 'url',
      placeholder: 'ссылка RSS',
      autocomplete: 'off',
      required: '',
    },
  });

  const label = createElement({ tagName: 'label', textContent: 'Ссылка RSS', attributes: { for: 'url-input' } });
  const inputAndLabelDiv = createElement(
    { classes: ['col'] },
    [createElement({ classes: ['form-floating'] }, [input, label])],
  );

  const addBtn = createElement({
    tagName: 'button',
    attributes: {
      type: 'submit',
      'aria-label': 'add',
      id: 'add-feed-button',

    },
    classes: ['h-100', 'btn', 'btn-lg', 'btn-dark', 'px-sm-5', 'border', 'border-light'],
    textContent: 'Добавить',
  });

  const buttonDiv = createElement({ classes: ['col-auto'] }, [addBtn]);
  const formInner = createElement({ classes: ['row'] }, [inputAndLabelDiv, buttonDiv]);

  form.append(formInner);
  return {
    form, input, addBtn,
  };
};

const elementCreators = {
  createElement,
  createBootstrapForm,
};
export default elementCreators;
