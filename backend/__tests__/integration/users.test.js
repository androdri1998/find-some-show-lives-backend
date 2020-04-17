const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const truncate = require('../utils/truncate');
const { createUsersService } = require('../../app/services/users.service');

describe('Register users', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should to create a user in application', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
      confirm_password: userPass
    };

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(201);
  });

  it('should to create a user in application and return should contain object with id', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
      confirm_password: userPass
    };

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it('should return and error with code 409, user already register', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
      confirm_password: userPass
    };

    const response = await request(app)
      .post('/users')
      .send(user);

    const secondResponse = await request(app)
      .post('/users')
      .send(user);

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toHaveProperty("error");
    expect(secondResponse.body).toHaveProperty("error_description");
  });

  it('should return and error with code 400, invalid parameters', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      confirm_password: userPass
    };

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });
});

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should authenticate in application', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass
    };

    await createUsersService(user);

    const response = await request(app)
      .post('/users/auth')
      .send({
        email: user.email,
        password: user.password
      });

    expect(response.status).toBe(200);
  });

  it('should authenticate in application and return object with jwt code', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass
    };

    await createUsersService(user);

    const response = await request(app)
      .post('/users/auth')
      .send({
        email: user.email,
        password: user.password
      });

    expect(response.body).toHaveProperty("access_token");
  });

  it('should return error password error', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass
    };

    await createUsersService(user);

    const response = await request(app)
      .post('/users/auth')
      .send({
        email: user.email,
        password: "123456"
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it('should return error email error', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass
    };

    await createUsersService(user);

    const response = await request(app)
      .post('/users/auth')
      .send({
        email: `test${user.email}`,
        password: user.password
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });
});