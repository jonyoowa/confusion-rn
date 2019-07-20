import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
