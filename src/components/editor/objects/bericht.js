import React from 'react';
import { BaseObject } from './_baseObject';
import Rebase from 're-base';

const springSetting1 = {stiffness: 164, damping: 10};

class Bericht extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: {},
      showMessage: true,
      timer: null
    };

    this.hideMessage = this.hideMessage.bind(this)
  }

  componentDidMount() {
    if(!this.props.main) {
      return;
    }
  }

  componentDidUpdate() {

    if(!this.props.main) {
      // IF Object is in preview pane hide message after a few seconds unless content is being updated
      if(this.props.data.object.state != this.prevState) {
        this.prevState = this.props.data.object.state;

        clearTimeout(this.state.timer);
        this.setState({
          showMessage: true,
          timer: setTimeout(this.hideMessage, 4242)
        });
      }
      // And do nothing more IF Object is in preview pane
      return;
    }

    if(this.props.data.object.state === this.prevState) {
      return;
    }
    this.prevState = this.props.data.object.state;

    const digibord = (this.props.data.digibord || {}).state || null;
    if(digibord && digibord.length == 6) {
      if(this.base) {
        this.base.reset();
        delete this.base;
      }

      this.base = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + digibord);
      this.postMessage();
    }

  }

  componentWillUnmount() {
    // CLEAN UP: Clear timer, set timer state to null
    clearTimeout(this.state.timer);
    this.hideMessage();
  }

  postMessage() {
    const object = this.props.data.object;

    if(!object || !this.base) {
      return;
    }

    this.ref = this.base.post('display/message', {
      data: object.state
    });
  }

  hideMessage() {
    this.setState({
      showMessage: false,
      timer: null
    });
  }

  render() {
    let state;
    if(this.props.data.object)
      state = this.props.data.object.state;

    let hideMessageClass = this.state.showMessage ? '' : ' hide-message';

    return <div className="icon">
      <div className="on"></div>
      <div className="off"></div>
      <div className={"message" + (state == undefined || state == '' ? ' empty' : ' set') + hideMessageClass}>
        <p>{state}</p>
      </div>
    </div>;
  }
}

export default BaseObject(Bericht, 'bericht');
