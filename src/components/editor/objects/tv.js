import React from 'react';
import { BaseObject } from './_baseObject';

class Tv extends React.Component {
  render() {
    return <div className="icon">Tv</div>;
  }
}

export default BaseObject(Tv, 'tv');
