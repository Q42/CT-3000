import React from 'react';
import Rebase from 're-base';

import InlineSVG from 'svg-inline-react';

import svg from '!svg-inline!../assets/svg/radio-station.svg';

const springSetting1 = {stiffness: 164, damping: 10};

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: {},
      classId: 123456, //this.generateId(),
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

  componentDidUpdate() {
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;
  }

  generateId() {
    const num = Math.floor(Math.random() * 1000000).toString();
    const pad = '000000';
    return pad.slice(num.length) + num;
  }

  render() {
    const messageList = this.state.display.messages || {};

    return(
      <div className="viewer">
        <div className="content">
          <div className="diagonal-thingy" aria-hidden="true"></div>

          <h2 className="header-init">
            <span className="class-id">Mainframe ID: { this.state.classId }</span>
          </h2>

          <div ref="chat" className="chat">
            { Object.entries(messageList).map(([key, message]) => {
              return (
                <div className="group-message" key={ key }>
                  <div className="group-name">{ message.groupName } zegt:</div>
                  <div className="group-text">{ message.message }</div>
                </div>
                )
            }) }
          </div>

          <div className="users-total">
            <h3>999 gebruikers</h3>
          </div>
          <div className="station">
            <span className="icon-station" aria-hidden="true">
              <InlineSVG src={ svg } />
            </span>
            <h3><small>Je luistert nu naar:</small> klassiek</h3>
          </div>
        </div>

      </div>
    );
  }
}
