const router = require("express").Router();
const requireLogin = require("../middlewares/requireLogin");
const db = require("../db/api");

router.put("/api/user/profile", requireLogin, async (req, res) => {
  const { user } = req.body;
  try {
    await db.updateProfileInfo(user);
    res.status(200).send("User updated successfully.");
  } catch (error) {
    console.error("User profile update error occurred: ", error);
    res.status(500).send("User profile update error occurred: " + error);
  }
});

router.put("/api/user/vimrc", requireLogin, async (req, res) => {
  const { userId, vimrcText } = req.body;
  try {
    await db.updateVimrc(userId, vimrcText);
    res.send("User updated successfully.", 200);
  } catch (error) {
    console.error("User .vimrc update error occurred: ", error);
    res.send("User .vimrc update error occurred: " + error, 500);
  }
});

module.exports = router;
