const request = require("supertest");
const faker = require("faker");
const moment = require("moment");
const uuid = require("uuid/v4");
const app = require("../../app");
const truncate = require("../utils/truncate");
const { generateToken } = require("../../app/services/application.service");

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
});
