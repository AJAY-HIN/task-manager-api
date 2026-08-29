const sequelize = require('../src/database/sequelize');
const { User } = require('../src/models');
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
    if (res.status >= 400) {
      console.log(`  Response Error:`, data?.message || data);
    }
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

  console.log('\n--- Running User Scenarios ---');

  // Test A — USER -> Own User
  console.log('\nTest A — USER -> Own User (Expected: 200)');
  await testScenario('Test A', `http://localhost:5000/api/v1/users/${john.id}`, 'GET', {
    'Authorization': `Bearer ${johnToken}`
  });

  // Test B — USER -> Another User
  console.log('\nTest B — USER -> Another User (Expected: 403)');
  await testScenario('Test B', `http://localhost:5000/api/v1/users/${testUser.id}`, 'GET', {
    'Authorization': `Bearer ${johnToken}`
  });

  // Test C — ADMIN -> Another User
  console.log('\nTest C — ADMIN -> Another User (Expected: 200)');
  await testScenario('Test C', `http://localhost:5000/api/v1/users/${john.id}`, 'GET', {
    'Authorization': `Bearer ${adminToken}`
  });

  // Test D — USER -> All Users
  console.log('\nTest D — USER -> All Users (Expected: 403)');
  await testScenario('Test D', 'http://localhost:5000/api/v1/users', 'GET', {
    'Authorization': `Bearer ${johnToken}`
  });

  // Test E — ADMIN -> All Users
  console.log('\nTest E — ADMIN -> All Users (Expected: 200)');
  await testScenario('Test E', 'http://localhost:5000/api/v1/users', 'GET', {
    'Authorization': `Bearer ${adminToken}`
  });

  console.log('\n--- Running Project & Task Scenarios ---');

  // Create Project as John
  console.log('\nCreate Project as John (Expected: 201)');
  const createProjRes = await testScenario('Create Project', 'http://localhost:5000/api/v1/projects', 'POST', {
    'Authorization': `Bearer ${johnToken}`
  }, {
    name: 'Johns Secret Project',
    description: 'A secret project owned by John'
  });
  
  const projectId = createProjRes.data?.data?.id;

  if (projectId) {
    // Try to get John's project as TestUser (should fail)
    console.log('\nGet John Project as Test User (Expected: 403)');
    await testScenario('Get Project 403', `http://localhost:5000/api/v1/projects/${projectId}`, 'GET', {
      'Authorization': `Bearer ${testUserToken}`
    });

    // Get John's project as John (should succeed)
    console.log('\nGet John Project as John (Expected: 200)');
    await testScenario('Get Project 200', `http://localhost:5000/api/v1/projects/${projectId}`, 'GET', {
      'Authorization': `Bearer ${johnToken}`
    });

    // Create Task as John inside Project
    console.log('\nCreate Task as John in John Project (Expected: 201)');
    const createTaskRes = await testScenario('Create Task', `http://localhost:5000/api/v1/projects/${projectId}/tasks`, 'POST', {
      'Authorization': `Bearer ${johnToken}`
    }, {
      title: 'First Secret Task',
      description: 'Implement backend flow',
      status: 'TODO',
      priority: 'HIGH'
    });

    const taskId = createTaskRes.data?.data?.id;

    if (taskId) {
      // Get Tasks list in Project as John
      console.log('\nGet tasks in project as John (Expected: 200)');
      await testScenario('Get Tasks List', `http://localhost:5000/api/v1/projects/${projectId}/tasks`, 'GET', {
        'Authorization': `Bearer ${johnToken}`
      });

      // Update Task status as John
      console.log('\nUpdate task status to IN_PROGRESS (Expected: 200)');
      await testScenario('Update Task', `http://localhost:5000/api/v1/tasks/${taskId}`, 'PUT', {
        'Authorization': `Bearer ${johnToken}`
      }, {
        status: 'IN_PROGRESS'
      });

      // Delete Task as John
      console.log('\nDelete task as John (Expected: 200)');
      await testScenario('Delete Task', `http://localhost:5000/api/v1/tasks/${taskId}`, 'DELETE', {
        'Authorization': `Bearer ${johnToken}`
      });
    }

    // Clean up project
    console.log('\nDelete project as John (Expected: 200)');
    await testScenario('Delete Project', `http://localhost:5000/api/v1/projects/${projectId}`, 'DELETE', {
      'Authorization': `Bearer ${johnToken}`
    });
  }

  await sequelize.close();
}

run().catch(console.error);
