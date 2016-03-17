import React from 'react';
import Rebase from 're-base';

import InlineSVG from 'svg-inline-react';

import svg from '!svg-inline!../assets/svg/radio-station.svg';
import svgSpot from '!svg-inline!../assets/svg/spot.svg';

const springSetting1 = {stiffness: 164, damping: 10};

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: {},
      classId: this.generateId(),
      isPlaying: false,
      nowPlayingID: '',
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
  }

  componentDidMount(){
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;

    this.streams =  {
      pop: 'http://icecast.omroep.nl/3fm-sb-mp3',
      easy: 'http://8573.live.streamtheworld.com:80/SKYRADIO_SC',
      classical: 'http://icecast.omroep.nl/radio4-bb-mp3',
      jazz: 'http://icecast.omroep.nl/radio6-bb-mp3'
    };

    this.audio = new Audio();

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

    const stream = this.state.display.music ? this.state.display.music.stream : null;
    if(this.currentStream === stream) {
      return;
    }

    this.currentStream = stream;
    this.playStream(stream, this.state.display.music ? this.state.display.music.id : null);
  }

  playStream (stream, id) {
    if(!stream && !this.audio.paused){
      this.audio.pause();
      this.setState({
        isPlaying: false,
        nowPlayingID: null
      });
      return;
    }

    if(!stream){
      return;
    }

    this.audio.src = stream;
    this.audio.play();

    this.setState({
      isPlaying: true,
      nowPlayingID: id
    });
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
    const playing = this.state.isPlaying ?
                    <h3><small>Je luistert nu naar:</small> { this.state.nowPlayingID === 'uit' ? '' : this.state.nowPlayingID }</h3> :
                    <h3><small>Geen muziek geselecteerd</small></h3>;

    const nrLights = this.state.display.lights ? Object.keys(this.state.display.lights).length : 0;

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
            <h3>{ nrLights } gebruiker{ nrLights !== 1 ? 's' : '' }</h3>
          </div>

          <div ref="matrix" className="the-matrix"/>

          <div className={ 'station' + (this.state.isPlaying ? ' send' : '') }>
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
    const messageList = this.state.display.messages || {};
    return Object.entries(messageList).map(([key, message]) => {
      return (
        <div className="group-message" key={ key }>
          <div className="group-name">{ message.groupName ? message.groupName : 'Anoniempje' } zegt:</div>
          <div className="group-text">{ message.message }</div>
        </div>
      );
    });
  }

  renderLights() {
    const lights = this.state.display.lights || {};

    return Object.entries(lights).map(([key, light]) => {
      let style = {};
      let borderColor = {};
      let beamClass = 'beam';

      console.log(light.light);
      if(typeof light.light === 'object'){
        style = {
          backgroundColor: 'rgb(' + light.light.r + ',' + light.light.g + ',' + light.light.b + ')'
        };
        borderColor = {
          borderColor: 'rgba(' + light.light.r + ',' + light.light.g + ',' + light.light.b + ',0.8)'
        }
      }
      else if(light.light === 'uit') {
        beamClass += ' light-off';
        borderColor = {
          borderColor: 'rgba(180,180,180,0.5)'
        }
      }

      const matches = light.groupName.match(/\b(\w)/g);
      const acronym = matches.slice(0,2).join('');

      return (
        <div className="container" key={ key }>
          <div className="light"><span className="name" style={ borderColor }>{ acronym }</span></div>
          <div className={ beamClass } style={ style } />
        </div>
      );
    });
  }
}
