import * as actionTypes from "./types";
import instance from "./instance";

export const addMessage = (roomId, content) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.ADD_MESSAGE,
        payload: { roomId, content },
      });
    } catch (error) {
      console.log(error);
    }
  };
};
export const seeMessage = (roomId, userId, time) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.SEEN_MESSAGE,
        payload: { roomId, userId, time },
      });
    } catch (error) {
      console.log(error);
    }
  };
};
export const readMessage = (roomIds, userId, time) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.READ_MESSAGE,
        payload: { roomIds, userId, time },
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateMessage = (roomId, newMessage) => {
  return async (dispatch) => {
    try {
      console.log();
      dispatch({
        type: actionTypes.UPDATE_MESSAGE,
        payload: { roomId, newMessage },
      });
    } catch (error) {
      console.log(error);
    }
  };
};
export const deleteMessage = (userId, messageId, roomId) => {
  return async (dispatch) => {
    try {
      await instance.get(`/api/v1/rooms/user/${userId}/delete/${messageId}`);
      dispatch({
        type: actionTypes.DELETE_MESSAGE,
        payload: { roomId, messageId },
      });
    } catch (error) {
      console.log(error);
    }
  };
};
export const createRoom = (room, userId) => {
  return async (dispatch) => {
    try {
      if (room.type !== "Private") {
        room.admin = userId;
      }
      const formData = new FormData();
      for (const key in room) formData.append(key, room[key]);

      const res = await instance.post(`/api/v1/rooms/user/${userId}`, formData);
      let thisRoom = res.data;
      if (thisRoom.type === "Private") {
        let otherUser = thisRoom.users.find((user) => user._id !== userId);
        if (otherUser.userName === "") thisRoom.name = otherUser.phoneNumber;
        else thisRoom.name = otherUser.userName;
        thisRoom.photo = otherUser.photo;
      }
      dispatch({
        type: actionTypes.CREATE_ROOM,
        payload: thisRoom,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateRoom = (roomId, roomInfo) => {
  return async (dispatch) => {
    try {
      console.log(roomInfo);
      const formData = new FormData();
      for (const key in roomInfo) formData.append(key, roomInfo[key]);

      const res = await instance.put(`/api/v1/rooms/${roomId}`, formData);
      dispatch({
        type: actionTypes.UPDATE_ROOM,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const removeUserFromGroup = (roomId, phoneNumber) => {
  return async (dispatch) => {
    try {
      const userToRemove = {
        to: phoneNumber,
      };
      console.log(roomId);
      const res = await instance.post(
        `/api/v1/rooms/${roomId}/remove`,
        userToRemove
      );
      dispatch({
        type: actionTypes.REMOVE_USER_FROM_GROUP,
        payload: phoneNumber,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addUserToGroup = (roomId, phoneNumber) => {
  return async (dispatch) => {
    try {
      const userToAdd = {
        to: phoneNumber,
      };
      console.log(roomId);
      const res = await instance.post(`/api/v1/rooms/${roomId}/add`, userToAdd);
      dispatch({
        type: actionTypes.ADD_USER_TO_GROUP,
        payload: phoneNumber,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchRoom = (userId) => {
  return async (dispatch) => {
    try {
      const res = await instance.get(`api/v1/rooms/user/${userId}`);
      let rooms = res.data.map((room) => {
        if (room.type === "Private") {
          let otherUser = room.users.find((user) => user._id !== userId);
          if (otherUser.userName === "") room.name = otherUser.phoneNumber;
          else room.name = otherUser.userName;
          room.photo = otherUser.photo;
        }
        return room;
      });

      dispatch({
        type: actionTypes.FETCH_ROOM,
        payload: rooms,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchChannels = () => {
  return async (dispatch) => {
    try {
      const res = await instance.get(`api/v1/rooms/channels`);
      dispatch({
        type: actionTypes.FETCH_CHANNELS,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
