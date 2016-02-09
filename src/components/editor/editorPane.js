import React from 'react';
import ReactDOM from 'react-dom';
import Codemirror from 'react-codemirror';

import 'codemirror/addon/mode/simple';
import 'codemirror/addon/selection/active-line';

export default React.createClass({
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
      mode: 'ct-3000',
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
      console.log(cm.getLine(cm.getCursor().line));
    }

    this.lastLineContent = lineContent;
  },
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
        <Codemirror ref="editor" value={this.state.code} onChange={this.updateCode} options={options} />
      </div>
    );
  }
});

import CMInstance from 'codemirror';
CMInstance.defineSimpleMode('ct-3000', {
  // The start state contains the rules that are intially used
  start: [
    // Prop names
    {regex: /(?:lamp|radio|deur|bericht)\b/, token: 'variable-3'},
    // Keywords
    {regex: /(?:als|dan|en)\b/, token: 'keyword'},
    // Value enums
    {regex: /(?:aan|uit|open|dicht)\b/, token: 'atom'},

    // The regex matches the token, the token property contains the type
    {regex: /"(?:[^\\]|\\.)*?"/, token: 'string'},
    // You can match multiple tokens at once. Note that the captured
    // groups must span the whole string in this case
    {regex: /(function)(\s+)([a-z$][\w$]*)/,
     token: ['keyword', null, 'variable-2']},
    // Rules are matched in the order in which they appear, so there is
    // no ambiguity between this one and the one above
    {regex: /(?:function|var|return|if|for|while|else|do|this)\b/,
     token: 'keyword'},
    {regex: /true|false|null|undefined/, token: 'atom'},
    {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
     token: 'number'},
    {regex: /\/\/.*/, token: 'comment'},
    {regex: /\/(?:[^\\]|\\.)*?\//, token: 'variable-3'},
    // A next property will cause the mode to move to a different state
    {regex: /\/\*/, token: 'comment', next: 'comment'},
    {regex: /[-+\/*=<>!]+/, token: 'operator'},
    // indent and dedent properties guide autoindentation
    {regex: /[\{\[\(]/, indent: true},
    {regex: /[\}\]\)]/, dedent: true},
    {regex: /[a-z$][\w$]*/, token: 'variable'},
    // You can embed other modes with the mode property. This rule
    // causes all code between << and >> to be highlighted with the XML
    // mode.
    {regex: /<</, token: 'meta', mode: {spec: 'xml', end: />>/}}
  ],
  // The multi-line comment state.
  comment: [
    {regex: /.*?\*\//, token: 'comment', next: 'start'},
    {regex: /.*/, token: 'comment'}
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    dontIndentStates: ['comment'],
    lineComment: '//'
  }
});
