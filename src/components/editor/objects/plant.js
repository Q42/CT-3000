import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="plant" {...this.props}>
        <div className="icon">Plant</div>
      </BaseComponent>
    );
  }
});
