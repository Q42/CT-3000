import React from 'react';

import HeaderComponent from './editor/header';
import EditorPaneComponent from './editor/editorPane';
import PreviewPaneComponent from './editor/previewPane';
import StatusBarComponent from './editor/statusBar.js';

import ObjectActions from '../actions/object';
import Firebase from '../classes/firebase';
import Hue from '../classes/hue';
import TranslationStore from '../stores/translation';

export default class Editor extends React.Component {

  componentWillMount(){
    TranslationStore.setLanguage(this.props.params.language);
    ObjectActions.initiate(TranslationStore.languageConfig);

    this.firebase = new Firebase();
    this.hue = new Hue();
  }

  render() {
    return(
      <div className="editor">
        <HeaderComponent />
        <div className="panes">
          <EditorPaneComponent template={this.props.params.template} />
          <PreviewPaneComponent />
        </div>
        <StatusBarComponent />
      </div>
    );
  }
}
