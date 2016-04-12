import Rebase from 're-base';

import ObjectStore from '../stores/object';
import SessionStore from '../stores/session';

export default class {
  constructor() {
    this.firebase = null;
    this.sessionKey = SessionStore.sessionKey || '';

    this.classId = null;
    this.name = null;
    this.message = null;
    this.light = null;
    this.music = null;

    this.nameRef = null;
    this.messageTimeout = null;
    this.messageRef = null;
    this.lightRef = null;

    this.unsubscribeObjectStore = ObjectStore.listen(this.onObjectUpdate.bind(this));
  }

  disconnectFirebase() {
    if(!this.fireBase) {
      return;
    }

    // TODO: check if we should cleanup old session in Firebase.

    this.fireBase.reset();
    delete this.fireBase;
  }

  onObjectUpdate(data) {
    if(!data || !data.objects) {
      return;
    }

    const { bericht, digibord, lamp, muziek, naam } = data.objects;

    this.tryUpdateFirebaseConnection(digibord);

    if(!this.fireBase) {
      // No firebase connection, no use continuing
      return;
    }

    this.tryUpdateName(naam);
    this.tryPostMessage(bericht);
    this.tryUpdateMusic(muziek);
    this.tryUpdateLight(lamp);
  }

  tryUpdateFirebaseConnection(classId) {
    if(!classId || this.classId === classId.state) {
      return;
    }

    this.classId = classId.state;

    this.disconnectFirebase();

    if(!this.classId || this.classId.length !== 6) {
      return;
    }

    this.fireBase = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + this.classId);

    // Whipe local cache so we recreate all state on a new classroom
    this.name = this.message = this.light = this.music = null;
  }

  tryUpdateName(name) {
    if(!name || this.name === name.state) {
      return;
    }

    this.name = name.state;

    console.log(this.name);

    const data = {
      name: this.name
    };

    if(this.nameRef) {
      this.nameRef.set(data);
    } else {
      this.nameRef = this.fireBase.post('display/sessions/' + this.sessionKey, { data });
    }
  }

  tryPostMessage(message) {
    if(!message || this.message === message.state) {
      return;
    }

    this.message = message.state;

    if(!this.message && !this.messageRef) {
      // Empty message, and nothing to update, get out.
      return;
    }

    clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => this.messageRef = null, 4242);

    const data = {
      message: message.state,
      sessionKey: this.sessionKey
    };

    if(this.messageRef) {
      this.messageRef.set(data);
    } else {
      this.messageRef = this.fireBase.push('display/messages', { data });
    }
  }

  tryUpdateMusic() {
  }

  tryUpdateLight(light) {
    if(!light || this.light === light.state) {
      return;
    }

    this.light = light.state;

    if(!this.light && !this.lightRef) {
      // Empty light, and nothing to update, get out.
      return;
    }

    const data = {
      light: this.light,
      sessionKey: this.sessionKey
    };

    if(this.lightRef) {
      this.lightRef.set(data);
    } else {
      this.lightRef = this.fireBase.push('display/lights', { data });
    }
  }

}
