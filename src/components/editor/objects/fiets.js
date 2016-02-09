import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="fiets" {...this.props}>
        <div className="icon">Fiets</div>
      </BaseComponent>
    );
  }
});
