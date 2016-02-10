import canto34 from 'canto34/src/canto34';
import Promise from 'promise';

export default class {

  constructor(objects){
    this.lexer = new canto34.Lexer();
    this.parser = new canto34.Parser();

    this.setupTokens();
  }

  parse(text){
    let tokens;
    try{
      tokens = this.lexer.tokenize(text);
    }catch(e){
      return new Promise.reject();
    }
    if(tokens){
      this.parser.initialize(tokens);
      return this.runParser();
    }
  }

  setupTokens(){
    let types = canto34.StandardTokenTypes;

    this.lexer.addTokenType(types.whitespace('ws'));
    this.lexer.addTokenType(types.constant('als','if'));
    this.lexer.addTokenType(types.constant('dan','then'));
    this.lexer.addTokenType(types.constant('=','equals'));
    this.lexer.addTokenType(types.constant('en','and'));
    this.lexer.addTokenType({ name: 'item', regexp: /^[a-z0-9]+/i });
    this.lexer.addTokenType({ name: 'string', regexp: /^\".*\"+/ });
  }

  runParser(){
    let type;
    try{
      this.parser.match('if');
      type = 'if';
    }catch(e){
      type = 'statement';
    }

    return new Promise((resolve, reject) => {
      switch(type){
        case 'if':
          this.readIfThen().then(result => {
            this.readEOF().then(() => {
              resolve(result);
            }, err => reject());
          }, err => reject());
          break;

        case 'statement':
            this.readAssignments().then(result => {
              this.readEOF().then(() => {
                resolve({
                  checks: [],
                  assignments: result
                });
              }, err => reject());
            }, err => reject());
          break;
        }
    });
  }

  readEOF(){
    return new Promise((resolve, reject) => {
      if(this.parser.eof())
        resolve();

      reject();
    });
  }

  readIfThen(){
    let checks = [];

    return new Promise((resolve, reject) => {
      try{
        this.readAssignments().then(result => {
          checks = result;
        }, err => reject());
        this.parser.match('then');
        this.readAssignments().then(result => {
          resolve({
            checks: checks,
            assignments: result
          });
        }, err => reject());
      }catch(e){
        reject();
      }
    });
  }

  readAssignments(){
    let assignments = [];

    return new Promise((resolve, reject) => {
      try{
        assignments.push(this.readAssignment());
        while (!this.parser.eof() && this.parser.la1('and')) {
          this.parser.match('and');
          assignments.push(this.readAssignment());
        }
        resolve(assignments);
      }catch(e){
        reject();
      }
    });
  }

  readAssignment(){
    let object = this.parser.match('item').content;
    this.parser.match('equals');
    let value;
    try{
      value = this.parser.match('item').content;
    }catch(e){
      value = this.parser.match('string').content;
    }

    return {
      object: object,
      value: value
    };
  }

}
