/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./schema.ts",
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.DRIZZLE_DATABASE_URL,
    }
  };