import Reflux from 'reflux';
import uuid from 'node-uuid';

export default Reflux.createStore({
  sessionKey: null,

  init: function() {
    this.sessionKey = window.localStorage.getItem('sessionKey');

    if(!this.sessionKey) {
      this.sessionKey = uuid.v4();
      window.localStorage.setItem('sessionKey', this.sessionKey);
    }
  }
});
