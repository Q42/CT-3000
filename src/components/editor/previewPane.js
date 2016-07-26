import React from 'react';
import { Motion, spring, presets } from 'react-motion';

const springSetting1 = {stiffness: 164, damping: 10};

import * as Objects from './objects/_index';

import ObjectActions from '../../actions/object';
import ObjectStore from '../../stores/object';
import TranslationStore from '../../stores/translation'

export default class PreviewPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowResult: null,
      failedLines: [],
      lines: [],
      linesDrawForObjectStructureId: ''
    };

    this.checkRefs = [];
    this.assignmentRefs = [];
  }

  handleResize(e) {
    this.setState({
      linesDrawForObjectStructureId: ''
    });
  }

  componentDidMount() {
    this.unsubscribe = ObjectStore.listen((data) => {
      this.onUpdate(data);
    });
    window.addEventListener('resize', (e) => this.handleResize(e));
  }

  componentWillUnmount() {
    this.unsubscribe();
    window.removeEventListener('resize', (e) => this.handleResize(e));
  }

  onUpdate(data){
    this.setState({
      rowResult: data.parsedCode,
      failedLines: data.failedLines
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  createLine(from, to, key = ''){
    const center = {
      from: this.getCenter(from),
      to: this.getCenter(to)
    };

    const style = from.className.indexOf('valid') > -1 ? 'valid' : 'not-valid';

    return this.createLineDiv(center.from.x, center.from.y, center.to.x, center.to.y, key, 32, style);
  }

  createLineDiv(x1, y1, x2, y2, key = '', thickness = 2, style = 'transparent'){
    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    const cx = ((x1 + x2) / 2) - (length / 2);
    const cy = ((y1 + y2) / 2) - (thickness / 2);
    const angle = Math.atan2((y1 - y2),(x1 - x2)) * (180 / Math.PI);

    const styles = {
      padding: 0,
      margin: 0,
      height: thickness + 'px',
      width: length + 'px',
      lineHeight: '1px',
      position: 'absolute',
      top: cy + 'px',
      left: cx + 'px',
      transform: 'rotate(' + angle + 'deg)',
      msTransform: 'rotate(' + angle + 'deg)',
      MozTransform: 'rotate(' + angle + 'deg)',
      WebkitTransform: 'rotate(' + angle + 'deg)',
      OTransform: 'rotate(' + angle + 'deg)'
    };
    return <div className={'line ' + style} key={ key } style={ styles } />;
  }

  componentWillUpdate(){
    this.checkRefs = [];
    this.assignmentRefs = [];
  }

  componentDidUpdate(){
    this.updateLines();
  }

  updateLines(fromRender = true){
    let objectStructureId = '';
    if(this.checkRefs.length > 0)
      objectStructureId += this.checkRefs.map(x => x ? x.className.replace(/\ /g,'-') + x.firstChild.className.replace(/\ /g,'-') : '');

    if(this.assignmentRefs.length > 0)
      objectStructureId += this.assignmentRefs.map(x => x ? x.className.replace(/\ /g,'-') + x.firstChild.className.replace(/\ /g,'-') : '');

    if(this.state.linesDrawForObjectStructureId === objectStructureId)
      return;

    let checkLines = [], assignmentLines = [], extraLines = [];

    if(this.checkRefs.length > 0){
      const checkConnectElement = this.refs.combinator ? this.refs.combinator : this.refs.computer;

      if(this.refs.combinator)
        extraLines.push(this.createLine(this.refs.combinator, this.refs.computer, 'extra-and-line-'));

      checkLines = this.checkRefs.map((x, i) => {
        return this.createLine(x, checkConnectElement, 'check-line-' + i);
      });
    }

    if(this.assignmentRefs.length > 0 && this.checkRefs.length > 0)
      assignmentLines = this.assignmentRefs.map((x, i) => {
        return this.createLine(this.refs.computer, x, 'assignment-line-' + i);
      });

    this.setState({
      lines: checkLines.concat(assignmentLines).concat(extraLines),
      linesDrawForObjectStructureId: objectStructureId
    });
  }

  getCenter(domElement){
    if(!domElement)
        return null;

    return {
      x: domElement.offsetLeft + domElement.offsetWidth / 2,
      y: domElement.offsetTop + domElement.offsetHeight / 2
    };
  }

  render() {
    if(this.state.failedLines.length > 0) {
      return (
        <div className="pane preview-pane">
          <div className="cpu syntax-error"></div>
        </div>
      );
    }

    if(!this.state.rowResult || !(this.state.rowResult.checks || this.state.rowResult.assignments)){
      return false;
    }

    let allChecksValid = true;
    const checks = this.state.rowResult.checks.map((check, i) => {
      const ObjectRef = Objects[this.capitalizeFirstLetter(TranslationStore.mappingUIToClass[check.object])];
      if(!ObjectRef) return false;

      if(!check.valid)
        allChecksValid = false;

      const classNames = 'check' + (check.valid ? ' valid' : '');
      return <div className={classNames} key={i} ref={ (ref) => ref ? this.checkRefs.push(ref) : null }><ObjectRef/></div>;
    });

    const assignments = this.state.rowResult.assignments.map((assignment, i) => {
      const ObjectRef = Objects[this.capitalizeFirstLetter(TranslationStore.mappingUIToClass[assignment.object])];
      if(!ObjectRef) return false;

      const classNames = 'assignment' + (assignment.valid ? ' valid' : '');
      return <div className={classNames} key={i} ref={ (ref) => ref ? this.assignmentRefs.push(ref) : null }><ObjectRef/></div>;
    });

    let output = [];

    if(checks.length > 0) {
      let classLength = checks.length > 4 ? ' much-objects' : '';
      output.push(
        <div className={'objects checks ' + classLength} key="checks">
          { checks }
        </div>
      );

      if(checks.length > 1) {
        const combinaterClasses = 'combinator ' + (allChecksValid ? 'valid' : '');
        output.push(
          <div className={ combinaterClasses } key="combinator" ref="combinator">
            <div className="ampersand">&amp;</div>
          </div>
        );
      }

      if(assignments.length > 0) {
        const computerClasses = 'computer ' + (allChecksValid ? 'valid' : '');
        output.push(
          <div className={ computerClasses } key="computer" ref ="computer"></div>
        );
      }
    }

    if(assignments.length > 0) {
      let classLength = assignments.length > 4 ? ' much-objects' : '';
      output.push(
        <div className={ 'objects assignments ' + classLength } key="assignments">
          { assignments }
        </div>
      );
    }

    return(
      <div className="pane preview-pane">
        { output }
        { this.state.lines }
      </div>
    );
  }
}
