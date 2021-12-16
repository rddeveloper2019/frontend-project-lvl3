import i18n from 'i18next';

const ru = {
  translation: {

    form: {
      feedback: {
        success: 'RSS успешно загружен',
        invalidUrl: 'Ссылка должна быть валидным URL',
        duplicatedURL: 'RSS уже существует',
      },
    },

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
