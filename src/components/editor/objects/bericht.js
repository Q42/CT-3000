import React from 'react';
import { BaseObject } from './_baseObject';

class Bericht extends React.Component {
  render() {
    let state;
    if(this.props.data.object)
      state = this.props.data.object.state;

    return <div className="icon">
      <div className="on"></div>
      <div className="off"></div>
      <div className="message"><p>{state}</p></div>
    </div>;
  }
}

export default BaseObject(Bericht, 'bericht');
