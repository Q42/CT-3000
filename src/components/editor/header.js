import React from 'react';
import { Link } from 'react-router'

import ObjectStore from '../../stores/object';
import ObjectActions from '../../actions/object';

import LanguageSwitch from './languageSwitch.js';

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
          digibord: data.objects.digibord,
          naam: data.objects.naam
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
    if(this.state.digibord && this.state.digibord.state && this.state.digibord.state.length === 6){
      connectedTo = <h3 className="connected-to">{ this.state.digibord.state }</h3>;
    }

    return(
      <header>
        <h1><Link to="/">CT-3000</Link></h1>
        { name }
        { connectedTo }
        <LanguageSwitch />
      </header>
    );
  }
}
