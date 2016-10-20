import './assets/style/main.less';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory, browserHistory } from 'react-router';

// Polyfill default objects with ES6-like prototype methods
import Polyfill from 'babel-polyfill';

import LandingPageComponent from './components/landing-page';
import EditorComponent from './components/editor';
import ViewerComponent from './components/viewer';

const App = React.createClass({
  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
});

render((
  <Router history={ browserHistory }>
    <Route path="/" component={App}>
      <IndexRoute component={ LandingPageComponent } />
      <Route path=":language/tool" component={ EditorComponent } />
      <Route path=":language/digibord" component={ ViewerComponent } />
      <Route path=":language/digibord/:digibordId" component={ ViewerComponent } />
    </Route>
  </Router>
), document.getElementById('container'));
