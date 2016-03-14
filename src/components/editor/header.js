import React from 'react';

import ObjectStore from '../../stores/object';
import ObjectActions from '../../actions/object';

export default class HeaderComponent extends React.Component {

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

  onUpdate(data){
    const type = 'digibord';
    if(data && data.objects && data.objects[type] &&
      data.objects[type].getValue() !== this.state.state){
        this.setState({
          digibord: data.objects[type]
        });
      }
  }

  getState(){
    return {
      object: ObjectStore.getObject('digibord')
    };
  }

  render() {
    let connectedTo;
    if(this.state.digibord && this.state.digibord.state > 0){
      connectedTo = <span>{ this.state.digibord.state }</span>;
    }

    return(
      <header>
        <h1>CT-3000</h1>
        { connectedTo }
      </header>
    );
  }
}
