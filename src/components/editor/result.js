import React from 'react';

import * as Objects from './objects/_index';

export default React.createClass({
  render() {
    const items = [
      <Objects.Lamp key="lamp" />,
      <Objects.Radio key="radio" />
    ];
    return(
      <div className="result">
        {items}
      </div>
    );
  }
});
