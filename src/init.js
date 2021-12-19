import i18next from 'i18next';
import app from './app';
import ru from './locales';

const init = () => new Promise((resolve) => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });
  resolve(i18n);
}).then((i18n) => app(i18n)).catch((e) => console.error(e));

export default init;
