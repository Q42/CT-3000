import firebase from 'firebase/app';
import firebasedb from 'firebase/database';

import ObjectStore from '../stores/object';
import SessionStore from '../stores/session';
import TranslationStore from '../stores/translation';

export default class {
  constructor() {
    this.sessionKey = SessionStore.sessionKey || '';
    this.db = null;
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

    // listen to updated objects, activating firebase when digibord is used
    ObjectStore.listen(this.onObjectUpdate.bind(this));
    window.addEventListener('unload', this.disconnect.bind(this));
  }

  connect() {
    if (!this.db) {
      const app = firebase.initializeApp({ databaseURL: 'https://ct-3000.firebaseio.com/' });
      this.db = firebasedb(app);
      console.log('connected to firebase');
    }

    // Initialise all firebase references
    this.displayRef = this.db.ref(`/classes/${this.classId}`);
    this.sessionRef = this.displayRef.child(`sessions/${this.sessionKey}`);
    this.messagesRef = this.displayRef.child('messages');

    this.sessionRef.update({ 
      name: this.name, 
      light: this.light 
    });
    this.displayRef.update({
      music: {
        value: this.music,
        sessionKey: this.sessionKey
      }
    });
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
    }
    if(this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }

    // Unset old references
    this.displayRef = this.sessionRef = this.messagesRef = this.messageRef = null;
  }

  onObjectUpdate(data) {
    if(!data || !data.objects) {
      return;
    }

    const digibord = data.objects[TranslationStore.mappingClassToUI['digibord']];
    const naam = data.objects[TranslationStore.mappingClassToUI['naam']];
    const bericht = data.objects[TranslationStore.mappingClassToUI['bericht']];
    const muziek = data.objects[TranslationStore.mappingClassToUI['muziek']];
    const lamp = data.objects[TranslationStore.mappingClassToUI['lamp']];

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
