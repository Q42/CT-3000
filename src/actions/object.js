import Reflux from 'reflux';

var ObjectActions = Reflux.createActions({
  initiate: {},
  create: {},
  parse: {},
  parseMulti: {},
  notifyUpdate: {}
});

ObjectActions.initiate = function(languageConfig){
  if(languageConfig && languageConfig.objects)
    this.create(languageConfig.objects);
};


export default ObjectActions;
