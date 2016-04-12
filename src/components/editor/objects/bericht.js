import React from 'react';
import BaseObject from './_baseObject';
import Rebase from 're-base';
import InlineSVG from 'svg-inline-react';

import svg from '!svg-inline!../../../assets/svg/sending.svg';

const springSetting1 = {stiffness: 164, damping: 10};

class Bericht extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: {},
      showMessage: true
    };

    this.hideMessage = this.hideMessage.bind(this);
  }

  componentDidMount() {
    if(!this.props.main) {
      return;
    }
  }

  componentDidUpdate() {
    if(!this.props.main) {
      // IF Object is in preview pane show message for some seconds
      // unless content is being updated
      this.previewMessage();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.hideMessage();
  }

  previewMessage() {
    if(this.props.data.object.state === this.prevState) {
      return;
    }

    this.prevState = this.props.data.object.state;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.hideMessage, 4242);

    this.setState({
      showMessage: true,
    });
  }

  hideMessage() {
    this.setState({
      showMessage: false
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
