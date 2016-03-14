import React from 'react';
import Rebase from 're-base';
import { Motion, spring, presets } from 'react-motion';

const springSetting1 = {stiffness: 164, damping: 10};

export default class Viewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      display: {},
      classId: this.generateId(),
    };
  }

  componentWillMount() {
    this.base = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + this.state.classId);

    this.ref = this.base.syncState('display', {
      context: this,
      state: 'display'
    });
  }

  componentWillUnmount(){
    this.base.removeBinding(this.ref);
  }

  generateId() {
    const num = Math.floor(Math.random() * 1000000).toString();
    const pad = '000000'
    return pad.slice(num.length) + num;
  }

  render() {
    let o = this.state.display.message == undefined ||  this.state.display.message == '' ? 0 : 1;
    let t = this.state.display.message == undefined ||  this.state.display.message == '' ? -100 : 0;

    return(
      <div className="viewer">
        <div className="content">
          <div className="diagonal-thingy" aria-hidden="true"></div>

          <h2 className="header-init">
            <span className="class-id">Mainframe ID: { this.state.classId }</span>
          </h2>

          <div className="chat">
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
            bla...<br />
          </div>

          <Motion defaultStyle={{ x: 0, y: -100, z: 0 }} style={{ x: spring(o), y: spring(t,springSetting1), z: spring(o,springSetting1)}}>
              {value => <div className="message" style={{opacity: value.x, transform: 'scale(' + value.z + ') translateX(' + value.y + 'px)'}}>
                {this.state.display.message}
              </div>}
            </Motion>
          <div className="station">
            <h3><small>Je luister nu naar:</small> klassiek</h3>
          </div>
        </div>

      </div>
    );
  }
};
