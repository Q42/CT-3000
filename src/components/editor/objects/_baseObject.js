import React from 'react';
import Reflux from 'reflux';

import ObjectStore from '../../../stores/object';
import ObjectActions from '../../../actions/object';

export let BaseObject = (ComposedComponent, type) => class extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getState();
  }

  componentDidMount() {
    this.unsubscribe = ObjectStore.listen((name) => {
      this.onUpdate(name);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onUpdate(updateFor){
    if(updateFor === type){
      this.setState(this.getState());
    }
  }

  getState(){
    return {
      value: ObjectStore.getObjectValue(type)
    };
  }

  render() {
    const classNames = 'object ' + type;
    return (
      <div className={classNames}>
        <ComposedComponent {...this.props} data={this.state} />
      </div>
    );
  }
};
