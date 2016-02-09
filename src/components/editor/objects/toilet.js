import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="toilet" {...this.props}>
        <div className="icon">Toilet</div>
      </BaseComponent>
    );
  }
});
