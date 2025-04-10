const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const seedUsers = require('./models/seedUser');
require('dotenv').config();
const createDatabaseIfNotExists = require('./models/createDatabase');
const { sequelize } = require('./models/user.model');

const userRoutes = require('./routes/user.router');

const port = process.env.API_PORT || 3000;
const app = express();

// Middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(session({
	secret: 'monSuperSecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: 'lax',
		maxAge:  5 * 60 * 1000 
	}
	
}));
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRoutes);

// Routes catch-all + erreurs
app.use("*", (req, res, next) => {
	const error = new Error("Route non trouvée");
	error.status = 404;
	next(error);
});
app.use((err, req, res, next) => {
	res.status(err.status || 500).send(err.message);
});

// Lancement conditionnel
(async () => {
	try {
		await createDatabaseIfNotExists(); // ✅ Crée la base si besoin

		await sequelize.authenticate(); // 🔌 Test de connexion
		console.log("✅ Connexion à PostgreSQL réussie");

		await sequelize.sync({ alter: true }); // 🏗️ Crée ou met à jour les tables
		console.log("📦 Modèles synchronisés avec la base");
		await seedUsers(); // 👤 Crée les utilisateurs par défaut
		app.listen(port, () => {
			console.log(`🚀 API démarrée sur http://localhost:${port}`);
		});
	} catch (err) {
		console.error("❌ Erreur au lancement :", err.message);
		process.exit(1);
	}
})();

module.exports = app;