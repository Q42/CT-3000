import React from 'react';

import * as Objects from './objects/_index';

export default React.createClass({
  getInitialState() {
    const objects = Object.keys(Objects).map((key) => {
      const ObjectInstance = Objects[key];
      return <ObjectInstance />
    });

    return { objects }
  },

  render() {
    console.log(this.state.objects)
    return(
      <div className="result">
        {this.state.objects}
      </div>
    );
  }
});
