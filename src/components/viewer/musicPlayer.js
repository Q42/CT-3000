import React from 'react';

import InlineSVG from 'svg-inline-react';
import svg from '!svg-inline!../../assets/svg/radio-station.svg';

import MusicStream from '../../classes/musicStream';

export default class TheMatrixComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.musicStream = new MusicStream();
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

  getStream() {
    return this.props.music.value || 'uit';
  }

  render() {
    const stream = this.getStream();

    return(
      <div className={ 'station' + ( stream !== 'uit' ? ' send' : '' ) }>
        <span className="icon-station" aria-hidden="true">
          <InlineSVG src={ svg } />
        </span>
        { this.renderNowPlaying(stream) }
      </div>
    );
  }

  renderNowPlaying(stream) {
    if(stream === 'uit') {
      return (
        <div>
          <h3>
            <small>Geen muziek geselecteerd</small>
          </h3>
        </div>
      );
    }

    const streamSessionKey = this.props.music.sessionKey;
    const session = this.props.sessions[streamSessionKey] || {};
    const userName = session.name || 'Anoniempje';

    return (
      <div>
        <h3>
          <small>Je luistert nu naar:</small> { stream }
        </h3>
        <p className="choice-of">
          de keuze van <strong>{ userName }</strong>
        </p>
      </div>
    );

  }
}
