const moment = require("moment");
const uuid = require("uuid/v4");
const { Op } = require("sequelize");
const {
  followUserRepository,
  getOneFollowRepository,
  dropFollowRepository,
} = require("../../app/repositories/followUser.repository");
const truncate = require("../utils/truncate");

describe("Follow User Repository", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should follow user by repository", async () => {
    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
    const user = {
      id: uuid(),
      follower_id: uuid(),
      following_id: uuid(),
      created_at: createdAt,
      updated_at: createdAt,
      active: true,
    };
    const followCreated = await followUserRepository(user);

    expect(followCreated.id).toBe(user.id);
  });

  it("should get one follow by user in repository", async () => {
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
    const followResponse = await getOneFollowRepository({ id: follow.id });

    expect(followResponse.id).toBe(follow.id);
  });

  it("should drop follow by user in repository", async () => {
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

    await dropFollowRepository({
      [Op.and]: [
        { follower_id: follow.follower_id },
        { following_id: follow.following_id },
        { active: true },
      ],
    });
    const followResponse = await getOneFollowRepository({ id: follow.id });
    expect(followResponse.active).toBe(false);
  });
});
