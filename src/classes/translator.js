import Config from '../config/config'

export default class {

  constructor() {
    this.language = Config.language;
    this.languageConfig = require('json!../config/language-' + this.language);
    this.languageConfigNL = require('json!../config/language-nl');
    // maps keywords if, then, and
    //{'if':'als',...}
    this.mappingKeywords = this.languageConfig.keywords
    this.fillMappings();
  }

  getConfig() {
    return this.languageConfig;
  }

  translateClassToUI(input) {
    console.log('class to ui', input, this.mappingClassToUI[input]);
    return this.mappingClassToUI[input];
  }

  translateUIToClass(input) {
    console.log('ui to class', input, this.mappingUIToClass[input]);
    return this.mappingUIToClass[input];
  }

  translateKeywordToUI(input) {
    return this.mappingKeywords[input];
  }

  // maps UI words to classnames, and vice versa
  // {'deur': 'door',...}
  // {'door': 'deur',...}
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

}
