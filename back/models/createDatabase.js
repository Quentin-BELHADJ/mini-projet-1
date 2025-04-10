const { Client } = require('pg');
require('dotenv').config();
console.log("🚀 Initialisation de la base de données PostgreSQL");

async function createDatabaseIfNotExists() {
	const client = new Client({
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		database: 'postgres' // On se connecte à la base par défaut pour créer l'autre
	});

	const dbName = process.env.DB_NAME;

	try {
		await client.connect();

		const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

		if (res.rowCount === 0) {
			await client.query(`CREATE DATABASE "${dbName}"`);
			console.log(`✅ Base de données "${dbName}" créée`);
		} else {
			console.log(`ℹ️ La base "${dbName}" existe déjà`);
		}
	} catch (err) {
		console.error("❌ Erreur lors de la vérification/création de la base :", err.message);
		throw err;
	} finally {
		await client.end();
	}
}

module.exports = createDatabaseIfNotExists;