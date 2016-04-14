import React from 'react';
import Rebase from 're-base';

import InlineSVG from 'svg-inline-react';
import svg from '!svg-inline!../assets/svg/radio-station.svg';
import svgSpot from '!svg-inline!../assets/svg/spot.svg';

import MusicStream from '../classes/musicStream';

const springSetting1 = {stiffness: 164, damping: 10};

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: {},
      classId: this.generateId(),
      matrix: ''
    };

    this.matrixText = '';
  }

  componentWillMount() {
    this.base = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + this.state.classId);

    this.ref = this.base.syncState('display', {
      context: this,
      state: 'display'
    });

    this.musicStream = new MusicStream();
  }

  componentDidMount(){
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;

    this.matrixInterval = setInterval(() => {
      this.theMatrix();
    }, 100);
  }

  theMatrix(){
    const matrixLength = 225;

    let matrix = this.matrixText + '' + Math.round(Math.random());
    if(matrix.length > matrixLength){
      matrix = matrix.substring(matrix.length - matrixLength)
    }

    this.matrixText = matrix;
    this.refs.matrix.innerHTML = matrix;
  }

  componentDidUpdate(){
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;

    // TODO: Check if music playing user diconnected.

    const stream = this.getStream();
    if(this.currentStream === stream) {
      return;
    }

    this.currentStream = stream;
    this.musicStream.play(stream);
  }

  getStream() {
    return (this.state.display.music || {}).value || 'uit';
  }

  componentWillUnmount(){
    this.base.removeBinding(this.ref);
    clearInterval(this.matrixInterval);
  }

  generateId() {
    const num = Math.floor(Math.random() * 1000000).toString();
    const pad = '000000';
    return pad.slice(num.length) + num;
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

          <div ref="matrix" className="the-matrix"/>

          <div className={ 'station' + ( stream !== 'uit' ? ' send' : '' ) }>
            <span className="icon-station" aria-hidden="true">
              <InlineSVG src={ svg } />
            </span>
            { playing }
          </div>
        </div>

        <div className="lights">
          { this.renderLights() }
        </div>

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

  renderLights() {
    const sessions = this.state.display.sessions || {};

    return Object.entries(sessions).map(([key, session]) => {
      let style = {};
      let borderColor = {};
      let beamClass = 'beam';

      if(typeof session.light === 'object'){
        style = {
          backgroundColor: 'rgb(' + session.light.r + ',' + session.light.g + ',' + session.light.b + ')'
        };
        borderColor = {
          borderColor: 'rgba(' + session.light.r + ',' + session.light.g + ',' + session.light.b + ',0.8)'
        }
      }
      else if(session.light === 'uit') {
        beamClass += ' light-off';
        borderColor = {
          borderColor: 'rgba(180,180,180,0.5)'
        }
      }

      const userName = session.name || '';
      const matches = userName.match(/\b(\w)/g);
      const acronym = (matches || []).slice(0,2).join('');

      return (
        <div className="container" key={ key }>
          <div className="light"><span className="name" style={ borderColor }>{ acronym }</span></div>
          <div className={ beamClass } style={ style } />
        </div>
      );
    });
  }
}
