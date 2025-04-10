const passport = require('passport');
const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
	try {
		const { username, password } = req.body;

		const existingUser = await User.findOne({ where: { username } });
		if (existingUser) {
			return res.status(409).json({ message: "Nom d'utilisateur déjà pris" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ username, password: hashedPassword });

		res.status(201).json({ message: "Utilisateur créé", user: { id: user.id, username: user.username } });
	} catch (err) {
		next(err);
	}
};

exports.login = (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) return res.status(401).json({ message: info.message });

		req.logIn(user, (err) => {
			if (err) return next(err);
			return res.status(200).json({ message: "Connecté avec succès", user: { id: user.id, username: user.username } });
		});
	})(req, res, next);
};

exports.getMe = (req, res) => {
	res.status(200).json({ user: { id: req.user.id, username: req.user.username } });
};

exports.logout = (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);
		res.status(200).json({ message: "Déconnecté avec succès" });
	});
};
