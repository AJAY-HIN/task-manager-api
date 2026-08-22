const sequelize = require('../src/database/sequelize');
const User = require('../src/models/user.model');
const bcrypt = require('bcrypt');

async function getOrUpdateUser(email, role, name) {
  const hashedPassword = await bcrypt.hash('Password123', 10);
  let user = await User.findOne({ where: { email } });
  if (user) {
    user.password = hashedPassword;
    user.role = role;
    await user.save();
  } else {
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
  }
  return user;
}

async function testScenario(name, url, method, headers, body) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(url, options);
    const data = await res.json().catch(() => null);
    console.log(`[${name}] Status: ${res.status}`);
    // console.log(`[${name}] Response:`, data);
    return { status: res.status, data };
  } catch (error) {
    console.error(`[${name}] Error:`, error.message);
    return { error };
  }
}

async function run() {
  console.log('--- Preparing Database ---');
  await sequelize.authenticate();
  
  // Make sure we have the exact accounts we need
  const john = await getOrUpdateUser('john@example.com', 'USER', 'John Doe');
  const testUser = await getOrUpdateUser('testuser@example.com', 'USER', 'Test User');
  const admin = await getOrUpdateUser('ajayrathor7906@gmail.com', 'ADMIN', 'Admin User');

  console.log(`User (John) ID: ${john.id}`);
  console.log(`User (TestUser) ID: ${testUser.id}`);
  console.log(`Admin ID: ${admin.id}`);
  
  console.log('\n--- Logging in to obtain JWTs ---');
  const loginJohn = await testScenario('Login John', 'http://localhost:5000/api/v1/auth/login', 'POST', {}, {
    email: 'john@example.com',
    password: 'Password123'
  });
  
  const loginTestUser = await testScenario('Login TestUser', 'http://localhost:5000/api/v1/auth/login', 'POST', {}, {
    email: 'testuser@example.com',
    password: 'Password123'
  });

  const loginAdmin = await testScenario('Login Admin', 'http://localhost:5000/api/v1/auth/login', 'POST', {}, {
    email: 'ajayrathor7906@gmail.com',
    password: 'Password123'
  });

  const johnToken = loginJohn.data?.data?.accessToken;
  const testUserToken = loginTestUser.data?.data?.accessToken;
  const adminToken = loginAdmin.data?.data?.accessToken;

  if (!johnToken || !testUserToken || !adminToken) {
    console.error('Failed to log in users. Make sure server is running on http://localhost:5000');
    process.exit(1);
  }

  console.log('\n--- Running Scenarios ---');

  // Test A — USER -> Own User (Login as USER ID = john.id, Request: GET /api/v1/users/john.id -> Expected: 200)
  console.log('\nTest A — USER -> Own User (Expected: 200)');
  await testScenario('Test A', `http://localhost:5000/api/v1/users/${john.id}`, 'GET', {
    'Authorization': `Bearer ${johnToken}`
  });

  // Test B — USER -> Another User (Login as USER ID = john.id, Request: GET /api/v1/users/testUser.id -> Expected: 403)
  console.log('\nTest B — USER -> Another User (Expected: 403)');
  await testScenario('Test B', `http://localhost:5000/api/v1/users/${testUser.id}`, 'GET', {
    'Authorization': `Bearer ${johnToken}`
  });

  // Test C — ADMIN -> Another User (Login as ADMIN ID = admin.id, Request: GET /api/v1/users/john.id -> Expected: 200)
  console.log('\nTest C — ADMIN -> Another User (Expected: 200)');
  await testScenario('Test C', `http://localhost:5000/api/v1/users/${john.id}`, 'GET', {
    'Authorization': `Bearer ${adminToken}`
  });

  // Test D — USER -> All Users (Login as USER, Request: GET /api/v1/users -> Expected: 403)
  console.log('\nTest D — USER -> All Users (Expected: 403)');
  await testScenario('Test D', 'http://localhost:5000/api/v1/users', 'GET', {
    'Authorization': `Bearer ${johnToken}`
  });

  // Test E — ADMIN -> All Users (Login as ADMIN, Request: GET /api/v1/users -> Expected: 200)
  console.log('\nTest E — ADMIN -> All Users (Expected: 200)');
  await testScenario('Test E', 'http://localhost:5000/api/v1/users', 'GET', {
    'Authorization': `Bearer ${adminToken}`
  });

  // Test F — No JWT (Request: GET /api/v1/users/john.id without header -> Expected: 401)
  console.log('\nTest F — No JWT (Expected: 401)');
  await testScenario('Test F', `http://localhost:5000/api/v1/users/${john.id}`, 'GET', {});

  await sequelize.close();
}

run().catch(console.error);
