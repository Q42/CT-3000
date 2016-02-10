import Reflux from 'reflux';
import Promise from 'promise';

import ObjectActions from '../actions/object';

import LanguageParser from '../classes/parser';
import LanguageObject from '../classes/object';

export default Reflux.createStore({
  listenables: [ObjectActions],
  parser: new LanguageParser(),

  data:{
    objects: {},
    parsedCode: null
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

    this.trigger(this.data);
  },

  /* object methods */

  checkObjectValue: function(name, value){
    let object = this.getObject(name);
    if(!object)
      return false;

    return object.getValue() === value;
  },

  getObjectValue: function(name){
    const object = this.getObject(name);
    return object ? object.getValue() : null;
  },

  setObjectValue: function(name, value){
    const object = this.getObject(name);
    return object && object.setValue(value);
  },

  getObject: function(name){
    return this.data.objects[name];
  },

  /* parser methods */

  parse: function(text){
    this.parser.parse(text).then(result => {
      if(result &&
        result.checks && result.checks.constructor === Array &&
        result.assignments && result.assignments.constructor === Array){
          let newCode = !Object.is(this.data.parsedCode, result);
          this.data.parsedCode = result;
          let ci = 0;
          let checksPassed = result.checks.reduce((x, y) => {
            var valid = this.checkObjectValue(y.object, y.value);

            this.data.parsedCode.checks[ci].valid = valid === true; ci++;
            return x && valid;
          }, true);

          let assignmentsDone = false;
          if(checksPassed){
            let ai = 0;
            assignmentsDone = result.assignments.reduce((x, y) => {
              var valid = this.setObjectValue(y.object, y.value);
              this.data.parsedCode.assignments[ai].valid = valid === true; ai++;
              return x || valid;
            }, false);
          }

          if(newCode || assignmentsDone)
            this.trigger(this.data);

          return checkPassed && assignmentsDone;
        }
    }, err => {
      console.log('not valid');
      return false;
    });
  },

  /* helper methods */

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
