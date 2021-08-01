import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import Signin from './component/auth/Signin';
import { Provider, useSelector } from 'react-redux';
import store from './store/index';
import RootNavigator from './component/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
export default () => (
  <Provider store={store}>
    <NativeBaseProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  </Provider>
);
