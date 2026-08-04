import languages from './translation/translation';
import coreTranslation from './coreTranslation';

const DEFAULT_LANG = 'es_do';

const getActiveLang = () => {
  try {
    const stored = window.localStorage.getItem('app_lang');
    if (stored && coreTranslation.includes(stored)) return stored;
  } catch (_) {}
  return DEFAULT_LANG;
};

const getLabel = (key) => {
  try {
    const lowerCaseKey = key
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/ /g, '_');

    const activeLang = getActiveLang();
    const lang = languages[activeLang];

    if (lang && lang[lowerCaseKey]) return lang[lowerCaseKey];

    const remove_underscore_fromKey = key.replace(/_/g, ' ').split(' ');
    const conversionOfAllFirstCharacterofEachWord = remove_underscore_fromKey.map(
      (word) => word[0]?.toUpperCase() + word.substring(1)
    );
    const label = conversionOfAllFirstCharacterofEachWord.join(' ');

    return label;
  } catch (error) {
    return key || 'No translate';
  }
};

const useLanguage = () => {
  const translate = (value) => getLabel(value);
  return translate;
};

export default useLanguage;
