import React from 'react';
import { BaseObject } from './_baseObject';

class Weer extends React.Component {
  render() {
    return <div className="icon">
      <div className="off"></div>
      <div className="on"></div>
    </div>;
  }
}

export default BaseObject(Weer, 'weer');
