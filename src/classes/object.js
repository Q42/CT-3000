import ObjectActions from '../actions/object';

export default class {

  constructor(data){
    if(Object.keys(data).length === 0)
      return;

    this.name = data.name;

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
