import React, { useState } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import translationService from '../../services/translationService';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const [language, setLanguage] = useState(translationService.getLanguage() || 'en');

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
        <ToggleGroup.Item
          value="en"
          aria-label="English"
          className="ToggleGroupItem"
        >
          English
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="es"
          aria-label="Español"
          className="ToggleGroupItem"
        >
          Español
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
}

export default LanguageSwitcher;
