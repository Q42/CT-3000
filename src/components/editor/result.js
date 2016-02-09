import React from 'react';

import Lamp from './objects/lamp';
import Radio from './objects/radio';

export default React.createClass({
  render() {
    const items = [
      <Lamp key="lamp" />,
      <Radio key="radio" />
    ];
    return(
      <div className="result">
        {items}
      </div>
    );
  }
});
