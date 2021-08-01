import * as actionTypes from "./types";
import instance from "./instance";
import { fetchRoom } from "./chatActions";

export const signin = (phoneNumber, code, setError) => {
  return async (dispatch) => {
    try {
      const res = await instance.post(`/api/v1/users/login`, {
        phoneNumber: phoneNumber,
        code,
      });
      if (res.data) {
        console.log("success");
        dispatch(fetchRoom(res.data._id));
        dispatch({
          type: actionTypes.LOGIN,
          payload: res.data,
        });
      } else {
        alert("Incorrect Code");
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };
};
export const signout = (history, socket) => {
  return async (dispatch) => {
    try {
      socket.disconnect();
      history.push("/");
      dispatch({
        type: actionTypes.SIGNOUT,
        payload: null,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
