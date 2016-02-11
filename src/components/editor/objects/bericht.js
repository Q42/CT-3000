import React from 'react';
import { BaseObject } from './_baseObject';

class Bericht extends React.Component {
  render() {
    return <div className="icon">
      <div className="on"></div>
      <div className="off"></div>
    </div>;
  }
}

export default BaseObject(Bericht, 'bericht');