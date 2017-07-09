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
import TranslationStore from '../../stores/translation'

export default class EditorPane extends React.Component {

  constructor(props) {
    super(props);

    this.updateCode = this.updateCode.bind(this);
    this.parseUntilLine = this.parseUntilLine.bind(this);

    this.lineInterval = null;
    this.lineTimeoutDuration = 5000;

    this.previouslyFailedLines = [];

    let template = '';
    if (this.props.template) {
      try {
        template = require('raw-loader!../../assets/templates/' + TranslationStore.language + '/' + this.props.template + '.txt');
      } catch (ex) {
        console.warn('Cannot find template file /assets/templates/' + TranslationStore.language + '/' + this.props.template + '.txt');
      }
    }

    this.state = {
      code: template,
      mode: '',
      languageInitiated: false
    };
  }

  componentDidMount() {
    this.unsubscribe = ObjectStore.listen((data) => {
      this.onUpdate(data);
    });

    this.cm = this.refs.editor.getCodeMirror();
    this.cmDoc = this.cm.getDoc();
    this.cm.on('cursorActivity', () => {
      this.parseUntilLine();
    });
    this.setLineInterval();
  }

  componentWillUnmount() {
    this.clearLineInterval();
    this.unsubscribe();
  }

  onUpdate(data) {
    if(!this.state.languageInitiated) {
      this.initLanguage();
    }

    // Remove previous syntax errors
    const linesToClear = this.previouslyFailedLines.filter(line => !data.failedLines.includes(line));
    linesToClear.map(line => {
      this.cmDoc.removeLineClass(line, 'wrap', 'syntax-error');
    });

    // Highlight current syntax errors
    if(data.failedLines.length > 0) {
      const linesToAdd = data.failedLines.filter(line => !this.previouslyFailedLines.includes(line));
      linesToAdd.map(line => {
        this.cmDoc.addLineClass(line, 'wrap', 'syntax-error');
      });
    }

    // Store for the next parse round
    this.previouslyFailedLines = data.failedLines;
  }

  initLanguage() {
    let availableObjects = ObjectStore.getAvailableObjects();
    let availableValues = ObjectStore.getAvailableValues();
    let keywords = [TranslationStore.mappingKeywords['if'], TranslationStore.mappingKeywords['then'], TranslationStore.mappingKeywords['and']];

    var language = new CT3000();
    CMInstance.defineSimpleMode('ct-3000', language.getMode(availableObjects, availableValues, keywords));
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

  setLineInterval() {
    this.clearLineInterval();
    this.lineInterval = setInterval(this.parseUntilLine, this.lineTimeoutDuration);
  }

  clearLineInterval() {
    clearInterval(this.lineInterval);
  }

  parseUntilLine() {
    const currentLineNr = this.cm.getCursor().line;
    let lines = {};

    this.cm.eachLine(handle => {
      const lineNr = this.cm.getLineNumber(handle);
      const line = this.cm.getLine(lineNr);

      if(line && line.trim().length > 0) {
        lines[lineNr] = {
          code: line,
          current: currentLineNr === lineNr
        }
      }
    });

    ObjectActions.parseMulti(lines);
  }

  render() {
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
