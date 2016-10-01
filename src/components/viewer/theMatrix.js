import React from 'react';

export default class TheMatrixComponent extends React.Component {
  constructor(props) {
    super(props);

    // Don't use state here for the matrix, it's not performant enough for
    // absurdly frequent updates like these.
    //
    // Ask @guidobouman if you have any questions.

    this.matrixText = '';
  }

  componentDidMount() {
    this.matrixInterval = setInterval(() => {
      this.theMatrix();
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.matrixInterval);
  }

  theMatrix() {
    const matrixLength = 225;

    let matrix = this.matrixText + '' + Math.round(Math.random());
    if(matrix.length > matrixLength){
      matrix = matrix.substring(matrix.length - matrixLength)
    }

    this.matrixText = matrix;
    this.refs.matrix.innerHTML = matrix;
  }

  render() {
    return(
      <div ref="matrix" className="the-matrix"/>
    );
  }
}
