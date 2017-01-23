import TranslationStore from '../stores/translation';
import ObjectStore from '../stores/object';
import request from 'superagent';
import sleep from './sleep';
import equal from 'deep-equal';

export default class {
  constructor() {
    this.status = 'offline';
    // TODO get from code
    this.ipaddress = null;
    // TODO get from cookie
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

    const ipaddress = data.objects[TranslationStore.mappingClassToUI['hue']];
    const lamp = data.objects[TranslationStore.mappingClassToUI['lamp']];

    Promise.resolve(this.updateConnection(ipaddress));
    this.updateLamp(lamp);
  }

  updateConnection(ipaddress) {
    return new Promise((resolve, reject) => {
      if (!ipaddress || !ipaddress.state || !ipaddress.state.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        return resolve(this.status = 'offline');
      }

      // only if ip address changed
      if (this.ipaddress === ipaddress.state) {
        return resolve(this.status);
      }

      this.ipaddress = ipaddress.state;

      return this.authenticate()
        .then(this.syncHueBulb.bind(this))
        .catch((err) => {
          console.error('error authenticating', err);
          this.state = 'offline';
        });
    });
  }

  updateLamp(lamp) {
    if(!lamp || equal(this.lamp, lamp.state)){
      return;
    }

    // aan, uit or { r: 255, g: 255, b: 255 }
    this.lamp = lamp.state;

    this.syncHueBulb();
  }

  syncHueBulb() {
    if (this.state !== 'online') {
      return;
    }

    const query = {
      on: this.lamp !== 'uit',
      bri: 254,
      // alert: 'select'
    }

    if (typeof this.lamp === 'object') {
      query.xy = this.toXY(this.lamp);
    } else {
      query.ct = 400;
    }

    request
      .put(`http://${this.ipaddress}/api/${this.username}/groups/0/action`)
      .send(query)
      .then((res) => {
        res.body.forEach((cmd) => {
          if (cmd.success) {
            console.log('success', cmd.success)
          }
          if (cmd.error) {
            console.error('error', cmd.error);
          }
        })
      })
      .catch((err) => console.error(err));
  }

  authenticate() {
    console.log('authenticating', this.ipaddress, this.username);
    this.state = 'pending';

    return this.getUsername()
      .then(() => this.username ? this.getLights() : null)
      .then((lights) => {
        if (!lights)
          return this.state = 'offline';
        if (lights[0] && lights[0].error && lights[0].error.description === 'unauthorized user') {
          console.log('unauthorized user, getting new one');
          this.username = null;
          return this.authenticate();
        }
        console.log('hue is online!', lights);
        return this.state = 'online';
      })
  }

  getUsername() {
    if (this.username) {
      return Promise.resolve(this.username);
    }

    // first request, set timeout!
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

  // TODO this is crappy!
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
    if (isNaN(fx)) {
      fx = 0.0;
    }
    if (isNaN(fy)) {
      fy = 0.0;
    }

    return [parseFloat(fx.toPrecision(4)),parseFloat(fy.toPrecision(4))];
  }

}
