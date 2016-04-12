import Reflux from 'reflux';

var ObjectActions = Reflux.createActions({
  initiate: {},
  create: {},
  parse: {},
  notifyUpdate: {}
});

ObjectActions.initiate = function(languageConfig){
  if(languageConfig && languageConfig.objects)
    this.create(languageConfig.objects);
};


export default ObjectActions;
