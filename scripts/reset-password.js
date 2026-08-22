const sequelize = require('../src/database/sequelize');
const User = require('../src/models/user.model');
const bcrypt = require('bcrypt');

async function main() {
  const email = process.argv[2] || 'ajayrathor7906@gmail.com';
  const newPassword = process.argv[3] || 'Password123';

  if (!email) {
    console.error('Usage: node scripts/reset-password.js <email> [newPassword]');
    process.exit(1);
  }

  try {
    await sequelize.authenticate();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`Successfully reset password for user: ${email}`);
    console.log(`New password: ${newPassword}`);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await sequelize.close();
  }
}

main();
