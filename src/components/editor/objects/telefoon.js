import React from 'react';

import BaseComponent from './_baseObject';

export default React.createClass({
  render() {
    return(
      <BaseComponent type="telefoon" {...this.props}>
        <div className="icon">Telefoon</div>
      </BaseComponent>
    );
  }
});
