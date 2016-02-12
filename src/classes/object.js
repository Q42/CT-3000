import ObjectActions from '../actions/object';

export default class {

  constructor(data){
    if(Object.keys(data).length === 0)
      return;

    this.name = data.name;
    this.allowedOperators = ['='];

    this.equals = (value) => {
      return value === this.state;
    };

    switch(data.type){
      case 'string':
        this.type = 'string';
        this.state = '';

        if(data.values && data.values.constructor === Array){
          this.values = data.values;

          if(data.default && typeof data.default === 'string' && this.values.indexOf(data.default) > -1){
            this.state = data.default;
          }else if(this.values.length > 0){
            this.state = this.values[0];
          }
        }else{
          if(data.default && typeof data.default === 'string')
            this.state = data.default;
        }

        break;
      case 'int':
        this.type = 'int';
        this.state = 0;

        if(data.values && data.values.constructor === Array){
          this.values = data.values;

          if(data.default && typeof data.default === 'number' && data.default % 1  === 0 && this.values.indexOf(data.default) > -1){
            this.state = data.default;
          }else if(this.values.length > 0){
            this.state = this.values[0];
          }
        }else{
          if(data.default && typeof data.default === 'number' && data.default % 1  === 0)
            this.state = data.default;
        }

        break;
      case 'text':
        this.type = 'text';
        this.state = '';

        if(data.default && typeof data.default === 'string')
          this.state = data.default;

        break;
      case 'time':
        this.type = 'time';
        this.state = Date.now() || 0;
        this.allowedOperators = ['=','<','>'];

        this.equals = (value) => {
          if(!this.valueMatchesType(value))
            return false;

          let [h,m] = value.split(':');
          h = parseInt(h); m = parseInt(m);
          let d = new Date(this.state);

          return d.getHours() === h && d.getMinutes() === m;
        };

        this.greater = (value) => {
          if(!this.valueMatchesType(value))
            return false;

          let [h,m] = value.split(':');
          h = parseInt(h); m = parseInt(m);
          let d = new Date(this.state);

          return d.getHours() > h || (d.getHours() === h && d.getMinutes() > m);
        };

        this.smaller = (value) => {
          if(!this.valueMatchesType(value))
            return false;

          let [h,m] = value.split(':');
          h = parseInt(h); m = parseInt(m);
          let d = new Date(this.state);

          return d.getHours() < h || (d.getHours() === h && d.getMinutes() < m);
        };

        setInterval(() => {
          this.state += 1000;
          ObjectActions.notifyUpdate(this.name);
        }, 60000);
        break;
    }

  }

  getValue(){
    return this.state;
  }

  getPossibleValues(){
    return this.values ? this.values.sort() : [];
  }

  operatorIsAllowed(op){
    return this.allowedOperators.indexOf(op) > -1;
  }

  isTrueStatement(value, operator){
    if(!this.operatorIsAllowed(operator))
      return false;

    switch(operator){
      case '=':
        return this.equals && this.equals(value);
      case '>':
        return this.greater && this.greater(value);
      case '<':
        return this.smaller && this.smaller(value);
    }
  }

  setValue(value){
    if((value || this.type == 'string') && ((!this.values && this.valueMatchesType(value)) || (this.values && this.values.indexOf(value) > -1))){
      this.state = this.formatValue(value);
      return {
        status: true,
        value: this.state
      };
    }
    return {
      status: false,
      value: null
    };
  }

  valueMatchesType(value){
    switch(this.type){
      case 'string':
        return true;
      case 'int':
        return /^[0-9]+$/.test(value);
      case 'text':
        return /^\"[^\"]*\"$/i.test(value);
      case 'time':
        if(/^[0-9]{1,2}:[0-9]{2}$/.test(value)){
          let [h,m] = value.split(':');
          h = parseInt(h);
          m = parseInt(m);
          return  h >= 0 && h < 24 && m >= 0 && m < 60;
        }

        return false;
    }
  }

  formatValue(value){
    switch(this.type){
      case 'text':
        return value.replace(/\"/g,'');
      case 'time':
        let [h,m] = value.split(':');
        var d = new Date();
        d.setHours(h);
        d.setMinutes(m);
        return d.getTime();
      default:
        return value;
    }
  }

}
