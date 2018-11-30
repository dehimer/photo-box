import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Gallery from 'components/Gallery';
import Viewer from 'components/Viewer';


export default () => (
  <div>
    <Switch>
      <Route exact path="/" component={Gallery} />
      <Route exact path="/view" component={Viewer} />
    </Switch>
  </div>
);
