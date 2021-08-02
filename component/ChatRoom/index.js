import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Image, Clipboard, Share } from "react-native";
import {
  Text,
  View,
  TextField,
  Button,
  Colors,
  Constants,
  Spacings,
} from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import Icon from "react-native-vector-icons/FontAwesome";
import { deleteMessage } from "../../store/actions/chatActions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import instance from "../../store/actions/instance";

const ChatRoom = ({ route, socket }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  let chats = useSelector((state) => state.chats.chats);

  let room = chats.find((chat) => route.params.room._id === chat._id);
  const [input, setInput] = useState("");
  const { messages, _id } = room;
  useEffect(() => {
    if (socket) {
      socket.emit("roomSeen", { userId: user._id, roomId: _id });
    }
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.cancelled) {
      return;
    }
    let localUri = result.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    formData.append("file", { uri: localUri, name: filename, type });
    const res = await instance.post(`/api/v1/rooms/attachment`, formData);
    let content = {};
    content.text = "[image]";
    content.type = "image";
    content.url = res.data;
    socket.emit("chatMessage", {
      roomId: _id,
      content: content,
      userId: user.id,
    });

    // if (!result.cancelled) {
    //   setImage(result.uri);
    // }
  };

  const handleSubmitLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    let content = {};
    content.type = "location";
    content.text = "[location]";
    content.latitude = location.coords.latitude;
    content.longitude = location.coords.longitude;
    socket.emit("chatMessage", {
      roomId: _id,
      content: content,
      userId: user.id,
    });
  };

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
          let seenBy = message.receivers.filter(
            (receiver) => receiver.seen !== null
          );

          // Check who recived the message from receivers
          let receivedBy = message.receivers.filter(
            (receiver) => receiver.received !== null
          );
          let seenStatus = <></>;
          if (!isLeftBubble) {
            if (seenBy.length === message.receivers.length) {
              seenStatus = (
                <Text dark10 text70 style={{ alignSelf: "flex-end" }}>
                  <Icon name="check-circle" size={15} color={"#00FF00"} />
                </Text>
              );
            } else if (receivedBy.length !== 0) {
              seenStatus = (
                <Text dark10 text70 style={{ alignSelf: "flex-end" }}>
                  <Icon name="check-circle" size={15} color={"#ffffff"} />
                </Text>
              );
            } else {
              seenStatus = (
                <Text dark10 text70 style={{ alignSelf: "flex-end" }}>
                  <Icon name="check-circle-o" size={15} color={"#ffffff"} />
                </Text>
              );
            }
          }
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
          } else if (type === "location") {
            text = (
              <Image
                style={{ width: 200, height: 200 }}
                source={{
                  uri: `https://maps.googleapis.com/maps/api/staticmap?zoom=14&size=400x200&maptype=roadmap&markers=color:red%7C${message.content.latitude},${message.content.longitude}&key=AIzaSyB8HneuExnTiRIBHmBMNsoJP33ymZg2mg4`,
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
                <Menu>
                  <MenuTrigger>
                    <Text dark10 text70 style={{ alignSelf: "flex-end" }}>
                      <Icon
                        name="angle-down"
                        size={20}
                        color={!isLeftBubble ? "#ffffff" : "#333"}
                      />
                    </Text>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption
                      onSelect={() => Clipboard.setString(message.content.text)}
                      text="Copy"
                    />
                    <MenuOption
                      onSelect={() =>
                        Share.share({
                          message: message.content.text,
                        })
                      }
                      text="Share"
                    />

                    <MenuOption
                      onSelect={() =>
                        dispatch(deleteMessage(user._id, message._id, _id))
                      }
                    >
                      <Text style={{ color: "red" }}>Delete</Text>
                    </MenuOption>
                    {!isLeftBubble && (
                      <MenuOption
                        onSelect={() =>
                          socket.emit("messageUpdate", {
                            messageId: message._id,
                            content: { text: "[deleted]", type: "deleted" },
                          })
                        }
                      >
                        <Text style={{ color: "red" }}>Delete for all</Text>
                      </MenuOption>
                    )}
                  </MenuOptions>
                </Menu>
                {text}
                {seenStatus}
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <MenuProvider>
      <View flex bg-dark80 paddingT-page>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          ref={(ref) => {
            scrollView = ref;
          }}
          onContentSizeChange={() => scrollView.scrollToEnd({ animated: true })}
        >
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
            onEndEditing={handleSubmit}
            returnKeyType={"send"}
          />
          <Button link marginL-s4 onPress={pickImage}>
            <Icon name="image" size={15} color={"#333"} />
          </Button>
          <Button link marginL-s4 onPress={handleSubmitLocation}>
            <Icon name="location-arrow" size={15} color={"#333"} />
          </Button>
        </View>
      </View>
    </MenuProvider>
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
