import * as actionTypes from '../actions/types';
const initialState = {
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case actionTypes.SIGNOUT: {
      return {
        ...state,
        user: null,
      };
    }
    case actionTypes.UPDATE_USER: {
      console.log(action.payload);
      return {
        ...state,
        user: action.payload,
      };
    }

    default:
      return state;
  }
};

export default reducer;
