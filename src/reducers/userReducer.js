import { UPDATE_USER } from "../actions/types";

// false means user has not loaded yet
const userReducer = (state = false, action) => {
  switch (action.type) {
    case UPDATE_USER:
      // null means user is not logged in
      return action.user || null;
    default:
      return state;
  }
};

export default userReducer;
