const faker = require('faker');
const { createUsersService } = require('../../app/services/users.service');
const truncate = require('../utils/truncate');

describe('Users services', () => {
  beforeEach(async () => {
    await truncate();
  });
  
  it('should create user in service', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass
    };
    const userCreated = await createUsersService(user);

    expect(userCreated.email).toBe(user.email);
  });
});