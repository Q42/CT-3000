import React from 'react';
import * as Objects from './objects/_index';

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rowResult: {
        checks: [
          {
            object: 'Lamp',
            value: 'aan',
            valid: true
          },
          {
            object: 'Lamp',
            value: 'uit',
            valid: false
          }
        ],
        assignments: [
          {
            object: 'Deur',
            value: 'aan',
            valid: false
          },
          {
            object: 'Deur',
            value: 'open',
            valid: true
          }
        ]
      }
    }
  }

  render() {
    const checks = this.state.rowResult.checks.map((check, i) => {
      const ObjectRef = Objects[check.object];
      const classNames = 'check' + (check.valid ? ' valid' : '');
      return <div className={classNames} key={i}><ObjectRef/> = {check.value}</div>
    });

    const assignments = this.state.rowResult.assignments.map((assignment, i) => {
      const ObjectRef = Objects[assignment.object];
      const classNames = 'assignment' + (assignment.valid ? ' valid' : '');
      return <div className={classNames} key={i}><ObjectRef/> = {assignment.value}</div>
    });

    let output = [];

    if(checks.length > 0) {
      output.push(
        <div className="objects checks" key="checks">
          { checks }
        </div>
      );

      if(checks.length > 1) {
        output.push(
          <div className="combinator" key="combinator">
            EN
          </div>
        );
      }

      if(assignments.length > 0) {
        output.push(
          <div className="computer" key="computer">
            // Hier staat een computer //
          </div>
        );
      }
    }

    if(assignments.length > 0) {
      output.push(
        <div className="objects assignments" key="assignments">
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
};
