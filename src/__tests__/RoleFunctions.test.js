const mongoose = require('mongoose');
const { getAllRoles, getUsersWithRole } = require('../controllers/RoleFunctions');
const { Role } = require('../models/RoleModel');
const { User } = require('../models/UserModel');

describe('Role Controller Tests', () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/Tesselate-API-test");
    // Ensure a clean database state before running the tests
    await Role.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Clean up after all tests are done
    await Role.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it('should get all roles', async () => {
    // Create some test roles
    const roles = [
      { name: 'admin', description: 'Administrator' },
      { name: 'user', description: 'Regular User' },
    ];

    await Role.insertMany(roles);

    const result = await getAllRoles();

    expect(result).toHaveLength(roles.length);
    expect(result[0].name).toBe(roles[0].name);
    expect(result[1].name).toBe(roles[1].name);
  });

  it('should get users with a specific role', async () => {
    // Create some test roles
    const roles = [
      { name: 'admin', description: 'Administrator' },
      { name: 'user', description: 'Regular User' },
    ];

    await Role.insertMany(roles);

    // Create some test users with specific roles
    const users = [
      { username: 'admin1', email: 'admin1@email.com', password: '123456', role: roles[0]._id },
      { username: 'user1', email: 'user1@email.com', password: 'abcdef', role: roles[1]._id },
    ];

    await User.insertMany(users);

    const result = await getUsersWithRole("admin");
    console.log(result);

    expect(result).toHaveLength(1);
    expect(result[0].username).toBe(users[0].username);
  });
});