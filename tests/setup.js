const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/user");
const Strain = require("../models/strain");
const Mouse = require("../models/mouse");
const BreedingRecord = require("../models/breedingRecord");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Strain.deleteMany({});
  await Mouse.deleteMany({});
  await BreedingRecord.deleteMany({});
  const password = "testpassword";
  const user = new User({
    name: "testuser",
    username: "testuser@example.com",
    role: "計畫管理人",
    tel: "0912345678",
    dept: "動物中心",
  });
  await User.register(user, password);

  const strain = new Strain({
    strain: "C57BL/6",
    abbr: "B6",
    iacuc_no: "20240204",
    dept: "動物中心",
    EXP: new Date(),
    users: [user.name],
    genes: ["Gene1", "Gene2"],
  });
  await strain.save();

  const mouse = new Mouse({
    no: "F10",
    strain: strain._id,
    toeNumber: "L1",
    birth_date: new Date("2024-01-01"),
    gender: "M",
    parents: { father: "M1", mother: "F2" },
    sampling_date: new Date(),
    sampling_results: ["WT"],
    litter: 5,
    on_shelf: "在架上",
    note: "測試小鼠",
  });
  await mouse.save();

  const breedingRecord = new BreedingRecord({
    strain: strain._id,
    cage_no: "CAGE-001",
    parents: { father: "M1", mother: "F2" },
    pairing_date: new Date(),
    offspring: mouse._id,
    on_shelf: "在架上",
  });
  await breedingRecord.save();
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
