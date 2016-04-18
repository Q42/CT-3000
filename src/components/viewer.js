import React from 'react';
import Rebase from 're-base';

import LightsComponent from './viewer/lights';
import TheMatrixComponent from './viewer/theMatrix';

import InlineSVG from 'svg-inline-react';
import svg from '!svg-inline!../assets/svg/radio-station.svg';

import MusicStream from '../classes/musicStream';

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);

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

    this.musicStream = new MusicStream();
  }

  componentDidMount() {
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;
  }

  componentDidUpdate() {
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;

    // TODO: Check if music playing user diconnected.

    const stream = this.getStream();
    if(this.currentStream === stream) {
      return;
    }

    this.currentStream = stream;
    this.musicStream.play(stream);
  }

  componentWillUnmount() {
    this.base.removeBinding(this.ref);
    clearInterval(this.matrixInterval);
  }

  generateId() {
    const num = Math.floor(Math.random() * 1000000).toString();
    const pad = '000000';
    return pad.slice(num.length) + num;
  }

  getStream() {
    return (this.state.display.music || {}).value || 'uit';
  }

  render() {
    const sessions = this.state.display.sessions || {};
    const stream = this.getStream();
    const streamSessionKey = (this.state.display.music || {}).sessionKey;
    const session = sessions[streamSessionKey] || {};
    const userName = session.name || 'Anoniempje';
    const playing = stream !== 'uit' ?
                    <div><h3><small>Je luistert nu naar:</small> { stream }</h3><p className="choice-of">de keuze van <strong>{ userName }</strong></p></div> :
                    <div><h3><small>Geen muziek geselecteerd</small></h3></div>;

    const nrSessions = this.state.display.sessions ? Object.keys(sessions).length : 0;

    return(
      <div className="viewer">
        <div className="content">
          <div className="diagonal-thingy" aria-hidden="true"></div>

          <h2 className="header-init">
            <span className="class-id">Digibord ID: { this.state.classId }</span>
          </h2>

          <div ref="chat" className="chat">
            { this.renderMessages() }
          </div>

          <div className="users-total">
            <h3>{ nrSessions } gebruiker{ nrSessions !== 1 ? 's' : '' }</h3>
          </div>

          <TheMatrixComponent />

          <div className={ 'station' + ( stream !== 'uit' ? ' send' : '' ) }>
            <span className="icon-station" aria-hidden="true">
              <InlineSVG src={ svg } />
            </span>
            { playing }
          </div>
        </div>

        <LightsComponent sessions={ this.state.display.sessions || {} } />
      </div>
    );
  }

  renderMessages() {
    const messages = this.state.display.messages || {};
    const sessions = this.state.display.sessions || {};

    return Object.entries(messages).map(([key, message]) => {
      const session = sessions[message.sessionKey] || {};
      const userName = session.name || 'Anoniempje';

      return (
        <div className="user-message" key={ key }>
          <div className="user-name">{ userName } zegt:</div>
          <div className="user-text">{ message.message }</div>
        </div>
      );
    });
  }
}
