const request = require("supertest");
const faker = require("faker");
const uuid = require("uuid/v4");
const moment = require("moment");
const app = require("../../app");
const truncate = require("../utils/truncate");
const { createUsersService } = require("../../app/services/users.service");
const { generateToken } = require("../../app/services/application.service");
const {
  followUserRepository,
} = require("../../app/repositories/followUser.repository");

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

  it("should follow user", async () => {
    const userPass = faker.internet.password();

    const user1 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    const user1created = await createUsersService(user1);

    const user2 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    const user2created = await createUsersService(user2);

    const response = await request(app)
      .put(`/users/follow-user`)
      .send({ following_id: user2created.id })
      .set("Authorization", `Bearer ${generateToken({ id: user1created.id })}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 400 follow user", async () => {
    const userPass = faker.internet.password();

    const user1 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    const user1created = await createUsersService(user1);

    const response = await request(app)
      .put(`/users/follow-user`)
      .set("Authorization", `Bearer ${generateToken({ id: user1created.id })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 follow user", async () => {
    const userPass = faker.internet.password();

    const user2 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    const user2created = await createUsersService(user2);

    const response = await request(app)
      .put(`/users/follow-user`)
      .send({ following_id: user2created.id });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 409 follow user", async () => {
    const userPass = faker.internet.password();

    const user1 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    const user1created = await createUsersService(user1);

    const user2 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    const user2created = await createUsersService(user2);

    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
    const follow = {
      id: uuid(),
      follower_id: user1created.id,
      following_id: user2created.id,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await followUserRepository(follow);

    const response = await request(app)
      .put(`/users/follow-user`)
      .send({ following_id: user2created.id })
      .set("Authorization", `Bearer ${generateToken({ id: user1created.id })}`);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should unfollow user", async () => {
    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
    const follow = {
      id: uuid(),
      follower_id: uuid(),
      following_id: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await followUserRepository(follow);

    const response = await request(app)
      .put(`/users/unfollow-user`)
      .send({ following_id: follow.following_id })
      .set(
        "Authorization",
        `Bearer ${generateToken({ id: follow.follower_id })}`
      );

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 400 in unfollow user", async () => {
    const response = await request(app)
      .put(`/users/unfollow-user`)
      .set("Authorization", `Bearer ${generateToken({ id: "teste" })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 in unfollow user", async () => {
    const response = await request(app).put(`/users/unfollow-user`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 409 in unfollow user", async () => {
    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
    const follow = {
      id: uuid(),
      follower_id: uuid(),
      following_id: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: false,
    };
    await followUserRepository(follow);

    const response = await request(app)
      .put(`/users/unfollow-user`)
      .send({ following_id: follow.following_id })
      .set(
        "Authorization",
        `Bearer ${generateToken({ id: follow.follower_id })}`
      );

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should logout user from application", async () => {
    const response = await request(app)
      .put(`/users/logout`)
      .set("Authorization", `Bearer ${generateToken({ id: "teste" })}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 401 in logout user", async () => {
    const response = await request(app).put(`/users/logout`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should update user in application", async () => {
    const userPass = faker.internet.password();

    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    const userCreated = await createUsersService(user);

    const response = await request(app)
      .put(`/users/${userCreated.id}`)
      .send({
        photo: "test image",
        name: "new name",
      })
      .set("Authorization", `Bearer ${generateToken({ id: user.id })}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 404 in update user in application", async () => {
    const response = await request(app)
      .put(`/users/${uuid()}`)
      .send({
        photo: "test image",
        name: "new name",
      })
      .set("Authorization", `Bearer ${generateToken({ id: "test" })}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 400 in update user in application", async () => {
    const response = await request(app)
      .put(`/users/${uuid()}`)
      .send({
        test: "test image",
      })
      .set("Authorization", `Bearer ${generateToken({ id: "test" })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 in update user in application", async () => {
    const response = await request(app).put(`/users/${uuid()}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should update email of user in application", async () => {
    const userPass = faker.internet.password();

    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    const userCreated = await createUsersService(user);

    const newEmail = faker.internet.email();
    const response = await request(app)
      .put(`/users/${userCreated.id}/update-email`)
      .send({
        email: newEmail,
      })
      .set("Authorization", `Bearer ${generateToken({ id: userCreated.id })}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 404 in update email user in application", async () => {
    const response = await request(app)
      .put(`/users/${uuid()}/update-email`)
      .send({
        email: faker.internet.email(),
      })
      .set("Authorization", `Bearer ${generateToken({ id: "test" })}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 400 in update email user in application", async () => {
    const response = await request(app)
      .put(`/users/${uuid()}/update-email`)
      .send({
        test: "test image",
      })
      .set("Authorization", `Bearer ${generateToken({ id: "test" })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 in update email user in application", async () => {
    const response = await request(app).put(`/users/${uuid()}/update-email`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should delete user in application", async () => {
    const userPass = faker.internet.password();

    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };
    const userCreated = await createUsersService(user);

    const response = await request(app)
      .delete(`/users/${userCreated.id}`)
      .set("Authorization", `Bearer ${generateToken({ id: userCreated.id })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 404 in delete user in application", async () => {
    const response = await request(app)
      .delete(`/users/${uuid()}`)
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 in delete user in application", async () => {
    const response = await request(app).delete(`/users/${uuid()}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });
});
