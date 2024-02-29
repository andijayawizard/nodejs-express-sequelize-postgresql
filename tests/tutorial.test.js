const pg = require("pg");
const request = require("supertest");
const app = require("../server");

require("dotenv").config();

const db = require("../app/models");

/* Connecting to the database before each test. */
beforeEach(async () => {
  await pg.connect(process.env.PSQL_URI);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await pg.connection.close();
});

describe("GET /api/tutorials", () => {
  it("should return all tutorials", async () => {
    const res = await request(app).get("/api/tutorials");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
