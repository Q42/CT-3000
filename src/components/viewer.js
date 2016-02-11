import React from 'react';
import Rebase from 're-base';
import { Motion, spring, presets } from 'react-motion';

const base = Rebase.createClass('https://blink-ct.firebaseio.com/classes/1');
const springSetting1 = {stiffness: 164, damping: 10};

export default class Viewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      display: {}
    };
  }

  componentWillMount() {
    this.ref = base.syncState('display', {
      context: this,
      state: 'display'
    });
  }

  componentWillUnmount(){
    base.removeBinding(this.ref);
  }

  render() {
    let o = this.state.display.message == undefined ||  this.state.display.message == '' ? 0 : 1;
    let t = this.state.display.message == undefined ||  this.state.display.message == '' ? -100 : 0;

    return(
      <div className="viewer">
        <div className="content">

        <Motion defaultStyle={{ x: 0, y: -100, z: 0 }} style={{ x: spring(o), y: spring(t,springSetting1), z: spring(o,springSetting1)}}>
            {value => <div className="message" style={{opacity: value.x, transform: 'scale(' + value.z + ') translateX(' + value.y + 'px)'}}>
              {this.state.display.message}
            </div>}
          </Motion>

        </div>
      </div>
    );
  }
};
