import React from 'react';

import HeaderComponent from './editor/header';
import EditorPaneComponent from './editor/editorPane';
import PreviewPaneComponent from './editor/previewPane';

import ObjectActions from '../actions/object';
import ObjectStore from '../stores/object';

export default React.createClass({

  componentWillMount(){
    var languageConfig = require('json!../config/language');
    ObjectActions.initiate(languageConfig);
    ObjectActions.parse('als lamp = aan dan huis = licht');
  },

  render() {
    return(
      <div className="editor">
        <HeaderComponent />
        <div className="panes">
          <EditorPaneComponent />
          <PreviewPaneComponent />
        </div>
      </div>
    );
  }
});
