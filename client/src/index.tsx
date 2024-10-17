import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { Alert } from './widgets';
import { ShowRecipe, CreateRecipe, EditRecipe, ShoppingCart } from './recipe-components';
import { LoginPage, RegisterPage, UserPage } from './login-register-components';
import { FrontPage, Menu } from './frontPage-components';

ReactDOM.render(
  <HashRouter>
    <div>
      <Alert />
      <Menu />
      <Route exact path="/" component={FrontPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/:username" component={UserPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route exact path="/newrecipe/" component={CreateRecipe} />
      <Route exact path="/recipes/:id(\d+)" component={ShowRecipe} />
      <Route exact path="/recipes/:id/edit" component={EditRecipe} />
      <Route exact path="/:username/shoppingcart" component={ShoppingCart} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
