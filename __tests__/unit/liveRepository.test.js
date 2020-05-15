const moment = require("moment");
const uuid = require("uuid/v4");
const faker = require("faker");
const {
  createLiveRepository,
} = require("../../app/repositories/lives.repository");
const truncate = require("../utils/truncate");

describe("Lives Repository", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should create live by repository", async () => {
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const live = {
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
    const liveCreated = await createLiveRepository(live);

    expect(liveCreated.id).toBe(live.id);
  });
});
