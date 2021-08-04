import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//Styling
import { StyleSheet, Alert, FlatList } from "react-native"; //Remove unused import
import * as Animatable from "react-native-animatable";
import nophoto from "../../assets/no-photo.png";
import {
  AnimatableManager,
  Colors,
  BorderRadiuses,
  ListItem,
  Text,
} from "react-native-ui-lib"; //eslint-disable-line

//Actions
import {
  addMessage,
  fetchRoom,
  readMessage,
  seeMessage,
  updateMessage,
} from "../../store/actions/chatActions";

const Chat = ({ navigation, socket }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  let chats = useSelector((state) => state.chats.chats);
  let user = useSelector((state) => state.user.user);

  if (chats && socket && loading === false) {
    setLoading(true);
  }

  useEffect(() => {
    if (socket) {
      socket.emit("startSession", { userId: user._id });
      socket.off("messageUpdate");
      socket.off("roomSeen");
      socket.off("messageRead");
      socket.off("message");

      socket.on("messageUpdate", ({ roomId, newMessage }) => {
        dispatch(updateMessage(roomId, newMessage));
      });

      socket.on("roomSeen", ({ userId, roomId, time }) => {
        dispatch(seeMessage(roomId, userId, time));
      });

      socket.on("messageRead", ({ userId, roomIds, time }) => {
        dispatch(readMessage(roomIds, userId, time));
      });

      socket.on("message", (message) => {
        if (chats.find((chat) => chat._id === message.roomId))
          dispatch(addMessage(message.roomId, message.content));
        else dispatch(fetchRoom(user._id));
      });
    }
  }, [loading]);

  if (!chats || !user) return <></>;

  chats.sort((a, b) => {
    // if no messages in both rooms then order by room creation
    if (
      !a.messages[a.messages.length - 1] &&
      !b.messages[b.messages.length - 1]
    )
      return a.createdAt > b.createdAt ? -1 : 1;
    // if room a have no messages compare room a creation with last message from b
    if (!a.messages[a.messages.length - 1])
      return a.createdAt > b.messages[b.messages.length - 1].createdAt ? -1 : 1;
    // if room b have no messages compare room b creation with last message from a
    if (!b.messages[b.messages.length - 1])
      return a.messages[a.messages.length - 1].createdAt > b.createdAt ? -1 : 1;
    // compare last messages from both rooms
    return a.messages[a.messages.length - 1].createdAt >
      b.messages[b.messages.length - 1].createdAt
      ? -1
      : 1;
  });

  chats = chats.map((chat) => {
    let notSeenCount = chat.messages
      .map((message) => {
        let thisCount = message.receivers.filter((receiver) => {
          if (receiver.seen === null && receiver._id == user._id) return true;
          return false;
        });
        return thisCount.length;
      })
      .filter((a) => a).length;

    return {
      room: chat,
      name: chat.name,
      photo: chat.photo,
      lastMessage:
        chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : "",
      notSeenCount,
    };
  });

  const renderRow = (row, id) => {
    const animationProps = AnimatableManager.presets.fadeInRight;
    const imageAnimationProps = AnimatableManager.getRandomDelay();

    return (
      <Animatable.View {...animationProps}>
        <ListItem
          activeBackgroundColor={Colors.dark60}
          activeOpacity={0.3}
          height={77.5}
          onPress={() =>
            navigation.navigate("Detail", {
              room: row.room,
            })
          }
        >
          <ListItem.Part left>
            <Animatable.Image
              source={
                row.photo === "no-photo.jpg" ? nophoto : { uri: row.photo }
              }
              style={styles.image}
              {...imageAnimationProps}
            />
          </ListItem.Part>
          {/**Remove inline styling */}
          <ListItem.Part
            middle
            column
            containerStyle={[styles.border, { paddingRight: 17 }]}
          >
            <ListItem.Part containerStyle={{ marginBottom: 3 }}>
              <Text
                dark10
                text70
                style={{ flex: 1, marginRight: 10 }}
                numberOfLines={1}
              >
                {row.name}
              </Text>
              {row.notSeenCount > 0 && (
                <Text dark10 text70 style={{ marginTop: 2 }}>
                  {row.notSeenCount}
                </Text>
              )}
            </ListItem.Part>
            <ListItem.Part>
              <Text
                style={{ flex: 1, marginRight: 10 }}
                text90
                dark40
                numberOfLines={1}
              >
                {row.lastMessage
                  ? row.lastMessage.content
                    ? row.lastMessage.content.text
                    : ""
                  : ""}
              </Text>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      </Animatable.View>
    );
  };
  return (
    <FlatList
      data={chats}
      renderItem={({ item, index }) => renderRow(item, index)}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 14,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.dark70,
  },
});

export default Chat;
