function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).json({ message: "Non authentifié" });
}

module.exports = ensureAuthenticated;