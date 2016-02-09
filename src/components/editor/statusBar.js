import React from 'react';
import { StaggeredMotion, spring, presets } from 'react-motion';

import * as Objects from './objects/index';

const springSetting1 = {stiffness: 172, damping: 15};
const springSetting2 = {stiffness: 120, damping: 17};

export default React.createClass ({
  getInitialState() {
    return { elements:[
      {name: 'Lamp'},
      {name: 'Radio'}
    ]}
  },

  getDefaultStyles() {
    var o = [];
    this.state.elements.forEach(key => {
      o.push({ scale: 0, rotate: -360 });
    })
    console.log(o);
    return o;
  },

  render() {
     return(
      <StaggeredMotion
        defaultStyles={this.getDefaultStyles()}
        styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
          return i === 0
           ? { scale: spring(1, springSetting1), rotate: spring(0, springSetting1) }
           : { scale: spring(prevInterpolatedStyles[i-1].scale, springSetting1), rotate: spring(prevInterpolatedStyles[i-1].rotate, springSetting1) }
        })}>

        {interpolatingStyles =>
          <div className="status-bar">
            { interpolatingStyles.map((style, i) => {
              const ObjectInstance = Objects[this.state.elements[i].name];

              return (<div key={i} className="element" style={{ transform: 'scale(' + style.scale + ') rotate(' + style.rotate + 'deg)'}}>
                <ObjectInstance />
              </div>)
            })}
          </div>
        }
      </StaggeredMotion>
    );
  }
});
