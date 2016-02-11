import React from 'react';
import Rebase from 're-base';
import { Motion, spring, presets } from 'react-motion';

const base = Rebase.createClass('https://blink-ct.firebaseio.com/classes/1');

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
    let x = this.state.display.message == undefined ||  this.state.display.message == '' ? 100 : 0;

    return(
      <div className="viewer">
        <div className="content">

        <Motion defaultStyle={{opacity: 0 }} style={{opacity: spring(o)}}>
            {interpolatingStyle => <div className="message" style={interpolatingStyle}>
              {this.state.display.message}
            </div>}
          </Motion>

        </div>
      </div>
    );
  }
};
