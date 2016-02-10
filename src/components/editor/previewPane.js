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
      return <ObjectRef key={i} />
    });

    const assignments = this.state.rowResult.assignments.map((assignment, i) => {
      const ObjectRef = Objects[assignment.object];
      return <ObjectRef key={i} />
    });

    return(
      <div className="pane preview-pane">
        <div className="objects checks">
          {checks}
        </div>
        <div className="computer">
          // This is our PC component //
        </div>
        <div className="objects assignments">
          {assignments}
        </div>
      </div>
    );
  }
};
