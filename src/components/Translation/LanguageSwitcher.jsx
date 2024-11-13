import React, { useState, useEffect } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import translationService from '../../services/translationService';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const [language, setLanguage] = useState(translationService.getLanguage() || 'en');
  const [availableLanguages, setAvailableLanguages] = useState(Object.keys(translationService.translations));

  useEffect(() => {
    // Suscribirse a cambios en la lista de idiomas
    const observer = {
      updateLanguages: (newLanguages) => {
        setAvailableLanguages(newLanguages);
      }
    };

    translationService.subscribeLanguages(observer);

    return () => {
      translationService.unsubscribeLanguages(observer);
    };
  }, []);

  const handleLanguageChange = (value) => {
    if (value) {
      setLanguage(value);
      translationService.setLanguage(value);
    }
  };

  return (
    <div className="language-switcher-container">
      <ToggleGroup.Root
        type="single"
        value={language}
        onValueChange={handleLanguageChange}
        aria-label="Selector de idioma"
        className="ToggleGroupRoot"
      >
        {availableLanguages.map((lang) => (
          <ToggleGroup.Item
            key={lang}
            value={lang}
            aria-label={lang.toUpperCase()}
            className="ToggleGroupItem"
          >
            {lang.toUpperCase()}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}

export default LanguageSwitcher;
