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

  checkObjectValue(name, value, operator){
    let object = this.getObject(name);
    if(!object)
      return false;

    return object.isTrueStatement(value, operator);
  },

  getObjectValue(name){
    const object = this.getObject(name);
    return object ? object.getValue() : null;
  },

  setObjectValue(name, value){
    const object = this.getObject(name);
    let objectValue;
    if(object)
      objectValue = object.setValue(value);

    return {
      status: object && objectValue.status,
      value: object ? objectValue.value : null
    };
  },

  getObject(name){
    return this.data.objects[name];
  },

  objectExists(name){
    return this.getObject(name) !== null;
  },

  /* parser methods */

  parse(text, assign = false) {
    this.parser.parse(text)
      .then(result => {
        if(!result) {
          return false;
        }

        let checkedCode = {
          checks: result.checks ? result.checks.filter(x => this.objectExists(x.object)) : [],
          assignments: result.assignments ? result.assignments.filter(x => this.objectExists(x.object)) : []
        };

        let parsedCode = JSON.parse(JSON.stringify(checkedCode));
        let ci = 0;
        const checksPassed = checkedCode.checks.reduce((x, y) => {
          const valid = this.checkObjectValue(y.object, y.value, y.operator);
          parsedCode.checks[ci].valid = valid === true;
          ci++;
          return x && valid;
        }, true);

        let assignmentsDone = false;
        if(checksPassed){
          let ai = 0;
          assignmentsDone = checkedCode.assignments.reduce((x, y) => {
            const objectValue = this.setObjectValue(y.object, y.value);
            parsedCode.assignments[ai].valid = objectValue.status === true;
            parsedCode.assignments[ai].value = objectValue.value;
            ai++;
            return x || objectValue.status;
          }, false);
        }

        if(!!assign && !Object.is(this.data.parsedCode, parsedCode)){
          this.data.parsedCode = parsedCode;
          this.trigger(this.data);
        }
      })
      .catch(error => {
        if(!!assign) {
          this.data.parsedCode = null;
          this.trigger(this.data);
        }
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
