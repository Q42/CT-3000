import React from 'react';
import { BaseObject } from './_baseObject';

class Lamp extends React.Component {
  render() {
    let state;
    if(this.props.data.object)
      state = this.props.data.object.state;

    let classes = 'icon';
    if(this.props.data && this.props.data.digibord  && this.props.data.digibord.state !== '0' && this.props.data.digibord.state !== 0) {
      classes += ' on-digiboard';
    }

    return <div className={ classes }>
      <div className="off"></div>
      <div className="on"></div>
    </div>;
  }
}

export default BaseObject(Lamp, 'lamp');
