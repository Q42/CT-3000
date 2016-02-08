import React from 'react';
import ReactDOM from 'react-dom';
import Codemirror from 'react-codemirror';

require('codemirror/mode/javascript/javascript');


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
      mode: this.state.mode
    };
    return (
      <div className="pane editor-pane">
        <Codemirror ref="editor" value={this.state.code} onChange={this.updateCode} options={options} interact={this.interact}/>
      </div>
    );
  }
});


