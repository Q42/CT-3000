import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="tv" {...this.props}>
        <div className="icon">TV</div>
      </BaseComponent>
    );
  }
});
