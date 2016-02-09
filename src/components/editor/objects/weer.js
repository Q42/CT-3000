import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="weer" {...this.props}>
        <div className="icon">Weer</div>
      </BaseComponent>
    );
  }
});
