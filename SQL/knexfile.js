/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line global-require
require("dotenv").config()

module.exports = {
    client: "pg",
    connection: {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DB_NAME
    }
}
