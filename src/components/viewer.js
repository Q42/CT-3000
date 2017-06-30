import React from 'react';
import firebase from 'firebase/app';
import firebasedb from 'firebase/database';
import Rebase from 're-base';

import LightsComponent from './viewer/lights';
import TheMatrixComponent from './viewer/theMatrix';
import MusicPlayerComponent from './viewer/musicPlayer';

import TranslationStore from '../stores/translation';

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);
    TranslationStore.setLanguage(props.match.params.language);

    this.state = {
      display: {},
      classId: props.match.params.digibordId,
    };
  }

  componentWillMount() {
    const app = firebase.initializeApp({ databaseURL: 'https://ct-3000.firebaseio.com/' });
    this.base = Rebase.createClass(firebasedb(app));

    this.ref = this.base.syncState(`classes/${this.state.classId}`, {
      context: this,
      state: 'display',
      then: () => {
        console.log('Synced with firebase database...');
      },
      onFailure: (err) => {
        console.error('Error connecting to firebase', err);
      }
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
