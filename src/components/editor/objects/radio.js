import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="radio" {...this.props}>
        <div className="icon">Radio</div>
      </BaseComponent>
    );
  }
});
