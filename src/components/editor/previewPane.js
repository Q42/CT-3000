import React from 'react';
//import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Motion, spring, presets } from 'react-motion';

import * as Objects from './objects/_index';

import ObjectActions from '../../actions/object';
import ObjectStore from '../../stores/object';

export default class PreviewPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowResult: null
    };
  }

  componentDidMount() {
    this.unsubscribe = ObjectStore.listen((data) => {
      this.onUpdate(data);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onUpdate(data){
    this.setState({
      rowResult: data.parsedCode
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    if(!this.state.rowResult || !(this.state.rowResult.checks || this.state.rowResult.assignments)){
        return false;
    }

    const checks = this.state.rowResult.checks.map((check, i) => {
      const ObjectRef = Objects[this.capitalizeFirstLetter(check.object)];
      if(!ObjectRef) return false;

      const classNames = 'check' + (check.valid ? ' valid' : '');
      return <div className={classNames} key={i}><ObjectRef/></div>;
    });

    const assignments = this.state.rowResult.assignments.map((assignment, i) => {
      const ObjectRef = Objects[this.capitalizeFirstLetter(assignment.object)];
      if(!ObjectRef) return false;

      const classNames = 'assignment' + (assignment.valid ? ' valid' : '');
      return <div className={classNames} key={i}><ObjectRef/></div>;
    });

    let output = [];

    if(checks.length > 0) {
      let classLength = checks.length > 4 ? ' much-objects' : '';
      output.push(
        <div className={"objects checks" + classLength} key="checks">
          { checks }
        </div>
      );

      if(assignments.length > 0) {
        output.push(
          <div className="computer" key="computer"></div>
        );
      }
    }

    if(assignments.length > 0) {
      let classLength = assignments > 4 ? ' much-objects' : ''
      output.push(
        <div className={"objects assignments" + classLength} key="assignments">
          { assignments }
        </div>
      );
    }

    return(
      <div className="pane preview-pane">
      { output }
      </div>
    );
  }
}
