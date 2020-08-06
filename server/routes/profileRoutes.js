const router = require("express").Router();
const requireLogin = require("../middlewares/requireLogin");
const db = require("../db/api");
const Filter = require("bad-words"),
  filter = new Filter();

router.put("/api/user/profile", requireLogin, async (req, res) => {
  const { user } = req.body;
  const usernameLastChanged = new Date(req.user.dataValues.usernameLastChanged);
  const timeDifference = new Date().getTime() - usernameLastChanged.getTime();
  // 30 days in ms
  const minTimeDifference = 30 * 24 * 60 * 60 * 1000;
  if (timeDifference < minTimeDifference) {
    return res.status(425).send("Too soon to change username");
  }

  // check for profanity
  if (filter.isProfane(user.username)) {
    return res.status(403).send("Username contents not allowed");
  }

  // filter non alphanumeric in username
  user.username = user.username.replace(/\W/g, "");

  // check if too short
  if (user.username.length < 3) {
    return res.status(403).send("Username must be at least 3 characters long");
  }

  try {
    // only update in database if different fron previous value
    if (user.username !== req.user.username) {
      await db.updateProfileInfo(user);
    }
    res.status(200).send("User updated successfully.");
  } catch (error) {
    console.error("User profile update error occurred: ", error.errors);
    if (error.errors[0].type === "unique violation") {
      res.status(409).send("Username already taken");
    } else {
      res
        .status(500)
        .send("User profile update error occurred: " + error.errors);
    }
  }
});

router.put("/api/user/vimrc", requireLogin, async (req, res) => {
  const { userId, vimrcText } = req.body;
  try {
    await db.updateVimrc(userId, vimrcText);
    res.status(200).send("User updated successfully.");
  } catch (error) {
    console.error("User .vimrc update error occurred: ", error.errors);
    res.status(500).send("User .vimrc update error occurred: " + error.errors);
  }
});

module.exports = router;
