import Reflux from 'reflux';
import Promise from 'promise';

export default Reflux.createStore({
  languages : [
    {code: 'nl', flag: require('../assets/img/flags/NL.png') },
    {code: 'en', flag: require('../assets/img/flags/GB.png') },
    {code: 'de', flag: require('../assets/img/flags/DE.png') }
  ],

  // {'deur': 'door',...}
  mappingClassToUI: {},

  // {'door': 'deur',...}
  mappingUIToClass: {},

  //{'if':'als',...}
  mappingKeywords: {},

  init() {
    this.language = null;
    this.languageConfigNL = require('json-loader!../config/language-nl');
  },

  setLanguage(language) {
    if (language != this.language) {
      this.language = language;
      this.languageConfig = require('json-loader!../config/language-' + this.language);
      this.mappingKeywords = this.languageConfig.keywords;
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
    this.mappingClassToUI = mappingClassToUI;
    this.mappingUIToClass = mappingUIToClass;
  }

});
