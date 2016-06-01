import React from 'react';

import HeaderComponent from './editor/header';
import EditorPaneComponent from './editor/editorPane';
import PreviewPaneComponent from './editor/previewPane';
import StatusBarComponent from './editor/statusBar.js';

import ObjectActions from '../actions/object';
import Firebase from '../classes/firebase';
import MusicStream from '../classes/musicStream';

export default React.createClass({

  componentWillMount(){
    var languageConfig = require('json!../config/language');
    ObjectActions.initiate(languageConfig);

    this.firebase = new Firebase();
    this.audio = new MusicStream();
  },

  render() {
    return(
      <div className="editor">
        <HeaderComponent />
        <div className="panes">
          <EditorPaneComponent initAudio={ () => this.audio.init() }/>
          <PreviewPaneComponent />
        </div>
        <StatusBarComponent audio={ this.audio } />
      </div>
    );
  }
});
