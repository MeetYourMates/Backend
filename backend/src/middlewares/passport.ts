import User from "../models/user";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import config from "../config/config";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

export default new Strategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
        console.log(user.toJSON());
      return done(null, user);
    }
    console.log('Error with strategy');
    return done(null, false);
  } catch (error) {
    console.log(error);
  }
});