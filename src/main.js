import './assets/style/main.less';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import PolyFill from 'babel-polyfill';

import LandingPageComponent from './components/landing-page';
import EditorComponent from './components/editor';
import ViewerComponent from './components/viewer';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

const App = React.createClass({
  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
});

render((
  <Router history={ appHistory }>
    <Route path="/" component={App}>
      <IndexRoute component={ LandingPageComponent } />
      <Route path="tool" component={ EditorComponent } />
      <Route path="digibord" component={ ViewerComponent } />
    </Route>
  </Router>
), document.getElementById('container'));
