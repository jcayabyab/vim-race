import { UPDATE_USER } from "./types";
import axios from "axios";

export const fetchUser = async () => {
  const res = await axios.get("/api/current-user");
  if (res.status < 200 || res.status > 300) {
    throw new Error(
      `Server error ${res.response} while fetching user: ${res.data}`
    );
  }
  return { type: UPDATE_USER, user: res.data };
};

export const updateUserProfile = async (user, username) => {
  // filter non-alphanumeric characters
  const newUser = { ...user, username: username.replace(/\W/g, "") };
  try {
    const res = await axios.put("/api/user/profile", { user: newUser });
    if (res.status !== 200) {
      throw new Error(`Server error (${res.response}): ${res.data}`);
    }
  } catch (e) {
    throw new Error("Error: " + e.response.data + ".");
  }
  // only change if username truly changes
  if (username !== user.username) {
    // matches format from backend
    newUser.usernameLastChanged = new Date().toISOString();
  }
  return { type: UPDATE_USER, user: newUser };
};

export const updateUserVimrc = async (user, vimrcText) => {
  const newUser = { ...user, vimrcText };

  const res = await axios.put("/api/user/vimrc", {
    userId: user.id,
    vimrcText,
  });
  if (res.status !== 200) {
    throw new Error(`Server error(${res.response}): ${res.data}`);
  }
  return { type: UPDATE_USER, user: newUser };
};
