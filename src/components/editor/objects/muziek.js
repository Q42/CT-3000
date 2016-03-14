import React from 'react';
import { BaseObject } from './_baseObject';
import InlineSVG from 'svg-inline-react';

import svg from '!svg-inline!../../../assets/svg/sending.svg';

class Muziek extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    if(!this.props.main) {
      return;
    }

    this.streams =  {
      pop: 'http://icecast.omroep.nl/3fm-sb-mp3',
      easy: 'http://8573.live.streamtheworld.com:80/SKYRADIO_SC',
      classical: 'http://icecast.omroep.nl/radio4-bb-mp3',
      jazz: 'http://icecast.omroep.nl/radio6-bb-mp3'
    };


    this.audio = new Audio();
  }

  componentDidUpdate(){
    if(!this.props.main) {
      return;
    }

    if(this.props.data.object.state === this.prevState) {
      return;
    }
    this.prevState = this.props.data.object.state;

    switch(this.props.data.object.state){
      case 'uit':
        if (!this.audio.paused) this.audio.pause();
        break;
      case '3fm':
        this.playStream(this.streams.pop);
        break;
      case 'sky':
        this.playStream(this.streams.easy);
        break;
      case 'klassiek':
        this.playStream(this.streams.classical);
        break;
      case 'jazz':
        this.playStream(this.streams.jazz);
        break;
    }
  }

  playStream (stream) {
    this.audio.src = stream;
    this.audio.play();
  }

  render() {
    let classes = 'icon';
    if(this.props.data && this.props.data.digibord  && this.props.data.digibord.state !== '0' && this.props.data.digibord.state !== 0) {
      classes += ' on-digiboard';
    }

    return <div className={ classes }>
      <div className="off"></div>
      <div className="on">
        <div className="connected"><InlineSVG src={ svg } /></div>
      </div>
    </div>;
  }
}

export default BaseObject(Muziek, 'muziek');
