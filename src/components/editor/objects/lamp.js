import React from 'react';
import { BaseObject } from './_baseObject';

class Lamp extends React.Component {
  render() {
    return <div className="icon">Lamp ({ this.props.data.value })</div>;
  }
}

export default BaseObject(Lamp, 'lamp');
