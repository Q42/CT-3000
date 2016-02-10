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

export default React.createClass({

  mixins: [ Reflux.listenTo(ObjectStore, 'onUpdate') ],

  componentDidMount() {
    const cm = this.refs.editor.getCodeMirror();
    cm.on('cursorActivity', this.parseLine);
  },

  getInitialState() {
    return {
      code: `// Toekenningen
lamp = aan
bericht = "test"

// Vergelijkingen
als lamp = aan dan radio = uit
als deur = open en lamp = uit dan bericht = "ALARM!"`,
      mode: '',
      languageInitiated: false
    };
  },

  updateCode(newCode) {
    this.setState({
      code: newCode
    });
  },

  parseLine(cm) {
    const lineContent = cm.getLine(cm.getCursor().line);

    if(this.lastLineContent && lineContent !== this.lastLineContent) {
      ObjectActions.parse(cm.getLine(cm.getCursor().line));
    }

    this.lastLineContent = lineContent;
  },

  onUpdate(data){
    if(this.state.languageInitiated)
      return;

    let availableObjects = ObjectStore.getAvailableObjects();
    let availableValues = ObjectStore.getAvailableValues();

    var language = new CT3000();
    CMInstance.defineSimpleMode('ct-3000', language.getMode(availableObjects, availableValues));
    this.setState({
      mode: 'ct-3000',
      languageInitiated: true
    });
  },

  render () {
    /*
    if(this.state.objects && Object.keys(this.state.objects).length > 0){
      console.log('render', this.state);
      let availableObject = ObjectActions.getAvailableObjects();
      let availableValues = ObjectActions.getAvailableValues();
      console.log('render2', availableObject, availableValues);
      var language = new CT3000(availableObject, availableValues);
      CMInstance.defineSimpleMode('ct-3000', language.getMode());
    }else{
      console.log('render', this.state);
    }
    */

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
        <Codemirror ref="editor" value={this.state.code} onChange={this.updateCode} options={options} />
      </div>
    );
  }
});
