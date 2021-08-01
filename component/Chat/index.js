import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import ContactItem from './ContactItem';
import { StyleSheet } from 'react-native';
import { List, Heading, Box, Text, Image } from 'native-base';

const Chat = () => {
  let chats = useSelector((state) => state.chats.chats);
  let channels = useSelector((state) => state.chats.channels);
  let user = useSelector((state) => state.user.user);

  if (!chats) {
    return <></>;
  }
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
    //if (notSeenRoom) return;
    return (
      // list item
      <List.Item>
        {chat.photo !== 'no-photo.jpg' ? (
          <Image
            size={50}
            resizeMode={'contain'}
            borderRadius={100}
            source={{
              uri: chat.photo,
            }}
            alt="Alternate Text"
          />
        ) : (
          <Image
            size={50}
            resizeMode={'contain'}
            borderRadius={100}
            source={{
              uri: 'https://icon-library.com/images/no-photo-available-icon/no-photo-available-icon-20.jpg',
            }}
            alt="Alternate Text"
          />
        )}
        <Text>
          {chat.name} {'\n'}
          {'\n'}
        </Text>
        {chat.messages.length > 0 ? (
          <Text>
            {'\n'}
            {chat.messages[chat.messages.length - 1].content.text}
          </Text>
        ) : (
          <Text></Text>
        )}
      </List.Item>
    );
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
  });
  return (
    <>
      <Text>Chats</Text>
      <Box w="80%">
        <Heading fontSize={24}>Topics (Plain List)</Heading>
        <List space={2} my={2}>
          {chats}
        </List>
      </Box>
    </>
  );
};
export default Chat;
