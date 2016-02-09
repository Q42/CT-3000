import React from 'react';

import Lamp from './components/lamp';
import Radio from './components/radio';

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
