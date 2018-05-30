import React from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

import LightsComponent from './viewer/lights';
import TheMatrixComponent from './viewer/theMatrix';
import MusicPlayerComponent from './viewer/musicPlayer';

import TranslationStore from '../stores/translation';
import { trackPage } from '../classes/googleanalytics';

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);
    trackPage('/digibord', this.props.match.params.language);

    TranslationStore.setLanguage(props.match.params.language);

    this.state = {
      display: {},
      classId: props.match.params.digibordId,
    };
  }

  componentWillMount() {
    const app = firebase.initializeApp({
      apiKey: 'AIzaSyC1KnxqjtoIoF7Tvj-pPVBsPoHkdtv0zMc',
      authDomain: 'ct-3000.firebaseapp.com',
      databaseURL: 'https://ct-3000.firebaseio.com',
      projectId: 'ct-3000',
      storageBucket: 'ct-3000.appspot.com',
      messagingSenderId: '414261788492'
    });
    firebase.database()
      .ref(`classes/${this.state.classId}`)
      .on('value', (snapshot) => {
        // console.log('got value', snapshot.val());
        this.setState({ display: snapshot.val() })
      });
  }

  componentDidMount() {
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;
  }

  componentDidUpdate() {
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;
  }

  render() {
    const sessions = this.state.display.sessions || {};
    const nrSessions = this.state.display.sessions ? Object.keys(sessions).length : 0;

    return(
      <div className="viewer">
        <div className="content">
          <div className="diagonal-thingy" aria-hidden="true"></div>

          <h2 className="header-init">
            <span className="class-id">{ TranslationStore.mappingClassToUI.digibord } = { this.state.classId }</span>
          </h2>

          <div ref="chat" className="chat">
            { this.renderMessages() }
          </div>

          <div className="users-total">
            <h3>{ nrSessions } { nrSessions == 1 ? TranslationStore.mappingKeywords.user : TranslationStore.mappingKeywords.users }</h3>
          </div>

          <TheMatrixComponent />

          <MusicPlayerComponent music={ this.state.display.music || {} } sessions={ this.state.display.sessions || {} } />
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
      const userName = session.name || TranslationStore.mappingKeywords.anonymousUser;

      return (
        <div className="user-message" key={ key }>
          <div className="user-name">{ userName } { TranslationStore.mappingKeywords.says }:</div>
          <div className="user-text">{ message.message }</div>
        </div>
      );
    });
  }
}
