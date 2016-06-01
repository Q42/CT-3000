import React from 'react';
import BaseObject from './_baseObject';

import InlineSVG from 'svg-inline-react';
import svg from '!svg-inline!../../../assets/svg/sending.svg';

class Muziek extends React.Component {
  componentWillMount() {
    if(!this.props.main) {
      return;
    }

    this.musicStream = this.props.audio;
  }

  componentDidUpdate(){
    if(!this.props.main) {
      return;
    }

    const digibordConnected = this.props.digibordConnected;
    if(digibordConnected) {
      this.musicStream.pause();
      this.prevConnectedState = digibordConnected;
      return;
    }

    const stream = this.props.object.state;
    if(stream  === this.prevState && digibordConnected === this.prevConnectedState) {
      return;
    }
    this.prevState = stream;
    this.prevConnectedState = digibordConnected;

    this.musicStream.play(stream);
  }

  render() {
    let classes = 'icon';
    if(this.props.digibordConnected) {
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
