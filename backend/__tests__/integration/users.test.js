const request = require("supertest");
const faker = require("faker");
const app = require("../../app");
const truncate = require("../utils/truncate");
const { createUsersService } = require("../../app/services/users.service");
const { generateToken } = require("../../app/services/application.service");

describe("Register users", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should to create a user in application", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
      confirm_password: userPass,
    };

    const response = await request(app).post("/users").send(user);

    expect(response.status).toBe(201);
  });

  it("should to create a user in application and return should contain object with id", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
      confirm_password: userPass,
    };

    const response = await request(app).post("/users").send(user);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return and error with code 409, user already register", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
      confirm_password: userPass,
    };

    await createUsersService({
      email: user.email,
      name: user.name,
      password: user.password,
    });

    const secondResponse = await request(app).post("/users").send(user);

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toHaveProperty("error");
    expect(secondResponse.body).toHaveProperty("error_description");
  });

  it("should return and error with code 400, invalid parameters", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      confirm_password: userPass,
    };

    const response = await request(app).post("/users").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });
});

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should authenticate in application", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    await createUsersService(user);

    const response = await request(app).post("/users/auth").send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
  });

  it("should authenticate in application and return object with jwt code", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    await createUsersService(user);

    const response = await request(app).post("/users/auth").send({
      email: user.email,
      password: user.password,
    });

    expect(response.body).toHaveProperty("access_token");
  });

  it("should return error password error", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    await createUsersService(user);

    const response = await request(app).post("/users/auth").send({
      email: user.email,
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error email error", async () => {
    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    await createUsersService(user);

    const response = await request(app)
      .post("/users/auth")
      .send({
        email: `test${user.email}`,
        password: user.password,
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });
});

describe("Users", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should get users registereds in application", async () => {
    const userPass = faker.internet.password();

    const user1 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user1);

    const user2 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user2);

    const user3 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user3);

    const user4 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user4);

    const response = await request(app)
      .get(`/users`)
      .set("Authorization", `Bearer ${generateToken({ teste: "teste" })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("results");
  });

  it("should get users registereds filtered for search in application", async () => {
    const userPass = faker.internet.password();

    const user1 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user1);

    const user2 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user2);

    const user3 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user3);

    const user4 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user4);

    const response = await request(app)
      .get(`/users`)
      .query({
        search: `test`,
      })
      .set("Authorization", `Bearer ${generateToken({ teste: "teste" })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("results");
  });

  it("should get users registereds applying page and page_size in application", async () => {
    const userPass = faker.internet.password();

    const user1 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user1);

    const user2 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user2);

    const user3 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user3);

    const user4 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user4);

    const response = await request(app)
      .get(`/users`)
      .query({
        page: 0,
        page_size: 2,
      })
      .set("Authorization", `Bearer ${generateToken({ teste: "teste" })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("results");
  });

  it("should return error bad request parameters get users in application", async () => {
    const userPass = faker.internet.password();

    const user1 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    await createUsersService(user1);

    const response = await request(app)
      .get(`/users`)
      .query({
        teste: 2,
      })
      .set("Authorization", `Bearer ${generateToken({ teste: "teste" })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });
});
