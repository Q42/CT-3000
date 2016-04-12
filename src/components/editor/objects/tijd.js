import React from 'react';
import BaseObject from './_baseObject';

class Tijd extends React.Component {
  render() {
    let state;
    if(this.props.data.object)
      state = this.props.data.object.state;

    const d = new Date(state);
    const hourRotate = (360 / 12) * (d.getHours() % 12) + (360 / 12) * (1 / (60 / d.getMinutes()));
    const minuteRotate = (360 / 60) * d.getMinutes();

    return <div className="icon">
      <div className="hourHandContainer">
        <div className="hourHand" style={{ transform: 'rotate(' + hourRotate + 'deg)' }} />
      </div>
      <div className="minuteHandContainer">
        <div className="minuteHand" style={{ transform: 'rotate(' + minuteRotate + 'deg)' }} />
      </div>
    </div>;
  }
}

export default BaseObject(Tijd, 'tijd');
