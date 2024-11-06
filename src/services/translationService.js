import en from '../translations/en.json';
import es from '../translations/es.json';

class TranslationService {
  constructor() {
    this.language = 'en';
    this.translations = { en, es };
    this.observers = [];
  }

  setLanguage(language) {
    this.language = language;
    this.notifyObservers();
  }
  getLanguage() {
    return this.language;
  }

  translate(key) {
    return this.translations[this.language][key] || key;
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update(this.language));
  }
}

export default new TranslationService();
