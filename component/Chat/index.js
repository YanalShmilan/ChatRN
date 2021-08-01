import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import ContactItem from './ContactItem';
import { Button, Icon, List, ListItem } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
const Chat = () => {
  let chats = useSelector((state) => state.chats.chats);

  if (!chats) {
    return <></>;
  }
  let channels = useSelector((state) => state.chats.channels);
  let user = useSelector((state) => state.user.user);
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
  channels = channels.map((channel) => {
    return (
      <></>
      // <ContactItem
      //   room={channel}
      //   name={channel.name}
      //   photo={channel.photo}
      //   lastMessage={channel.messages[channel.messages.length - 1]}
      //   setRoomId={setRoomId}
      // />
    );
  });
  let notSeenRoom = null;
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
    if (!notSeenRoom && notSeenCount === 0) {
      notSeenRoom = true;
      // setRoomId(chat._id);
    }
    // if (notSeenRoom) return;
    return (
      <ListItem
        title={'chatnae'}
        description={`desc`}
        accessoryLeft={'photo'}
        accessoryRight={'mute'}
      />
      // <ContactItem
      //   room={chat}
      //   name={chat.name}
      //   photo={chat.photo}
      //   lastMessage={
      //     chat.messages.length > 0
      //       ? chat.messages[chat.messages.length - 1]
      //       : ''
      //   }
      //   setRoomId={setRoomId}
      //   notSeenCount={notSeenCount}
      // />
    );
  });
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <List
        style={styles.container}
        data={chats}
        // renderItem={renderItem}
      />
    </Layout>
  );
};
export default Chat;
const styles = StyleSheet.create({
  container: {
    maxHeight: 192,
  },
});
