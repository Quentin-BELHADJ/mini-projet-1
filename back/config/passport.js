const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models/user.model');

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username } });
        if (!user) return done(null, false, { message: 'Utilisateur non trouvé' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Mot de passe incorrect' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
  });
};
