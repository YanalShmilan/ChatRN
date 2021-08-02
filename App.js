import React from "react";
import { Provider } from "react-redux";
import store from "./store/index";
import RootNavigator from "./component/Navigation";
import { NavigationContainer } from "@react-navigation/native";

export default () => (
  <Provider store={store}>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  </Provider>
);
