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

export const updateUserProfile = async (
  user,
  username,
  email,
  profilePictureUrl
) => {
  const newUser = { ...user, username, email, profilePictureUrl };
  const res = await axios.put("/api/user/profile", { user: newUser });
  if (res.status !== 200) {
    throw new Error(`Server error (${res.response}): ${res.data}`);
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
