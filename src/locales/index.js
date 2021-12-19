import i18next from 'i18next';

const ru = {
  translation: {

    form: {
      feedback: {
        success: 'RSS успешно загружен',
        invalidUrl: 'Ссылка должна быть валидным URL',
        valueRequired: 'Не должно быть пустым',
        duplicatedURL: 'RSS уже существует',
        fetchErrors: {
          'Invalid Xml Data': 'Ресурс не содержит валидный RSS',
          'Network Error': 'Ошибка сети',
        },

      },
    },

    feeds: 'Фиды',
    posts: 'Посты',
    viewButton: 'Просмотр',

  },
};

const i18n = i18next.createInstance();
i18n.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

export default i18n;
