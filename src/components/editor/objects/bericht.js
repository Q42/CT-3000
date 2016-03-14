import React from 'react';
import { BaseObject } from './_baseObject';
import Rebase from 're-base';
import InlineSVG from 'svg-inline-react';

import svg from '!svg-inline!../../../assets/svg/sending.svg';

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
      this.previewMessage();

      // And do nothing more IF Object is in preview pane
      return;
    }

    const message = this.props.data.object.state;
    if(message === this.prevState) {
      return;
    }
    this.prevState = message;

    if(!message) {
      return;
    }

    const digibord = this.props.data.digibord.state;
    if(!digibord || digibord.length !== 6) {
      return;
    }

    this.connectFirebase(digibord);

    const groupName = this.props.data.naam.state;
    this.postMessage(message, groupName);
  }

  componentWillUnmount() {
    // CLEAN UP: Clear timer, set timer state to null
    clearTimeout(this.state.timer);
    this.hideMessage();
  }

  connectFirebase(classId) {
    if(this.fireBase) {
      this.fireBase.reset();
      delete this.fireBase;
    }

    this.fireBase = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + classId);
  }

  postMessage(message, groupName) {
    if(!message || !groupName || !this.fireBase) {
      return;
    }

    const data = { message, groupName };

    if(!this.messageRef) {
      this.messageRef = this.fireBase.push('display/messages', { data });
      this.setRefTimeout();
      return;
    }

    clearTimeout(this.refTimeout);
    this.messageRef.set(data);
    this.setRefTimeout();
  }

  setRefTimeout() {
    this.refTimeout = setTimeout(() => this.messageRef = undefined, 4242);
  }

  previewMessage() {
    if(this.props.data.object.state != this.prevState) {
      this.prevState = this.props.data.object.state;

      clearTimeout(this.state.timer);
      this.setState({
        showMessage: true,
        timer: setTimeout(this.hideMessage, 4242)
      });
    }
  }

  hideMessage() {
    this.setState({
      showMessage: false,
      timer: null
    });
  }

  render() {
    const object = this.props.data.object.state;
    const digibord = this.props.data.digibord.state;

    let classes = 'icon';
    if(digibord  && digibord.length === 6) {
      classes += ' on-digiboard';
    }

    let hideMessageClass = this.state.showMessage ? '' : ' hide-message';

    return <div className={ classes }>
      <div className="on">
        <div className="connected"><InlineSVG src={ svg } /></div>
      </div>
      <div className="off"></div>
      <div className={ 'message' + (!object ? ' empty' : ' set') + hideMessageClass }>
        <p>{ object }</p>
        <div className="connected"><InlineSVG src={ svg } /></div>
      </div>
    </div>;
  }
}

export default BaseObject(Bericht, 'bericht');
