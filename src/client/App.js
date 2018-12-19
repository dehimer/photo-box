import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Gallery from './components/Gallery/index';
import Viewer from './components/Viewer/index';

export default () => (
  <div>
    <Switch>
      <Route exact path="/" component={Gallery} />
      <Route path="/view/:id" component={Viewer} />
    </Switch>
  </div>
);
