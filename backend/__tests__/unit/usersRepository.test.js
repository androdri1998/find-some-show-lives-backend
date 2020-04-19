const moment = require('moment');
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');
const faker = require('faker');
const { createUserRepository, getOneUserRepository } = require('../../app/repositories/users.repository');
const { createUsersService } = require('../../app/services/users.service');
const truncate = require('../utils/truncate');

describe('Users Repository', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create user in repository', async () => {
    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
    const user = {
      id: uuid(),
      email: faker.internet.email(),
      name: faker.name.findName(),
      profile_photo: null,
      password: await bcrypt.hash(faker.internet.password(), 8),
      created_at: createdAt,
      updated_at: createdAt,
      active: true
    };
    const userCreated = await createUserRepository(user);
    
    expect(userCreated.email).toBe(user.email);
  });

  it('should get one user in repository ', async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass
    };
    await createUsersService(user);
    
    const getUser = await getOneUserRepository({ email: user.email });

    expect(getUser.email).toBe(user.email);
  });

  it('should return error in get one user in repository ', async () => {
    const error = new Error("SQLITE_ERROR: no such column: User.teste");
    let requestError;
    try{
      await getOneUserRepository({ teste: "teste" }); 
    } catch(err) { 
      requestError = err;
    }

    expect(() => {throw requestError}).toThrow(error);
  });
});