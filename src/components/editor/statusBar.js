import React from 'react';
import BaseElement from './baseElement';
import { StaggeredMotion, spring, presets } from 'react-motion';

const springSetting1 = {stiffness: 172, damping: 15};
const springSetting2 = {stiffness: 120, damping: 17};

export default React.createClass ({
  getInitialState() {
    return { elements:[
      {name: "Lamp"},
      {name: "Deur"},
      {name: "Radio"},
      {name: "Toilet"},
      {name: "Fiets"},
      {name: "Broer"},
      {name: "Telefoon"},
      {name: "Plant"}

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
          { interpolatingStyles.map((style, i)=>
            <div key={i} className="element" style={{ transform: 'scale(' + style.scale + ') rotate(' + style.rotate + 'deg)'}}>
              <BaseElement name={this.state.elements[i].name} />
            </div>)
          }
          </div>
        }

      </StaggeredMotion>
    );
  }
});
