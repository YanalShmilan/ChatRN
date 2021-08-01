import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import chatReducer from "./reducers/chatReducer";
import { fetchChannels } from "./actions/chatActions";

// import { checkUser } from './actions/authActions';

const rootReducer = combineReducers({
  user: authReducer,
  chats: chatReducer,
});

const composeEnhancers = compose;

let store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
// store.dispatch(checkUs1er());
store.dispatch(fetchChannels());

export default store;
