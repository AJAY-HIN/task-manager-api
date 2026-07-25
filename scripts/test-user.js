const sequelize = require('../src/database/sequelize');
const User = require('../src/models/user.model');

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'temporary-password',
    });

    console.log(user.toJSON());
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

main();
