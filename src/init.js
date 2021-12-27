import i18next from 'i18next';
import app from './app';
import ru from './locales';

const init = () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });
  app(i18n);
};
init();

export default init;
