import { FETCH_USER } from "../actions/types";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case FETCH_USER:
      // false means that the user is not logged in
      // different from null - null means loading
      return action.user || false;
    default:
      return state;
  }
};

export default userReducer;
