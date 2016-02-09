import React from 'react';

import BaseComponent from '../baseComponent';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="lamp" {...this.props}>
        <div className="icon">Lamp</div>
      </BaseComponent>
    );
  }
});
