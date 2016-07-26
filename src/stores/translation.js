import Reflux from 'reflux';
import Promise from 'promise';
import Config from '../config/config'

export default Reflux.createStore({
  // defaults

  // {'deur': 'door',...}
  mappingClassToUI: {},

  // {'door': 'deur',...}
  mappingUIToClass: {},

  //{'if':'als',...}
  mappingKeywords: {},

  init() {
    this.language = Config.language;
    this.languageConfig = require('json!../config/language-' + this.language);
    this.languageConfigNL = require('json!../config/language-nl');
    this.mappingKeywords = this.languageConfig.keywords
    this.fillMappings();
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
