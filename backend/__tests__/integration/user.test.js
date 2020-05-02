const request = require("supertest");
const faker = require("faker");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v4");
const app = require("../../app");
const truncate = require("../utils/truncate");
const { createUsersService } = require("../../app/services/users.service");
const { generateToken } = require("../../app/services/application.service");
const { User } = require("../../app/models");

describe("Users", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should to create a user in application and get data of user", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    const hash_password = await bcrypt.hash(user.password, 8);
    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
    const userCreated = await User.create({
      id: uuid(),
      name: user.name,
      email: user.email,
      profile_photo: null,
      password: hash_password,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    });

    const response = await request(app)
      .get(`/users/${userCreated.id}`)
      .set("Authorization", `Bearer ${generateToken({ id: userCreated.id })}`);

    expect(response.status).toBe(200);
  });

  it("should to create a user in application and return error authorization get data of user", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    const userCreated = await createUsersService(user);

    const response = await request(app).get(`/users/${userCreated.id}`);

    expect(response.status).toBe(401);
  });

  it("should return error not found user", async () => {
    const uuidUser = "3a71f69a-7c35-48cc-8a1b-9609fda1756d";
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    await createUsersService(user);

    const response = await request(app)
      .get(`/users/${uuidUser}`)
      .set("Authorization", `Bearer ${generateToken({ teste: "teste" })}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return jwt error", async () => {
    const uuidUser = "3a71f69a-7c35-48cc-8a1b-9609fda1756d";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    const response = await request(app)
      .get(`/users/${uuidUser}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });
});
