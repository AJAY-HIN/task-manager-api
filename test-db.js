const sequelize = require('./src/database/sequelize');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Unable to connect to the database.');
    console.error(error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();
