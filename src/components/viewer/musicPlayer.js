import React from 'react';

import InlineSVG from 'svg-inline-react';
import svg from '!svg-inline!../../assets/svg/radio-station.svg';

import MusicStream from '../../classes/musicStream';
import TranslationStore from '../../stores/translation';

export default class MusicPlayerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueOff: TranslationStore.mappingClassToUI['uit']
    }
  }

  componentWillMount() {
    this.musicStream = new MusicStream();
  }

  componentDidUpdate() {
    // TODO: Check if music playing user disconnected.

    const stream = this.getStream();
    if(this.currentStream === stream) {
      return;
    }

    this.currentStream = stream;
    this.musicStream.play(stream);
  }

  getStream() {
    return this.props.music.value || this.state.valueOff;
  }

  render() {
    const stream = this.getStream();

    return(
      <div className={ 'station' + ( stream !== this.state.valueOff ? ' send' : '' ) }>
        <span className="icon-station" aria-hidden="true">
          <InlineSVG src={ svg } />
        </span>
        { this.renderNowPlaying(stream) }
      </div>
    );
  }

  renderNowPlaying(stream) {
    if(stream === this.state.valueOff) {
      return (
        <div>
          <h3>
            <small>{ TranslationStore.mappingKeywords.noMusic }</small>
          </h3>
        </div>
      );
    }

    const streamSessionKey = this.props.music.sessionKey;
    const session = this.props.sessions[streamSessionKey] || {};
    const userName = session.name || TranslationStore.mappingKeywords.anonymousUser;

    return (
      <div>
        <h3>
          <small>{TranslationStore.mappingKeywords.nowListeningTo}:</small> { stream }
        </h3>
        <p className="choice-of">
          {TranslationStore.mappingKeywords.musicChosenBy} <strong>{ userName }</strong>
        </p>
      </div>
    );

  }
}
