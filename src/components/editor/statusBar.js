import React from 'react';
import { StaggeredMotion, spring, presets } from 'react-motion';

import * as Objects from './objects/_index';

const springSetting1 = {stiffness: 168, damping: 18};

export default React.createClass ({
  getInitialState() {
    const elements = Object.keys(Objects).map((key) => {
      return { name: key, status: false };
    });
    const stroom = false;
    return { elements, stroom };
  },

  setStroomAan(){
    this.setState({
      stroom: true
    });
  },

  componentDidMount() {
    setTimeout(this.setStroomAan, 1000);
  },

  getDefaultStyles() {
    var o = [];
    this.state.elements.forEach(key => {
      o.push({ x:300, scale: 0.5 });
    });
    return o;
  },

  render() {
    let pos = this.state.stroom ? 0 : 300;
    let size = this.state.stroom ? 1 : 0.5;

    return(
      <div className="status-bar">
        <StaggeredMotion
          defaultStyles={this.getDefaultStyles()}
          styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
            return i === 0
             ? { x: spring(pos, springSetting1), scale: spring(size, springSetting1)}
             : { x: spring(prevInterpolatedStyles[i-1].x, springSetting1), scale: spring(prevInterpolatedStyles[i-1].scale, springSetting1) }
          })}>

          {interpolatingStyles =>
            <div className="elements">
              { interpolatingStyles.map((style, i) => {
                const ObjectInstance = Objects[this.state.elements[i].name];
                return (
                  <div key={i} style={{ transform: 'scale(' + style.scale + ') translateY(' + style.x + 'px)'}} >
                    <ObjectInstance main={ true } />
                  </div>);
              })}
            </div>
          }
        </StaggeredMotion>
      </div>
    );
  }
});
