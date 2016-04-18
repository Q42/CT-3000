import React from 'react';

const lightCount = 48;

export default class LightsComponent extends React.Component {

  constructor(props) {
    super(props);

    // We're mapping our session lights to an array with specific locations.
    // When a session dissapears, other items should maintain their index in the
    // array. This.lights is a direct result of it's props, so we try to more
    // or less maintian our statelesnes.
    //
    // Ask @guidobouman if you have any questions.

    this.lights = new Array(lightCount).fill(null);
    this.nextLightIndex = 0;

    this.checkSessionLights(props);
  }

  componentWillReceiveProps(props) {
    this.checkSessionLights(props);
  }

  checkSessionLights(props) {
    const sessions = props.sessions;

    // Unassign left sessions from lights
    this.lights.forEach((sessionKey, key) => {
      if(sessionKey && !sessions[sessionKey]) {
        this.lights[key] = null;
      }
    });

    // Make sure all sessions are connected to a light position
    Object.keys(sessions).map(key => {
      if(this.lights.indexOf(key) < 0) {
        // TODO: Find the next empty item, not just modulus
        this.lights[this.nextLightIndex % lightCount] = key;
        this.nextLightIndex++;
      }
    });
  }

  render() {
    return(
      <div className="lights">
        { this.renderLights() }
      </div>
    );
  }

  renderLights() {
    const sessions = this.props.sessions;

    return this.lights.map((sessionKey, key) => {
      if(!sessionKey) {
        return <div className="placeholder" key={ key }></div>;
      }

      console.log(key, sessionKey);

      const session = sessions[sessionKey];
      let style = {};
      let borderColor = {};
      let beamClass = 'beam';

      if(typeof session.light === 'object'){
        style = {
          backgroundColor: 'rgb(' + session.light.r + ',' + session.light.g + ',' + session.light.b + ')'
        };
        borderColor = {
          borderColor: 'rgba(' + session.light.r + ',' + session.light.g + ',' + session.light.b + ',0.8)'
        }
      }
      else if(session.light === 'uit') {
        beamClass += ' light-off';
        borderColor = {
          borderColor: 'rgba(180,180,180,0.5)'
        }
      }

      const userName = session.name || '';
      const matches = userName.match(/\b(\w)/g);
      const acronym = (matches || []).slice(0,2).join('');

      return (
        <div className="container" key={ key }>
          <div className="light"><span className="name" style={ borderColor }>{ acronym }</span></div>
          <div className={ beamClass } style={ style } />
        </div>
      );
    });
  }
}
