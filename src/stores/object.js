import Reflux from 'reflux';
import Promise from 'promise';

import ObjectActions from '../actions/object';

import LanguageParser from '../classes/parser';
import LanguageObject from '../classes/object';

export default Reflux.createStore({
  listenables: [ObjectActions],
  parser: new LanguageParser(),

  data:{
    objects: {}
  },

  getDefaultData() {
    return null;
  },

  init: function(){},

  create: function(objects){
    if(!objects || objects.constructor !== Array)
      return;

    objects.forEach(x => {
      if(x.name && typeof this.data.objects[x.name] === 'undefined')
        this.data.objects[x.name] = (new LanguageObject(x));
    });

    this.trigger(this.data.objects);
  },

  checkObjectValue: function(name, value){
    let object = this.getObject(name);
    if(!object)
      return false;

    return object.getValue() === value;
  },

  getObjectValue: function(name){
    let object = this.getObject(name);
    if(object)
      return object.getValue();
  },

  setObjectValue: function(name, value){
    let object = this.getObject(name);
    if(object){
      if(object.setValue(value))
        this.trigger(name);
    }
  },

  getObject: function(name){
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
  },

  getAvailableObjects(){
    return Object.keys(this.data.objects).sort();
  },

  getAvailableValues(){
    const objects = [];
    for(let key in this.data.objects){
      objects.push(this.data.objects[key]);
    }
    return objects.reduce((x, y) => {
      return x.concat(y.getPossibleValues());
    }, []);
  },

  getValuesForObject(key){
    let object = this.data.objects[key];

    if(!object)
      return null;

    return object.getPossibleValues();
  }

});
