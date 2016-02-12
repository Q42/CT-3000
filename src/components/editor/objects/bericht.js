import React from 'react';
import { BaseObject } from './_baseObject';
import Rebase from 're-base';

import { Motion, spring, presets } from 'react-motion';

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

    this.o = state == undefined ||  state == '' && this.state.show ? 0 : 1;
    this.t = state == undefined ||  state == '' && this.state.show ? -100 : 40;
    this.s = state == undefined ||  state == '' && this.state.show ? 100 : -70;

    return <div className="icon">
      <div className="on"></div>
      <div className="off"></div>
      <Motion defaultStyle={{ x: 0, y: -100, z: 0, q:100 }} style={{ x: spring(this.o), y: spring(this.t,springSetting1), z: spring(this.o,springSetting1),q: spring(this.s,springSetting1)}}>
        {value => <div className="message" style={{opacity: value.x, transform: 'scale(' + value.z + ') translate(' + value.y + 'px,'+ value.q +'px)'}}>
          <p>{state}</p>
        </div>}
      </Motion>
    </div>;
  }
}

export default BaseObject(Bericht, 'bericht');
