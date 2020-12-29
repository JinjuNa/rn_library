import React, { Component, useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigator/AppNavigator';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function ReduxComponent() {
  const dispatch = useDispatch();
  dispatch({ type: 'GET', name: 'URL' });
  const data = useSelector(state => state.data);

  // 로컬개발중
  return null;
}

export default () => {

  return (
    <Provider store={store}>
        <ReduxComponent />
        <NavigationContainer>
          <AppNavigator/>
        </NavigationContainer>
    </Provider>
  )
}