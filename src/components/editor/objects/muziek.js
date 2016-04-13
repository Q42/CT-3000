import React from 'react';
import BaseObject from './_baseObject';

import InlineSVG from 'svg-inline-react';
import svg from '!svg-inline!../../../assets/svg/sending.svg';

import MusicStream from '../../../classes/musicStream';

class Muziek extends React.Component {
  componentWillMount() {
    if(!this.props.main) {
      return;
    }

    this.musicStream = new MusicStream();
  }

  componentDidUpdate(){
    if(!this.props.main) {
      return;
    }

    const digibord = this.props.data.digibord.state;
    const digibordConnected = (digibord && digibord.length === 6);
    if(digibordConnected) {
      this.musicStream.pause();
      return;
    }

    const stream = this.props.data.object.state;
    if(stream  === this.prevState) {
      return;
    }
    this.prevState = stream;

    this.musicStream.play(stream);
  }

  render() {
    const digibord = this.props.data.digibord.state;

    let classes = 'icon';
    if(digibord  && digibord.length === 6) {
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
