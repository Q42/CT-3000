import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="deur" {...this.props}>
        <div className="icon">Deur</div>
      </BaseComponent>
    );
  }
});
