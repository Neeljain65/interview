/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgresql://aidb_owner:qU5VIvTdDe0k@ep-lucky-haze-a5854zsg.us-east-2.aws.neon.tech/ai-mock?sslmode=require",
    }
  };