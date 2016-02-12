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

  init(){},

  notifyUpdate(name){
    this.trigger(this.data);
  },

  create(objects){
    if(!objects || objects.constructor !== Array)
      return;

    objects.forEach(x => {
      if(x.name && typeof this.data.objects[x.name] === 'undefined')
        this.data.objects[x.name] = (new LanguageObject(x));
    });

    this.trigger(this.data);
  },

  /* object methods */

  checkObjectValue(name, value){
    let object = this.getObject(name);
    if(!object)
      return false;

    return object.getValue() === value;
  },

  getObjectValue(name){
    const object = this.getObject(name);
    return object ? object.getValue() : null;
  },

  setObjectValue(name, value){
    const object = this.getObject(name);
    return object && object.setValue(value);
  },

  getObject(name){
    return this.data.objects[name];
  },

  objectExists(name){
    return this.getObject(name) !== null;
  },

  /* parser methods */

  parse(text){
    this.parser.parse(text)
      .then(result => {
        console.log('parse2', result);
        if(!result)
          return false;

        let checkedCode = {
          checks: result.checks ? result.checks.filter(x => this.objectExists(x.object)) : [],
          assignments: result.assignments ? result.assignments.filter(x => this.objectExists(x.object)) : []
        };

        let newCode = !Object.is(this.data.parsedCode, checkedCode);
        this.data.parsedCode = checkedCode;

        let ci = 0;
        let checksPassed = checkedCode.checks.reduce((x, y) => {
          let valid = this.checkObjectValue(y.object, y.value);
          this.data.parsedCode.checks[ci].valid = valid === true; ci++;
          return x && valid;
        }, true);

        let assignmentsDone = false;
        if(checksPassed){
          let ai = 0;
          assignmentsDone = checkedCode.assignments.reduce((x, y) => {
            let valid = this.setObjectValue(y.object, y.value);
            this.data.parsedCode.assignments[ai].valid = valid === true; ai++;
            return x || valid;
          }, false);
        }

        if(newCode)
          this.trigger(this.data);
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
