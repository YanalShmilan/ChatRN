import * as actionTypes from './types';
import instance from './instance';

export const updateUserData = (userData, history) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      for (const key in userData) formData.append(key, userData[key]);

      const res = await instance.put(`/api/v1/users/${userData.id}`, formData);
      history.push('/');
      dispatch({
        type: actionTypes.UPDATE_USER,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
