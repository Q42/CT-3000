import React from 'react';
import ReactDOM from 'react-dom';
import Codemirror from 'react-codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/selection/active-line';
// import 'codemirror/addon/hint/show-hint';
// import 'codemirror/addon/hint/javascript-hint';


var defaults = {
  javascript: 'var component = {\n\tname: "react-codemirror",\n\tauthor: "Jed Watson",\n\trepo: "https://github.com/JedWatson/react-codemirror"\n};'
};


export default React.createClass({
  getInitialState () {
    return {
      code: defaults.javascript,
      readOnly: false,
      mode: 'javascript',
    };
  },
  updateCode (newCode) {
    this.setState({
      code: newCode
    });
  },
  interact(cm){
    console.log(cm.getValue());
  },
  render () {
    var options = {
      lineNumbers: true,
      lineWrapping: true,
      indentUnit: 2,
      tabSize: 2,
      theme: "monokai",
      styleActiveLine: true,
      mode: this.state.mode
    };
    return (
      <div className="pane editor-pane">
        <Codemirror ref="editor" value={this.state.code} onChange={this.updateCode} options={options} interact={this.interact}/>
      </div>
    );
  }
});


