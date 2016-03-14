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
    this.executeCode = this.executeCode.bind(this);
    this.stopExecution = this.stopExecution.bind(this);

    this.codeInterval = null;

    this.state = {
      code: `// Toekenningen
digibord = 123456
naam = "Naam van je groepje"
lamp = aan
bericht = "test"
tijd = 10:15
muziek = 3fm

// Vergelijkingen
als tijd > 10:14 dan lamp = aan
als weer = slecht dan lamp = aan
als deur = open en lamp = uit dan bericht = "ALARM!"`,
      mode: '',
      executing: false,
      languageInitiated: false
    };
  }

  componentDidMount() {
    this.unsubscribe = ObjectStore.listen((data) => {
      this.onUpdate(data);
    });


    this.cm = this.refs.editor.getCodeMirror();
    this.cm.on('cursorActivity', this.parseLine);
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

  executeCode() {
    if(this.state.executing) {
      return;
    }

    this.setState({
      executing: true
    });

    this.cm.setCursor(0, 0);

    let lineCount = this.cm.lineCount();
    let line = 1;
    this.codeInterval = setInterval(() => {
      this.cm.setCursor(line, 0);
      line++;

      if(line > lineCount) {
        clearInterval(this.codeInterval);

        this.cm.setCursor(0, 0);
        this.setState({
          executing: false
        });
      }
    }, 3000);
  }

  stopExecution() {
    this.setState({
      executing: false
    });
    clearInterval(this.codeInterval);
  }

  render () {
    var options = {
      lineNumbers: true,
      lineWrapping: true,
      indentUnit: 2,
      tabSize: 2,
      theme: 'monokai',
      styleActiveLine: true,
      mode: this.state.mode,
      readOnly: this.state.executing
    };

    let classNames = 'pane editor-pane';
    if(this.state.executing) {
      classNames += ' executing';
    }

    return (
      <div className={ classNames }>
        <Codemirror ref="editor" value={ this.state.code } onChange={ this.updateCode } options={ options } />
        <button className="play" onClick={ this.state.executing ? this.stopExecution : this.executeCode }><span className="icon-btn" aria="hidden"></span>{ this.state.executing ? 'Stop test' : 'Test code' }</button>
      </div>
    );
  }

}
