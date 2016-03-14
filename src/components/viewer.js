import React from 'react';
import Rebase from 're-base';
import { Motion, spring, presets } from 'react-motion';
import InlineSVG from 'svg-inline-react';

import svg from '!svg-inline!../assets/svg/radio-station.svg';

const springSetting1 = {stiffness: 164, damping: 10};

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: {},
      classId: this.generateId(),
      isPlaying: false,
      nowPlayingID: ''
    };
  }

  componentWillMount() {
    this.base = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + this.state.classId);

    this.ref = this.base.syncState('display', {
      context: this,
      state: 'display'
    });
  }

  componentDidMount(){
    this.streams =  {
      pop: 'http://icecast.omroep.nl/3fm-sb-mp3',
      easy: 'http://8573.live.streamtheworld.com:80/SKYRADIO_SC',
      classical: 'http://icecast.omroep.nl/radio4-bb-mp3',
      jazz: 'http://icecast.omroep.nl/radio6-bb-mp3'
    };

    this.audio = new Audio();
  }

  componentDidUpdate(){
    const stream = this.state.display.music ? this.state.display.music.stream : null;
    if(!stream || this.currentStream === stream) {
      return;
    }
    this.currentStream = stream;

    this.playStream(stream, this.state.display.music.id);
  }

  playStream (stream, id) {
    if(!stream && !this.audio.paused){
      this.audio.pause();
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
  }

  generateId() {
    const num = Math.floor(Math.random() * 1000000).toString();
    const pad = '000000';
    return pad.slice(num.length) + num;
  }

  render() {
    let o = this.state.display.message === undefined ||  this.state.display.message === '' ? 0 : 1;
    let t = this.state.display.message === undefined ||  this.state.display.message === '' ? -100 : 0;

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

          <div className="users-total">
            <h3>999 gebruikers</h3>
          </div>
          <div className={ 'station' + (this.state.isPlaying ? ' send' : '') }>
            <span className="icon-station" aria-hidden="true">
              <InlineSVG src={ svg } />
            </span>
            <h3><small>Je luister nu naar:</small> { this.state.nowPlayingID === 'uit' ? '' : this.state.nowPlayingID }</h3>
          </div>
        </div>

      </div>
    );
  }
}
