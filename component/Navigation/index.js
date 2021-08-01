import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import Chat from "../Chat";
import Signin from "../auth/Signin";

const { Navigator, Screen } = createStackNavigator();
const RootNavigator = () => {
  let user = useSelector((state) => state.user.user);

  return (
    <>
      {user ? (
        <Navigator
          initialRouteName="Home"
          screenOptions={{ headerTransparent: true }}
        >
          <Screen
            name="Home"
            component={Chat}
            options={({ route, navigation }) => ({
              title: "Whatsapp",
              headerRight: () => <></>,
            })}
          />
          {/* <Screen
            name="Detail"
            component={ProductList}
            options={({ route, navigation }) => ({
              title: route.params.category.name,
              headerRight: () => <CartButton navigation={navigation} />,
            })}
          /> */}
        </Navigator>
      ) : (
        <Signin />
      )}
    </>
  );
};
export default RootNavigator;
