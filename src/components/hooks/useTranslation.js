import { useState, useEffect } from 'react';
import translationService from '../services/translationService';

function useTranslation() {
  const [language, setLanguage] = useState(translationService.getLanguage());

  useEffect(() => {
    const observer = {
      update: (newLanguage) => setLanguage(newLanguage),
    };
    translationService.subscribe(observer);

    return () => translationService.unsubscribe(observer);
  }, []);

  const t = (key) => translationService.translate(key);

  return { t, language };
}

export default useTranslation;
