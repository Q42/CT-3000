import React from 'react';

export let BaseObject = (ComposedComponent, type) => class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }
  componentDidMount() {
    this.setState({ data: 'Hello' });
  }
  render() {
    const classNames = 'object ' + type;
    return (
      <div className={classNames}>
        <ComposedComponent {...this.props} data={this.state.data} />
      </div>
    );
  }
};
