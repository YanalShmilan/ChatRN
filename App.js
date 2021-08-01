import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import Signin from "./component/auth/Signin";
import { Provider, useSelector } from "react-redux";
import store from "./store/index";
import RootNavigator from "./component/Navigation";
import { NavigationContainer } from "@react-navigation/native";

export default () => (
  <Provider store={store}>
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ApplicationProvider>
  </Provider>
);
