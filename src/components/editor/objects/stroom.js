import React from 'react';
import { BaseObject } from './_baseObject';

class Stroom extends React.Component {
  render() {
    let state;
    if(this.props.data.object)
      state = this.props.data.object.state;

    return <div className="icon">Stroom ({ state })</div>;
  }
}

export default BaseObject(Stroom, 'stroom');