import React from 'react';
import { StaggeredMotion, spring, presets } from 'react-motion';

import * as Objects from './objects/_index';

const springSetting1 = {stiffness: 172, damping: 18};
//const springSetting2 = {stiffness: 120, damping: 17};

export default React.createClass ({
  getInitialState() {
    const elements = Object.keys(Objects).map((key) => {
      return { name: key }
    });
    const time = 0;
    return { elements, time }
  },

  componentDidMount() {
    setTimeout( this.handleTimeout, 1000 );
  },

  handleTimeout() {
    this.setState({
        time: 1
    });
  },


  getDefaultStyles() {
    var o = [];
    this.state.elements.forEach(key => {
      o.push({ x:300, scale: 0.5, rotate: -360 });
    })
    return o;
  },

  render() {
     return(
      this.state.time === 0
      ? null
      : <StaggeredMotion
        defaultStyles={this.getDefaultStyles()}
        styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
          return i === 0
           ? { x: spring(0, springSetting1), scale: spring(1, springSetting1), rotate: spring(0, springSetting1) }
           : { x: spring(prevInterpolatedStyles[i-1].x, springSetting1), scale: spring(prevInterpolatedStyles[i-1].scale, springSetting1), rotate: spring(prevInterpolatedStyles[i-1].rotate, springSetting1) }
        })}>

        {interpolatingStyles =>
          <div className="status-bar">
            { interpolatingStyles.map((style, i) => {
              const ObjectInstance = Objects[this.state.elements[i].name];
              return <ObjectInstance key={i} style={{ transform: 'scale(' + style.scale + ') translateY(' + style.x + 'px)'}} />
            })}
          </div>
        }
      </StaggeredMotion>
    );
  }
});
