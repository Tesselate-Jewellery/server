const mongoose = require('mongoose');
const { Role } = require('../models/RoleModel');

describe('Role Model Tests', () => {
    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost:27017/Tesselate-API-test");
        // Clean up database before testing (roles)
        await Role.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should create new role', async () => {
        const roleData = {
            name: 'test',
            description: 'jest test role',
        };

        const role = new Role(roleData);
        const savedRole = await role.save();

        // Expect the role id to exist
        expect(savedRole._id).toBeDefined();
        expect(savedRole.name).toBe(roleData.name);
        expect(savedRole.description).toBe(roleData.description);
    })
})