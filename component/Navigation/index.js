import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { io } from "socket.io-client";

//Components
import Chat from "../Chat";
import Signin from "../auth/Signin";
import ChatRoom from "../ChatRoom";

const { Navigator, Screen } = createStackNavigator();

const RootNavigator = () => {
  let user = useSelector((state) => state.user.user);

  const [socket, setSocket] = useState(false);

  useEffect(() => {
    setSocket(io("http://192.168.2.168:8000"));
  }, []);

  return (
    <>
      {user ? (
        <Navigator initialRouteName="Home">
          <Screen
            name="Home"
            children={({ navigation }) => (
              <Chat navigation={navigation} socket={socket} />
            )}
            //Remove unused code
            options={({ route, navigation }) => ({
              title: "Whatsapp",
              headerRight: () => <></>,
            })}
          />
          <Screen
            name="Detail"
            children={({ route }) => <ChatRoom route={route} socket={socket} />}
            //Remove unused code
            options={({ route, navigation }) => ({
              title: route.params.room.name,
              //headerRight: () => <CartButton navigation={navigation} />,
            })}
          />
        </Navigator>
      ) : (
        <Signin />
      )}
    </>
  );
};

export default RootNavigator;
