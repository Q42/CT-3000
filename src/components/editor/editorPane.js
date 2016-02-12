import React from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';
import Codemirror from 'react-codemirror';

import CMInstance from 'codemirror';
import CT3000 from '../../config/codemirrorCustomMode';

import 'codemirror/addon/mode/simple';
import 'codemirror/addon/selection/active-line';

import ObjectActions from '../../actions/object';
import ObjectStore from '../../stores/object';

export default class EditorPane extends React.Component {

  constructor(props) {
    super(props);

    this.updateCode = this.updateCode.bind(this);
    this.parseLine = this.parseLine.bind(this);

    this.state = {
      code: `// Toekenningen
lamp = aan
bericht = "test"

// Vergelijkingen
als weer = slecht dan lamp = aan
als deur = open en lamp = uit dan bericht = "ALARM!"`,
      mode: '',
      languageInitiated: false
    };
  }

  componentDidMount() {
    this.unsubscribe = ObjectStore.listen((data) => {
      this.onUpdate(data);
    });

    const cm = this.refs.editor.getCodeMirror();
    cm.on('cursorActivity', this.parseLine);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onUpdate(data){
    if(!this.state.languageInitiated)
      this.initLanguage();
  }

  initLanguage(){
    let availableObjects = ObjectStore.getAvailableObjects();
    let availableValues = ObjectStore.getAvailableValues();

    var language = new CT3000();
    CMInstance.defineSimpleMode('ct-3000', language.getMode(availableObjects, availableValues));
    this.setState({
      mode: 'ct-3000',
      languageInitiated: true
    });
  }

  updateCode(newCode) {
    this.setState({
      code: newCode
    });
  }

  parseLine(cm) {
    const lineContent = cm.getLine(cm.getCursor().line);

    if(lineContent !== this.lastLineContent) {
      ObjectActions.parse(lineContent);
    }

    this.lastLineContent = lineContent;
  }

  render () {
    var options = {
      lineNumbers: true,
      lineWrapping: true,
      indentUnit: 2,
      tabSize: 2,
      theme: 'monokai',
      styleActiveLine: true,
      mode: this.state.mode
    };
    return (
      <div className="pane editor-pane">
        <Codemirror ref="editor" value={ this.state.code } onChange={ this.updateCode } options={ options } />
      </div>
    );
  }

}
