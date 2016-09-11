import Reflux from 'reflux';
import Promise from 'promise';

export default Reflux.createStore({
  // defaults

  // {'deur': 'door',...}
  mappingClassToUI: {},

  // {'door': 'deur',...}
  mappingUIToClass: {},

  //{'if':'als',...}
  mappingKeywords: {},

  init() {
    this.language = null;
    this.languageConfigNL = require('json!../config/language-nl');
  },

  setLanguage(language) {
    if (language != this.language) {
      this.language = language;
      this.languageConfig = require('json!../config/language-' + this.language);
      this.mappingKeywords = this.languageConfig.keywords
      this.fillMappings();
    }
  },

  getLanguage() {
    return new Promise((resolve, reject) => {
      let checkIt = () => {
        if (!this.language){
          setTimeout(checkIt, 200);
        } else {
          resolve(this.language);
        }
      }
      checkIt()
    });
  },

  fillMappings() {
    let mappingClassToUI = [];
    let mappingUIToClass = [];
    this.languageConfigNL.objects.forEach((nl, i) => {
      let translation = this.languageConfig.objects[i];
      mappingClassToUI[nl.name] = translation.name;
      mappingUIToClass[translation.name] = nl.name;
      nl.values && nl.values.forEach((v, j) => {
        let translationValue = translation.values[j];
        mappingClassToUI[v] = translationValue;
        mappingUIToClass[translationValue] = v;
      })
    });
    console.log('filled mappings', mappingClassToUI);
    this.mappingClassToUI = mappingClassToUI;
    this.mappingUIToClass = mappingUIToClass;
  }

});
