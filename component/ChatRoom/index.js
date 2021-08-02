import React, { PureComponent, useState } from "react";
import { ScrollView, StyleSheet, Image } from "react-native";
import {
  PermissionsAndroid,
  Text,
  View,
  TextField,
  Button,
  Colors,
  Constants,
  Spacings,
} from "react-native-ui-lib";
import { useSelector } from "react-redux";
import { WebView } from "react-native-webview";

const ChatRoom = ({ route, socket }) => {
  const user = useSelector((state) => state.user.user);
  let chats = useSelector((state) => state.chats.chats);
  let room = chats.find((chat) => route.params.room._id === chat._id);
  const [input, setInput] = useState("");
  const { messages, _id } = room;
  const handleSubmit = () => {
    if (input === "") return;
    let content = {};
    content.text = input;
    content.type = "string";
    socket.emit("chatMessage", {
      roomId: _id,
      content: content,
      userId: user.id,
    });
    setInput("");
  };
  const renderChatBubbles = () => {
    return (
      <View flex>
        {messages.map((message) => {
          const isLeftBubble = user._id !== message.user._id;
          let type = message.content.type;
          let text;

          if (type === "image") {
            text = (
              <Image
                style={{ width: 200, height: 200 }}
                source={{
                  uri: message.content.url.replace(
                    "localhost",
                    "192.168.2.168"
                  ),
                }}
              />
            );
          } else if (type === "giphy") {
            text = (
              <Image
                style={{ width: 200, height: 200 }}
                source={{
                  uri:
                    "https://media.giphy.com/media/" +
                    message.content.url.replace(
                      "https://giphy.com/embed/",
                      ""
                    ) +
                    "/giphy.gif".replace("localhost", "192.168.2.168"),
                }}
              />
            );
          } else {
            text = (
              <Text
                selectable
                white={!isLeftBubble}
                grey10={isLeftBubble}
                text80
              >
                {message.content.text}
              </Text>
            );
          }
          return (
            <View right={!isLeftBubble}>
              <View
                bg-blue40={!isLeftBubble}
                bg-white={isLeftBubble}
                br20
                marginB-s4
                padding-s2
                width={"70%"}
              >
                {text}
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <View flex bg-dark80 paddingT-page>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderChatBubbles()}
      </ScrollView>
      <View bg-white row spread centerV paddingH-s5 paddingV-s3>
        <TextField
          containerStyle={{
            flex: 1,
            backgroundColor: Colors.grey60,
            paddingVertical: Spacings.s2,
            paddingHorizontal: Spacings.s4,
            borderRadius: 8,
          }}
          value={input}
          onChangeText={setInput}
          hideUnderline
          placeholder={"Message"}
          floatingPlaceholder={false}
          floatOnFocus
          enableErrors={false}
        />
        <Button onPress={handleSubmit} label="Send" link marginL-s4 />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: Spacings.s5,
  },
  image: {
    height: 250,
    marginBottom: Spacings.s3,
  },
  trackingToolbarContainer: {
    position: Constants.isIOS ? "absolute" : "relative",
    bottom: 0,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.dark60,
  },
});

export default ChatRoom;
