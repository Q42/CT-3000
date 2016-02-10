import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="stroom" {...this.props}>
        <div className="icon">Stroom</div>
      </BaseComponent>
    );
  }
});
