import React from 'react';
import { BaseObject } from './_baseObject';
import Rebase from 're-base';
import InlineSVG from 'svg-inline-react';
import slugify from 'slugify';

import svgConnected from '!svg-inline!../../../assets/svg/sending.svg';
import svgLamp from '!svg-inline!../../../assets/svg/lamp-aan.svg';

class Lamp extends React.Component {
  componentDidUpdate() {
    if(!this.props.main) {
      return;
    }

    const light = this.props.data.object.state;
    if(light === this.prevState) {
      return;
    }
    this.prevState = light;

    if(!light) {
      return;
    }

    const digibord = this.props.data.digibord.state;
    if(!digibord || digibord.length !== 6) {
      return;
    }

    this.connectFirebase(digibord);

    const groupName = this.props.data.naam.state;
    this.postLightState(light, groupName);
  }

  postLightState(light, groupName) {
    if(!light || !groupName || !this.fireBase) {
      return;
    }

    const data = { light, groupName };
    if(this.lightRef) {
      this.lightRef.set(data);
    } else {
      this.lightRef = this.fireBase.post('display/lights/' + slugify(groupName).toLowerCase(), { data });
    }
  }

  connectFirebase(classId) {
    if(this.fireBase) {
      this.fireBase.reset();
      delete this.fireBase;
    }

    this.fireBase = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + classId);
  }

  render() {
    const object = this.props.data.object.state;
    const digibord = this.props.data.digibord.state;

    let style = {};
    if(typeof object === 'object'){
      style = {
        backgroundColor: 'rgb(' + object.r + ',' + object.g + ',' + object.b + ')'
      };
    }

    let classes = 'icon';
    if(digibord && digibord.length === 6) {
      classes += ' on-digiboard';
    }

    return <div className={ classes } style={ style }>
      <div className="off"></div>
      <div className="on">
        <InlineSVG src={ svgLamp } />
        <div className="connected"><InlineSVG src={ svgConnected } /></div>
      </div>
    </div>;
  }
}

export default BaseObject(Lamp, 'lamp');
