const passport = require('passport');
const db = require('../../models');
const { Strategy, ExtractJwt } = require('passport-jwt');

const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'superSecretKey',
};

const jwtStrategy = new Strategy(option, async (payload, done) => {
  const user = await db.user.findOne({ where: { id: payload.id } });
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

passport.use('jwt-authentication', jwtStrategy);
