const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');

async function seedUsers() {
	const defaultUsers = [
		{ username: 'admin', password: 'admin123', email: 'admin@example.com' },
		{ username: 'demo', password: 'demo123', email: 'demo@example.com' }
	];

	for (const data of defaultUsers) {
		const existing = await User.findOne({ where: { username: data.username } });
		if (!existing) {
			const hashedPassword = await bcrypt.hash(data.password, 10);
			await User.create({
				username: data.username,
				password: hashedPassword,
				email: data.email
			});
			console.log(`✅ Utilisateur "${data.username}" créé`);
		} else {
			console.log(`ℹ️ Utilisateur "${data.username}" déjà existant`);
		}
	}
}

module.exports = seedUsers;