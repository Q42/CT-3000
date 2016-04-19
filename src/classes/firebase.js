import Firebase from 'firebase';

import ObjectStore from '../stores/object';
import SessionStore from '../stores/session';

export default class {
  constructor() {
    this.sessionKey = SessionStore.sessionKey || '';
    this.firebase = new Firebase('https://blink-ct.firebaseio.com/classes/');
    this.displayRef = null;
    this.sessionRef = null;
    this.messagesRef = null;

    this.classId = null;
    this.name = null;
    this.message = null;
    this.light = null;
    this.music = null;

    this.messageTimeout = null;
    this.messageRef = null;

    this.unsubscribeObjectStore = ObjectStore.listen(this.onObjectUpdate.bind(this));
    window.addEventListener('unload', this.disconnect.bind(this));
  }

  connect() {
    // Initialise all firebase references
    this.displayRef = this.firebase.child(this.classId + '/display');
    this.sessionRef = this.displayRef.child('sessions/' + this.sessionKey);
    this.messagesRef = this.displayRef.child('messages');

    // Whipe local cache so we recreate all state on a new display
    this.name = this.light = null;
  }

  disconnect() {
    if(!this.displayRef) {
      return;
    }

    // Destroy active session
    this.sessionRef.remove();

    // Remove message we were typing
    if(this.messageRef) {
      this.messageRef.remove();
      clearTimeout(this.messageTimeout);
    }

    // Unset old references
    this.displayRef = this.sessionRef = this.messagesRef = this.messageRef = null;
  }

  onObjectUpdate(data) {
    if(!data || !data.objects) {
      return;
    }

    const { bericht, digibord, lamp, muziek, naam } = data.objects;

    this.updateConnection(digibord);

    if(!this.displayRef) {
      // No class connection, no use continuing
      return;
    }

    this.updateName(naam);
    this.postMessage(bericht);
    this.updateMusic(muziek);
    this.updateLight(lamp);
  }

  updateConnection(classId) {
    if(!classId || this.classId === classId.state) {
      return;
    }

    this.classId = classId.state;

    this.disconnect();

    if(!this.classId || this.classId.length !== 6) {
      return;
    }

    this.connect();
  }

  updateName(name) {
    if(!name || this.name === name.state) {
      return;
    }

    this.name = name.state;

    this.sessionRef.update({ name: this.name });
  }

  postMessage(message) {
    if(!message || this.message === message.state) {
      return;
    }

    this.message = message.state;

    // Empty message, remove when having a reference
    if(!this.message) {
      if(this.messageRef) {
        this.messageRef.remove();
        this.messageRef = null;
        clearTimeout(this.messageTimeout);
      }

      return;
    }

    clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => this.messageRef = null, 4242);

    if(this.messageRef) {
      this.messageRef.update({ message: this.message });
    } else {
      this.messageRef = this.messagesRef.push({
        message: message.state,
        sessionKey: this.sessionKey
      });
    }
  }

  updateMusic(music) {
    if(!music || this.music === music.state) {
      return;
    }

    this.music = music.state;

    this.displayRef.update({
      music: {
        value: this.music,
        sessionKey: this.sessionKey
      }
    });
  }

  updateLight(light) {
    if(!light || this.light === light.state) {
      return;
    }

    this.light = light.state;

    this.sessionRef.update({ light: this.light });
  }
}
