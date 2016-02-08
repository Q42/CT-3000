import React from 'react';

import HeaderComponent from './editor/header';
import EditorPaneComponent from './editor/editorPane';
import PreviewPaneComponent from './editor/previewPane';

export default React.createClass({
  render() {
    return(
      <div>
        <HeaderComponent />
        <div>
          <EditorPaneComponent />
          <PreviewPaneComponent />
        </div>
      </div>
    );
  }
});
