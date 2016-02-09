import React from 'react';

import Lamp from './components/lamp';
import Radio from './components/radio';

export default React.createClass({
  render() {
    const items = [
      <Lamp />,
      <Radio />
    ];
    return(
      <div className="row-preview">
        {items}
      </div>
    );
  }
});
