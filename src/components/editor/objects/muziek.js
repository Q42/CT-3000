import React from 'react';
import { BaseObject } from './_baseObject';
import Rebase from 're-base';

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

    const digibord = this.props.data.digibord.state;
    const sendToDigibord = !digibord || digibord.length !== 6 ? false : digibord;

    const stream = this.props.data.object.state;
    if(stream + '-' + sendToDigibord  === this.prevState) {
      return;
    }
    this.prevState = stream + '-' + sendToDigibord;

    switch(stream){
      case 'uit':
        this.playStream(false, stream, sendToDigibord);
        break;
      case '3fm':
        this.playStream(this.streams.pop, stream, sendToDigibord);
        break;
      case 'sky':
        this.playStream(this.streams.easy, stream, sendToDigibord);
        break;
      case 'klassiek':
        this.playStream(this.streams.classical, stream, sendToDigibord);
        break;
      case 'jazz':
        this.playStream(this.streams.jazz, stream, sendToDigibord);
        break;
    }
  }

  connectFirebase(classId) {
    if(this.fireBase) {
      this.fireBase.reset();
      delete this.fireBase;
    }

    this.fireBase = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + classId);
  }

  playStream (stream, id, sendToDigibord) {
    if(sendToDigibord){
      if(!this.audio.paused){
        this.audio.pause();
      }
      this.connectFirebase(sendToDigibord);

      if(!this.fireBase) {
        return;
      }

      const groupName = this.props.data.naam.state;
      const data = { stream, id, groupName };

      if(!this.messageRef) {
        this.messageRef = this.fireBase.post('display/music', { data });
        return;
      }

      this.messageRef.set(data);
    }else{
      if(!stream && !this.audio.paused){
        this.audio.pause();
        return;
      }

      if(!stream){
        return;
      }

      this.audio.src = stream;
      this.audio.play();
    }
  }

  render() {
    let classes = 'icon';
    if(this.props.data && this.props.data.digibord  && this.props.data.digibord.state !== '0' && this.props.data.digibord.state !== 0) {
      classes += ' on-digiboard';
    }

    return <div className={ classes }>
      <div className="off"></div>
      <div className="on"></div>
    </div>;
  }
}

export default BaseObject(Muziek, 'muziek');
