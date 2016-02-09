import Reflux from 'reflux';
import Promise from 'promise';

import ObjectActions from '../actions/object';

import LanguageParser from '../classes/parser';
import LanguageObject from '../classes/object';

export default Reflux.createStore({
  listenables: [ObjectActions],
  parser: new LanguageParser(),

  data:{
    objects: []
  },

  init: function(){},

  create: function(objects){
    if(!objects || objects.constructor !== Array)
      return;

    objects.forEach(x => {
      if(x.name && typeof this.data.objects[x.name] === 'undefined')
        this.data.objects[x.name] = (new LanguageObject(x));
    });
  },

  checkObjectValue: function(name, value){
    let object = this.getObjectValue(name);
    if(!object)
      return false;

    return object.getValue() === value;
  },

  setObjectValue: function(name, value){
    let object = this.getObjectValue(name);
    if(object)
      object.setValue(value);
  },

  get: function(name){

  },

  getObjectValue: function(name){
    return this.data.objects[name];
  },

  parse: function(text){
    this.parser.parse(text).then(result => {
      if(result &&
        result.check && result.check.constructor === Array &&
        result.assignment && result.assignment.constructor === Array){
          let checkPassed = result.check.reduce((x, y) => {
            return x && this.checkObjectValue(y.object, y.value);
          }, true);

          if(checkPassed){
            result.assignment.forEach(x => {
              this.setObjectValue(x.object, x.value);
            });
          }
        }
    }, err => {
      console.log('not valid');
    });
  }

  /*
  getObjectOptions(){
    return Object.keys(this.objects).sort();
  }

  getValuesForObject(key){
    let value = this.objects[key];

    if(!value)
      return null;

    return value.getPossibleValues();
  }
  */
});
