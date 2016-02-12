import React from 'react';
import { BaseObject } from './_baseObject';
import Rebase from 're-base';

class Bericht extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: {},
    };
  }

  componentDidUpdate() {
    const digibord = (this.props.data.digibord || {}).state || null;
    if(digibord && digibord.length == 6) {
      if(this.base) {
        this.base.reset();
        delete this.base;
      }

      this.base = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + digibord);
      this.postMessage();
    }

  }

  postMessage() {
    const object = this.props.data.object;

    if(!object || !object.state || !this.base) {
      return;
    }

    this.ref = this.base.post('display/message', {
      data: object.state
    });
  }

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
