/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducers from './src/store/reducers/index';
import HomeComponent from './src/pages/HomeComponent';
import Database from './database';

let store = createStore(reducers, applyMiddleware(thunk));

class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <HomeComponent />
      </Provider>
    )
  }
}

export default App;
