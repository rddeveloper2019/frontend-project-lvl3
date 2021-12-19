import i18n from 'i18next';

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

i18n.init({
  lng: 'ru', // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    ru,
  },
});

export default i18n;
