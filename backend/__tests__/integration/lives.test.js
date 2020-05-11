const request = require("supertest");
const faker = require("faker");
const moment = require("moment");
const uuid = require("uuid/v4");
const bcrypt = require("bcryptjs");
const app = require("../../app");
const truncate = require("../utils/truncate");
const { generateToken } = require("../../app/services/application.service");
const {
  createLiveRepository,
} = require("../../app/repositories/lives.repository");
const { User, SavedLive, Live, FollowUser } = require("../../app/models");

describe("Lives", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should to create a live in application", async () => {
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    const hash_password = await bcrypt.hash(user.password, 8);
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

    const live = {
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      time: moment().format("HH:mm:ss"),
      reminder: 30,
    };

    const response = await request(app)
      .post(`/lives`)
      .send(live)
      .set("Authorization", `Bearer ${generateToken({ id: userCreated.id })}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 400 to create a live in application", async () => {
    const response = await request(app)
      .post(`/lives`)
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 to create a live in application", async () => {
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const live = {
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      time: moment().format("HH:mm:ss"),
      reminder: 30,
    };

    const response = await request(app).post(`/lives`).send(live);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should get lives in application", async () => {
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const live1 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    const live2 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    const live3 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };

    await createLiveRepository(live1);
    await createLiveRepository(live2);
    await createLiveRepository(live3);

    const response = await request(app)
      .get(`/lives`)
      .query({
        page: 0,
        page_size: 2,
        search: live3.description.split(" ")[0],
      })
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("results");
  });

  it("should return error 400 in get lives in application", async () => {
    const response = await request(app)
      .get(`/lives`)
      .query({
        test: 0,
      })
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 in get lives in application", async () => {
    const response = await request(app).get(`/lives`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should delete live in application", async () => {
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const live1 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await createLiveRepository(live1);

    const response = await request(app)
      .delete(`/lives/${live1.id}`)
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 409 in delete live in application", async () => {
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const live1 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: false,
    };
    await createLiveRepository(live1);

    const response = await request(app)
      .delete(`/lives/${live1.id}`)
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 in delete live in application", async () => {
    const response = await request(app).delete(`/lives/${uuid()}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should get lives of user", async () => {
    const userId = uuid();
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const live1 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: userId,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    const live2 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: userId,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    const live3 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: userId,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };

    await createLiveRepository(live1);
    await createLiveRepository(live2);
    await createLiveRepository(live3);

    const response = await request(app)
      .get(`/users/${userId}/lives`)
      .query({
        page: 0,
        page_size: 2,
        search: live3.description.split(" ")[0],
      })
      .set("Authorization", `Bearer ${generateToken({ id: userId })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("results");
  });

  it("should return error 400 in get lives of user in application", async () => {
    const response = await request(app)
      .get(`/users/${uuid()}/lives`)
      .query({
        test: 0,
      })
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 in get lives of user in application", async () => {
    const response = await request(app).get(`/users/${uuid()}/lives`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should save live", async () => {
    const userId = uuid();
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    const hash_password = await bcrypt.hash(user.password, 8);
    const userCreated = await User.create({
      id: userId,
      name: user.name,
      email: user.email,
      profile_photo: null,
      password: hash_password,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    });

    const live1 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };

    await createLiveRepository(live1);

    const response = await request(app)
      .put(`/lives/${live1.id}/save-live`)
      .set("Authorization", `Bearer ${generateToken({ id: userCreated.id })}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 404 save live", async () => {
    const response = await request(app)
      .put(`/lives/${uuid()}/save-live`)
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 save live", async () => {
    const response = await request(app).put(`/lives/${uuid()}/save-live`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should unsave live", async () => {
    const userId = uuid();
    const liveId = uuid();
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    const hash_password = await bcrypt.hash(user.password, 8);
    const userCreated = await User.create({
      id: userId,
      name: user.name,
      email: user.email,
      profile_photo: null,
      password: hash_password,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    });

    const live1 = {
      id: liveId,
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: userId,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await Live.create(live1);

    const savedlive = {
      id: uuid(),
      user_id: userId,
      live_id: liveId,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await SavedLive.create(savedlive);

    const response = await request(app)
      .put(`/lives/${live1.id}/unsave-live`)
      .set("Authorization", `Bearer ${generateToken({ id: userCreated.id })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
  });

  it("should return error 404 unsave live", async () => {
    const response = await request(app)
      .put(`/lives/${uuid()}/unsave-live`)
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 unsave live", async () => {
    const response = await request(app).put(`/lives/${uuid()}/unsave-live`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return saved lives", async () => {
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const live1 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await Live.create(live1);
    
    const live2 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await Live.create(live2);

    const live3 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await Live.create(live3);

    const userId = uuid();

    const userPass = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    const hash_password = await bcrypt.hash(user.password, 8);
    await User.create({
      id: userId,
      name: user.name,
      email: user.email,
      profile_photo: null,
      password: hash_password,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    });

    const saveLive1 = {
      id: uuid(),
      user_id: userId,
      live_id: live1.id,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await SavedLive.create(saveLive1);

    const saveLive2 = {
      id: uuid(),
      user_id: userId,
      live_id: live2.id,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await SavedLive.create(saveLive2);

    const response = await request(app)
      .get(`/users/${userId}/saved-lives`)
      .query({
        page: 0,
        page_size: 15
      })
      .set("Authorization", `Bearer ${generateToken({ id: userId })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("results");
  });

  it("should return error 400 in saved lives", async () => {
    const response = await request(app)
      .get(`/users/${uuid()}/saved-lives`)
      .query({
        test: 0,
      })
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 in saved lives", async () => {
    const response = await request(app)
      .get(`/users/${uuid()}/saved-lives`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return followings lives", async () => {
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const userPass = faker.internet.password();
    const user1 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    const hash_password = await bcrypt.hash(user1.password, 8);
    const userCreated1 = await User.create({
      id: uuid(),
      name: user1.name,
      email: user1.email,
      profile_photo: null,
      password: hash_password,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    });

    const user2 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    const userCreated2 = await User.create({
      id: uuid(),
      name: user2.name,
      email: user2.email,
      profile_photo: null,
      password: hash_password,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    });

    const user3 = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: userPass,
    };

    const userCreated3 = await User.create({
      id: uuid(),
      name: user3.name,
      email: user3.email,
      profile_photo: null,
      password: hash_password,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    });

    const live1 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: userCreated1.id,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await Live.create(live1);
    
    const live2 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: userCreated1.id,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await Live.create(live2);

    const live3 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: userCreated2.id,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await Live.create(live3);
    
    const live4 = {
      id: uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      date: createdAt,
      reminder_in: 12,
      creator: userCreated2.id,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await Live.create(live4);

    const follow1 = {
      id: uuid(),
      follower_id: userCreated3.id,
      following_id: userCreated2.id,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await FollowUser.create(follow1);

    const follow2 = {
      id: uuid(),
      follower_id: userCreated3.id,
      following_id: userCreated1.id,
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    await FollowUser.create(follow2);

    const response = await request(app)
      .get(`/users/${userCreated3.id}/followings-lives`)
      .query({
        page: 0,
        page_size: 15
      })
      .set("Authorization", `Bearer ${generateToken({ id: userCreated3.id })}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("results");
  });

  it("should return error 400 in followings lives", async () => {
    const response = await request(app)
      .get(`/users/${uuid()}/followings-lives`)
      .query({
        test: 0,
      })
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });

  it("should return error 401 in followings lives", async () => {
    const response = await request(app)
      .get(`/users/${uuid()}/followings-lives`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("error_description");
  });
});
