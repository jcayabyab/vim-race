import { FETCH_USER } from "./types";
import axios from "axios";

export const fetchUser = async () => {
  const res = await axios.get("/api/current-user");
  return { type: FETCH_USER, user: res.data };
};
