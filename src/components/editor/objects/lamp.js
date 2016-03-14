import React from 'react';
import { BaseObject } from './_baseObject';
import InlineSVG from 'svg-inline-react';

import svg from '!svg-inline!../../../assets/svg/sending.svg';

class Lamp extends React.Component {
  render() {
    const object = this.props.data.object.state;
    const digibord = this.props.data.digibord.state;

    let style = {};
    if(typeof object === 'object'){
      style = {
        backgroundColor: 'rgb(' + state.r + ',' + state.g + ',' + state.b + ')'
      };
    }

    let classes = 'icon';
    if(digibord && digibord.length === 6) {
      classes += ' on-digiboard';
    }

    return <div className={ classes } style={ style }>
      <div className="off"></div>
      <div className="on">
        <div className="connected"><InlineSVG src={ svg } /></div>
      </div>
    </div>;
  }
}

export default BaseObject(Lamp, 'lamp');
