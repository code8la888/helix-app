const request = require("supertest");
const app = require("../../index");
const User = require("../../models/user");
const Strain = require("../../models/strain");

describe("Strains API 測試", () => {
  let cookie;

  //初始化
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "testpassword" })
      .expect(200);

    cookie = res.headers["set-cookie"]; // 取得登入後的 Cookie
  });

  //測試
  test("獲取所有品系資料", async () => {
    const res = await request(app)
      .get("/api/strains")
      .set("Cookie", cookie)
      .expect(200);

    // 斷言
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.strains)).toBe(true);
    expect(res.body.strains.length).toBeGreaterThan(0);
  });

  test("建立新品系", async () => {
    const user = await User.findOne({ username: "testuser" });

    const newStrain = new Strain({
      strain: "ICR",
      abbr: "ICR",
      iacuc_no: "20250409",
      dept: "動物中心",
      EXP: new Date("2026-01-01"),
      users: [user.username],
    });

    const res = await request(app)
      .post("/api/strains")
      .set("Cookie", cookie)
      .send({ strain: newStrain })
      .expect(200);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("成功新增特殊品系資訊");
  });

  test("尋找單一品系", async () => {
    const strain = await Strain.findOne({ strain: "C57BL/6" });

    if (!strain) {
      throw new Error("找不到品系 C57BL/6，請確認測試資料是否正確插入");
    }
    console.log(`測試品系 ID: ${strain._id}`);

    const user = await User.findOne({ username: "testuser" });
    if (!user) {
      throw new Error("找不到測試用戶，請確認測試資料是否正確插入");
    }

    if (!strain.users.includes(user.username)) {
      throw new Error(`測試用戶 ${user.username} 沒有權限查看該品系`);
    }
    const res = await request(app)
      .get(`/api/strains/${strain._id}`)
      .set("Cookie", cookie)
      .expect(200);
    console.log("成功取得單一品系", res.body);
  });

  test("更新品系資訊", async () => {
    const strain = await Strain.findOne({ strain: "C57BL/6" });

    if (!strain) {
      throw new Error("找不到該品系相關資料!");
    }

    const dbUser = await User.findOne({ username: "testuser" });
    if (!dbUser) {
      throw new Error("使用者資料不存在!");
    }

    if (
      strain.users.includes(dbUser.username) &&
      dbUser.role !== "計畫管理人"
    ) {
      throw new Error("您沒有權限訪問或編輯此頁面");
    }

    const strainObj = strain.toObject();
    delete strainObj.__v;
    const updatedStrain = {
      ...strainObj,
      strain: "C57BL/6J",
      abbr: "B6J",
    };

    const res = await request(app)
      .put(`/api/strains/${strain._id}`)
      .set("Cookie", cookie)
      .send({ strain: updatedStrain })
      .expect(200);
    console.log(res.body);

    expect(res.body.message).toBe("成功修改品系資訊");
  });

  test("刪除品系", async () => {
    const strain = await Strain.findOne({ strain: "C57BL/6" });
    if (!strain) {
      throw new Error("找不到該品系相關資料!");
    }

    const dbUser = await User.findOne({ username: "testuser" });
    if (!dbUser) {
      throw new Error("使用者資料不存在!");
    }

    if (
      strain.users.includes(dbUser.username) &&
      dbUser.role !== "計畫管理人"
    ) {
      throw new Error("您沒有權限訪問或編輯此頁面");
    }
    const res = await request(app)
      .delete(`/api/strains/${strain._id}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.message).toBe("成功刪除品系及相關數據");
  });
});
