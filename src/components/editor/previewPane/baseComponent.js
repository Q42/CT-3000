import React from 'react';

export default React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired
  },
  render() {
    const classNames = 'component ' + this.props.type;
    return(
      <div className={classNames} {...this.props}>
        {this.props.children}
      </div>
    );
  }
});
