import './assets/style/main.less';

import React from 'react';
import { render } from 'react-dom';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

// Polyfill default objects with ES6-like prototype methods
import Polyfill from 'babel-polyfill';

import LandingPageComponent from './components/landing-page';
import EditorComponent from './components/editor';
import ViewerComponent from './components/viewer';

render((
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ LandingPageComponent } />
      <Route exact path="/:language/tool" component={ EditorComponent } />
      <Route path="/:language/tool/:template" component={ EditorComponent } />
      <Route exact path="/:language/digibord" render={({ match }) => 
        <Redirect to={ `/${match.params.language}/digibord/${generateId()}` }/>
      } />
      <Route path="/:language/digibord/:digibordId" component={ ViewerComponent } />
    </Switch>
  </BrowserRouter>
), document.getElementById('container'));

function generateId() {
  const num = Math.floor(Math.random() * 1000000).toString();
  const pad = '000000';
  return pad.slice(num.length) + num;
}
