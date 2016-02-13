import React from 'react';
import { BaseObject } from './_baseObject';
import Rebase from 're-base';

const springSetting1 = {stiffness: 164, damping: 10};

class Bericht extends React.Component {
  constructor(props) {
    super(props);

    this.o = 0;
    this.t = -100;
    this.s = 100;

    this.state = {
      display: {},
    };
  }

  componentDidMount() {
    if(!this.props.main) {
      return;
    }
  }

  componentDidUpdate() {
    if(!this.props.main) {
      return;
    }

    if(this.props.data.object.state === this.prevState) {
      return;
    }
    this.prevState = this.props.data.object.state;

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

    if(!object || !this.base) {
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
      <div className={"message" + (state == undefined || state == '' ? ' empty' : ' set') }>
        <p>{state}</p>
      </div>
    </div>;
  }
}

export default BaseObject(Bericht, 'bericht');
