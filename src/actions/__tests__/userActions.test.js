import axios from "axios";
import { fetchUser, updateUserProfile } from "../userActions";
import { UPDATE_USER } from "../types";

jest.mock("axios");

describe("fetchUser", () => {
  it("returns a user object", async () => {
    const res = {
      data: {
        email: "email@email.com",
        googleId: "1010101",
        id: 1,
        lastSignInTime: "2020-07-09T00:00:00.000Z",
        profilePictureUrl: "hello",
        username: "user",
        vimrcText: '" vimrc',
      },
      status: 200,
    };

    axios.get.mockResolvedValue(res);

    const action = await fetchUser();
    expect(action).toEqual({
      type: UPDATE_USER,
      user: {
        email: expect.any(String),
        googleId: expect.any(String),
        id: expect.any(Number),
        lastSignInTime: expect.any(String),
        profilePictureUrl: expect.any(String),
        username: expect.any(String),
        vimrcText: expect.any(String),
      },
    });
  });

  it("throws an exception on bad get", async () => {
    const res = {
      status: 500,
    };

    axios.get.mockResolvedValue(res);

    await expect(fetchUser()).rejects.toThrow();
  });
});

describe("updateUserProfile", () => {
  it("returns the user object on success", async () => {
    const user = {
      email: "oldEmail",
      googleId: "oldGoogleId",
      id: 1,
      lastSignInTime: "oldSignInTime",
      profilePictureUrl: "oldPicUrl",
      username: "oldName",
      vimrcText: '" vimrc',
    };

    const username = "newUsername";
    const email = "newEmail";
    const profilePictureUrl = "profilePictureUrl";

    const res = {
      data: "User updated successfully.",
      status: 200,
    };

    const newUser = { ...user, username, email, profilePictureUrl };

    axios.put.mockResolvedValue(res);

    const action = await updateUserProfile(
      user,
      username,
      email,
      profilePictureUrl
    );
    expect(action).toEqual({
      type: UPDATE_USER,
      user: newUser,
    });
  });

  it("throws an exception on internal server error", async () => {
    const res = {
      status: 500,
    };

    axios.put.mockResolvedValue(res);

    await expect(updateUserProfile()).rejects.toThrow();
  });
});
