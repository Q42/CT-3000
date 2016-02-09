import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="broer" {...this.props}>
        <div className="icon">Broer</div>
      </BaseComponent>
    );
  }
});
