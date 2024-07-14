/** @type { import("drizzle-kit").Config } */
require('dotenv').config();
const URL = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url:URL,
    }
  };