const passport = require("passport");
const router = require("express").Router();

const redirectAfterLogin = "/home";
const redirectAfterLogout = "/";

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect(redirectAfterLogin);
  }
);

router.get("/api/current-user", (req, res) => {
  // NOTE: sends "" if not logged in
  res.send(req.user);
});

router.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect(redirectAfterLogout);
});

module.exports = router;
