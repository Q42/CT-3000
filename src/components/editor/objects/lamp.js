import React from 'react';
import { BaseObject } from './_baseObject';

class Lamp extends React.Component {
  render() {
    let state;
    if(this.props.data.object)
      state = this.props.data.object.state;

    return <div className="icon">Lamp ({ state })</div>;
  }
}

export default BaseObject(Lamp, 'lamp');
