import TranslationStore from '../stores/translation';
import ObjectStore from '../stores/object';

export default class {
  constructor() {
    this.isConnected = false;
    this.ipaddress = '';
    this.username = '';
    this.lamp = 'uit';

    // listen to updated objects, activating hue when lamp is used
    ObjectStore.listen(this.onObjectUpdate.bind(this));
    window.addEventListener('unload', this.disconnect.bind(this));
  }

  disconnect() {
    this.isConnected = false;
    this.ipaddress = this.username = this.lamp = null;
  }

  onObjectUpdate(data) {
    if(!data || !data.objects) {
      return;
    }

    const ipaddress = '';
    const username = '';
    const lamp = data.objects[TranslationStore.mappingClassToUI['lamp']];

    this.updateConnection(ipaddress, username)
      .then((isConnected) => isConnected ? this.updateLamp(lamp) : null);
  }

  updateConnection(ipaddress, username) {
    return new Promise((resolve, reject) => {
      if (!ipaddress || !username) {
        resolve(this.isConnected = false);
        return;
      }

      if (this.ipaddress === ipaddress.state && this.username === username.state) {
        resolve(this.isConnected);
        return;
      }

      console.log('connecting to hue', ipaddress.state, username.state);
      this.ipaddress = ipaddress.state;
      this.username = username.state;

      // TODO get lights & check connection

      resolve(this.isConnected = true);
    });
  }

  updateLamp(lamp) {
    if(!lamp || this.lamp === lamp.state) {
      return;
    }

    this.lamp = lamp.state;
  }

}
