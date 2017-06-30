import Reflux from 'reflux';

import ObjectActions from '../actions/object';

import LanguageParser from '../classes/parser';
import LanguageObject from '../classes/object';

export default Reflux.createStore({
  listenables: [ObjectActions],
  parser: new LanguageParser(),
  tempParsedCode: '',

  data:{
    objects: {},
    parsedCode: null,
    failedLines: []
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

  parseMulti(lines) {
    this.tempParsedCode = null;
    this.data.failedLines = [];

    this.parseMultiHandle(lines);
  },

  parseMultiHandle(lines) {
    const keys = Object.keys(lines);

    if(keys.length === 0) {
      if(this.data.failedLines.length > 0 || !Object.is(this.data.parsedCode, this.tempParsedCode)){
        this.data.parsedCode = this.tempParsedCode;
        this.trigger(this.data);
      }

      return;
    }

    const nextKey = keys[0];
    const line = lines[nextKey];

    this.parse(line.code)
      .then(result => {
        if(line.current) {
          this.tempParsedCode = result;
        }

        delete lines[nextKey];
        this.parseMultiHandle(lines);
      })
      .catch(error => {
        this.data.failedLines.push(parseInt(nextKey));

        delete lines[nextKey];
        this.parseMultiHandle(lines);
      });

  },

  parse(text) {
    return new Promise((resolve, reject) => {
      this.parser.parse(text)
        .then(result => {
          if(!result) {
            return reject();
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
          if(checksPassed) {
            let ai = 0;
            assignmentsDone = checkedCode.assignments.reduce((x, y) => {
              const objectValue = this.setObjectValue(y.object, y.value);
              parsedCode.assignments[ai].valid = objectValue.status === true;
              parsedCode.assignments[ai].value = objectValue.value;
              ai++;
              return x || objectValue.status;
            }, false);
          }
          return resolve(parsedCode);
        })
        .catch(error => {
          return reject(error);
        });
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
