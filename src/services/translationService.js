import en from '../translations/en.json';
import es from '../translations/es.json';

class TranslationService {
  constructor() {
    this.language = 'en';
    this.translations = this.loadFromLocalStorage() || { en, es }; // Carga desde localStorage o usa predeterminados
    this.observers = [];
    this.languageObservers = [];
  }

  setLanguage(language) {
    this.language = language;
    this.notifyObservers();
  }

  getLanguage() {
    return this.language;
  }

  translate(key) {
    return this.translations[this.language]?.[key] || key;
  }

  // Observadores de cambios de idioma actual
  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update(this.language));
  }

  // Observadores para cambios en idiomas disponibles
  subscribeLanguages(observer) {
    this.languageObservers.push(observer);
  }

  unsubscribeLanguages(observer) {
    this.languageObservers = this.languageObservers.filter(obs => obs !== observer);
  }

  notifyLanguageObservers() {
    this.languageObservers.forEach(observer => observer.updateLanguages(Object.keys(this.translations)));
  }

  // Agrega un nuevo idioma y notifica a los observadores
  addLanguage(languageCode, translations = {}) {
    this.translations[languageCode] = translations;
    this.saveToLocalStorage();
    this.notifyLanguageObservers();
  }

  // Agrega o actualiza una traducción en un idioma específico
  addTranslation(languageCode, key, value) {
    if (!this.translations[languageCode]) {
      this.translations[languageCode] = {}; // Si el idioma no existe, lo crea
    }
    this.translations[languageCode][key] = value;
    this.saveToLocalStorage();
  }

  // Elimina un idioma y notifica a los observadores
  removeLanguage(languageCode) {
    delete this.translations[languageCode];
    this.saveToLocalStorage();
    this.notifyLanguageObservers();
  }

  // Guarda todas las traducciones en localStorage
  saveToLocalStorage() {
    localStorage.setItem('translations', JSON.stringify(this.translations));
  }

  // Carga las traducciones de localStorage
  loadFromLocalStorage() {
    try {
      const storedTranslations = localStorage.getItem('translations');
      return storedTranslations ? JSON.parse(storedTranslations) : null;
    } catch (error) {
      console.error("Error al cargar traducciones desde localStorage", error);
      return null;
    }
  }
}

export default new TranslationService();
