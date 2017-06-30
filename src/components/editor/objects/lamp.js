import React from 'react';
import BaseObject from './_baseObject';
import Rebase from 're-base';
import InlineSVG from 'svg-inline-react';
import slugify from 'slugify';

import svgConnected from '!svg-inline-loader!../../../assets/svg/sending.svg';
import svgLamp from '!svg-inline-loader!../../../assets/svg/lamp-aan.svg';

class Lamp extends React.Component {
  render() {
    const object = this.props.object.state;

    let style = {};
    if(typeof object === 'object'){
      style = {
        backgroundColor: 'rgb(' + object.r + ',' + object.g + ',' + object.b + ')'
      };
    }

    let classes = 'icon';
    if(this.props.digibordConnected) {
      classes += ' on-digiboard';
    }
    if(this.props.hueConnected) {
      // TODO do something with this thing
      classes += ' on-hue';
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
