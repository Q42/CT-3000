import React from 'react';

import HeaderComponent from './editor/header';
import EditorPaneComponent from './editor/editorPane';
import PreviewPaneComponent from './editor/previewPane';
import StatusBarComponent from './editor/statusBar.js';

import ObjectActions from '../actions/object';
import Firebase from '../classes/firebase';

export default React.createClass({

  componentWillMount(){
    var languageConfig = require('json!../config/language');
    ObjectActions.initiate(languageConfig);

    this.firebase = new Firebase();
  },

  render() {
    return(
      <div className="editor">
        <HeaderComponent />
        <div className="panes">
          <EditorPaneComponent />
          <PreviewPaneComponent />
        </div>
        <StatusBarComponent />
      </div>
    );
  }
});
