const request = require("supertest");
const faker = require("faker");
const moment = require("moment");
const uuid = require("uuid/v4");
const app = require("../../app");
const truncate = require("../utils/truncate");
const { generateToken } = require("../../app/services/application.service");
const {
  createLiveRepository,
} = require("../../app/repositories/lives.repository");

describe("Lives", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should to create a live in application", async () => {
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
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
      .set("Authorization", `Bearer ${generateToken({ id: uuid() })}`);

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
});
