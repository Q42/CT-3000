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
    if(data && data.objects){
        this.setState({
          digibord: data.objects.digibord && data.objects.digibord.getValue() !== this.state.digibord ? data.objects.digibord : null,
          naam: data.objects.naam && data.objects.naam.getValue() !== this.state.naam ? data.objects.naam : null
        });
      }
  }

  getState(){
    return {
      digibord: ObjectStore.getObject('digibord'),
      naam: ObjectStore.getObject('naam'),
    };
  }

  render() {
    let name;
    if(this.state.naam && this.state.naam.state !== ''){
      name = <h2>{ this.state.naam.state }</h2>;
    }

    let connectedTo;
    if(this.state.digibord && this.state.digibord.state > 0){
      connectedTo = <h3 className="connected-to">{ this.state.digibord.state }</h3>;
    }

    return(
      <header>
        <h1>CT-3000</h1>
        { name }
        { connectedTo }
      </header>
    );
  }
}
