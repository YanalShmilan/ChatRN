import * as actionTypes from "../actions/types";
const initialState = {
  chats: null,
  channels: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ROOM: {
      return {
        ...state,
        chats: action.payload,
      };
    }
    case actionTypes.CREATE_ROOM: {
      let roomExist = state.chats.find(
        (chat) => chat._id === action.payload._id
      );
      if (roomExist) {
        return state;
      }
      return {
        ...state,
        chats: [...state.chats, { ...action.payload, messages: [] }],
      };
    }
    case actionTypes.ADD_MESSAGE: {
      let newChatAfterMessage = state.chats.map((chat) => {
        if (action.payload.roomId === chat._id) {
          const thisMessage = chat.messages.find(
            (message) => message._id === action.payload.content._id
          );
          if (!thisMessage) {
            return {
              ...chat,
              messages: [...chat.messages, action.payload.content],
            };
          }
        }
        return chat;
      });
      return {
        ...state,
        chats: newChatAfterMessage,
      };
    }
    case actionTypes.FETCH_CHANNELS: {
      return {
        ...state,
        channels: action.payload,
      };
    }
    case actionTypes.SEEN_MESSAGE: {
      let seenRoom = state.chats.find(
        (chat) => action.payload.roomId === chat._id
      );

      seenRoom = seenRoom.messages.map((message) => {
        message.receivers = message.receivers.map((receiver) => {
          if (
            receiver._id === action.payload.userId &&
            receiver.seen === null
          ) {
            receiver.seen = action.payload.time;
          }
          return receiver;
        });
        return message;
      });
      return {
        ...state,
        chats: state.chats.map((chat) =>
          seenRoom._id === chat.id ? seenRoom : chat
        ),
      };
    }
    case actionTypes.READ_MESSAGE: {
      let readRooms = state.chats.map((chat) => {
        if (action.payload.roomIds.includes(chat._id)) {
          chat.messages = chat.messages.map((message) => {
            message.receivers = message.receivers.map((receiver) => {
              if (
                receiver._id === action.payload.userId &&
                receiver.received === null
              ) {
                receiver.received = action.payload.time;
              }
              return receiver;
            });
            return message;
          });
        }
        return chat;
      });
      return {
        ...state,
        chats: readRooms,
      };
    }
    case actionTypes.UPDATE_MESSAGE: {
      let updatedRoom = state.chats.find(
        (chat) => action.payload.roomId === chat._id
      );
      updatedRoom.messages = updatedRoom.messages.map((message) => {
        if (message._id === action.payload.newMessage._id) {
          return action.payload.newMessage;
        }
        return message;
      });
      console.log(updatedRoom.messages);
      return {
        ...state,
        chats: state.chats.map((chat) =>
          action.payload.roomId === chat._id ? updatedRoom : chat
        ),
      };
    }
    case actionTypes.DELETE_MESSAGE: {
      let deletedFromRoom = state.chats.find(
        (chat) => action.payload.roomId === chat._id
      );
      deletedFromRoom.messages = deletedFromRoom.messages.filter(
        (message) => message._id !== action.payload.messageId
      );
      return {
        ...state,
        chats: state.chats.map((chat) =>
          action.payload.roomId === chat._id ? deletedFromRoom : chat
        ),
      };
    }
    default:
      return state;
  }
};

export default reducer;
