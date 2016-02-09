import React from 'react';
import BaseElement from './baseElement';
import { StaggeredMotion, spring, presets } from 'react-motion';

export default React.createClass ({
  getInitialState() {
    return { elements:[
      {name: "Lamp"},
      {name: "Deur"},
      {name: "Radio"},
      {name: "Toilet"},
      {name: "Fiets"},
      {name: "Broer"},
      {name: "Vader"},
      {name: "Douche"}

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
           ? { scale: spring(1), rotate: spring(0) }
           : { scale: spring(prevInterpolatedStyles[i-1].scale), rotate: spring(prevInterpolatedStyles[i-1].rotate) }
        })}>

        {interpolatingStyles =>
          <div className="status-bar">
          { interpolatingStyles.map((style, i)=>
            <div key={i} className={"base-element " + this.state.elements[i].name.toLowerCase()}
            style={{ transform: 'scale(' + style.scale + ') rotate(' + style.rotate + 'deg)'}}>
              {this.state.elements[i].name}
            </div>)
          }
          </div>
        }

      </StaggeredMotion>
    );
  }
});
