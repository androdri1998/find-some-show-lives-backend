const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const truncate = require('../utils/truncate');
const { createUsersService } = require('../../app/services/users.service');

describe('Users', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should to create a user in application and get data of user', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass
    };

    const userCreated = await createUsersService(user);

    const response = await request(app)
      .get(`/users/${userCreated.id}`);

    expect(response.status).toBe(200);
  });

  it('should return error not found user', async () => {
    const uuidUser = "3a71f69a-7c35-48cc-8a1b-9609fda1756d";

    const response = await request(app)
      .get(`/users/${uuidUser}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });
});