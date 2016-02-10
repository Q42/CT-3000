import React from 'react';

export default React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    status: React.PropTypes.bool.isRequired,
  },

  getDefaultProps: function() {
    return {
      status: false
    };
  },

  render() {
    const statusClass = this.props.status ? ' on' : ' off';
    const classNames = 'object ' + this.props.type + statusClass;
    return(
      <div className={classNames} {...this.props}>
        {this.props.children}
      </div>
    );
  }
});
