import React from 'react';
import { BaseObject } from './_baseObject';

class Weer extends React.Component {
  render() {
    return <div className="icon">Weer</div>;
  }
}

export default BaseObject(Weer, 'weer');
