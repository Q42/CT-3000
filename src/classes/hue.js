import TranslationStore from '../stores/translation';
import ObjectStore from '../stores/object';
import request from 'superagent';
import sleep from './sleep';

export default class {
  constructor() {
    this.status = 'offline';
    this.ipaddress = null;
    this.username = 'p5G0zZYB8Xxry1HJkVXfbKSqDCok3VS2oIJLu2Ar';
    this.lamp = 'uit';

    // listen to updated objects, activating hue when lamp is used
    ObjectStore.listen(this.onObjectUpdate.bind(this));
    window.addEventListener('unload', this.disconnect.bind(this));
  }

  disconnect() {
    this.status = 'offline';
    this.ipaddress = this.username = this.lamp = null;
  }

  onObjectUpdate(data) {
    if(!data || !data.objects) {
      return;
    }

    const ipaddress = {state: '192.168.4.21'};
    const lamp = data.objects[TranslationStore.mappingClassToUI['lamp']];

    Promise.resolve(this.updateConnection(ipaddress));
    this.updateLamp(lamp);
  }

  updateConnection(ipaddress) {
    return new Promise((resolve, reject) => {
      if (!ipaddress || !ipaddress.state || !ipaddress.state.match(/\d+\.\d+\.\d+\.\d+/gi)) {
        return resolve(this.status = 'offline');
      }

      // ip address changed, reauthenticate
      if (this.ipaddress === ipaddress.state) {
        return resolve(this.status);
      }

      console.log('ipaddress changed, reauthenticating...');
      this.ipaddress = ipaddress.state;
      this.state = 'pending';

      return this.authenticate()
        .then((lights) => {
          if (lights) {
            this.state = 'online';
            console.log('hue is online!');
          }
        })
        .catch((err) => {
          console.error('error authenticating', err);
          this.state = 'offline';
        });
    });
  }

  updateLamp(lamp) {
    if(!lamp || this.lamp === lamp.state) {
      return;
    }

    // aan, uit or { r: 255, g: 255, b: 255 }
    this.lamp = lamp.state;

    const query = {
      on: this.lamp !== 'uit',
      bri: 254,
      // alert: 'select'
    }
    if (typeof this.lamp === 'object') {
      query.xy = toXY(this.lamp);
    } else {
      query.ct = 400;
    }

    request
      .put(`http://${this.ipaddress}/api/${this.username}/groups/0/action`)
      .send(query)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  authenticate() {
    console.log('connecting to hue at', this.ipaddress);

    return this.getUsername()
      .then((username) => username ? this.getLights() : null);
  }

  getUsername() {
    if (this.username) {
      return Promise.resolve(this.username);
    }

    return request
      .post(`http://${this.ipaddress}/api`)
      .send({ devicetype: 'CT-3000' })
      .then((resp) => {
        if (resp.body[0] && resp.body[0].error &&
          resp.body[0].error.description === 'link button not pressed') {
            return sleep(1000)().then(this.getUsername.bind(this))
        } else if (resp.body[0] && resp.body[0].success) {
          return this.username = resp.body[0].success.username;
        } else {
          console.error('Error getting username', resp);
        }
      })
      .catch((err) => console.error('Error getting username', err));
  }

  getLights() {
    return request
      .get(`http://${this.ipaddress}/api/${this.username}/lights`)
      .then((lights) => lights.body)
      .catch((err) => console.error('Error getting lights', err));
  }

  toXY({ r, g, b }) {
    // Gamma correctie
    r = (r > 0.04045) ? Math.pow((r + 0.055) / (1.0 + 0.055), 2.4) : (r / 12.92);
    g = (g > 0.04045) ? Math.pow((g + 0.055) / (1.0 + 0.055), 2.4) : (g / 12.92);
    b = (b > 0.04045) ? Math.pow((b + 0.055) / (1.0 + 0.055), 2.4) : (b / 12.92);

    // Apply wide gamut conversion D65
    var X = r * 0.664511 + g * 0.154324 + b * 0.162028;
    var Y = r * 0.283881 + g * 0.668433 + b * 0.047685;
    var Z = r * 0.000088 + g * 0.072310 + b * 0.986039;

    var fx = X / (X + Y + Z);
    var fy = Y / (X + Y + Z);
    if (isnan(fx)) {
      fx = 0.0;
    }
    if (isnan(fy)) {
      fy = 0.0;
    }

    return [fx.toPrecision(4),fy.toPrecision(4)];
  }

}
