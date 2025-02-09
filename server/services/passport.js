const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../db/api");
const keys = require("../config/keys");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await db.findUserById(id);

  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: keys.callbackURL,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await db.findUserByGoogleId(profile.id);
      if (existingUser) {
        // update user sign in time
        await db.updateUserTimeById(existingUser.id);
        done(null, existingUser);
      } else {
        const user = await db.createNewUserGoogle(profile.id);

        done(null, user);
      }
    }
  )
);
