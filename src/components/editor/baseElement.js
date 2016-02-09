import React from 'react';

export default React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },

  render() {
    return(
      <div className={"base-element elt-" + this.props.name.toLowerCase() }>{this.props.name}</div>
    );
  }
});
