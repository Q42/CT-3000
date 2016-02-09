import React from 'react';
import BaseElement from './baseElement.js';
import { spring, presets } from 'react-motion';

export default React.createClass ({
  getInitialState() {
    return {
      items: Array.from(Array(8).keys())
    }
  },

  getDefaults() {
    let obj = {};
    this.state.items.forEach(key =>{
      obj[key] = {
        val: {
          rotate: -360,
          scale: 0
        }
      }
    });
    return obj;
  },

  getEnds() {
    let obj = {};
    this.state.items.forEach(key =>{
      obj[key] = {
        val: {
          rotate: 0,
          scale: 1
        }
      }
    });
    return obj;
  },

  render() {
    return(
        <spring
          defaultValue={this.getDefaults()}
          endValues={this.getEnds()}>
          <div className="status-bar">
            {this.state.items.map(key => {
              return <BaseElement key={key}>{key}</BaseElement>
            })}
          </div>
        </spring>
    );
  }
});
