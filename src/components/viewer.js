import React from 'react';
import Rebase from 're-base';

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
    return(
      <div className="viewer">
        <div className="text">
          {this.state.display.message}
        </div>
      </div>
    );
  }
};
