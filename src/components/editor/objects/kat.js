import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="kat" {...this.props}>
        <div className="icon">Kat</div>
      </BaseComponent>
    );
  }
});
