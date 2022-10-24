/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import { attachPaginate } from "knex-paginate"

// eslint-disable-next-line global-require
export const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DB_NAME
    }
})

attachPaginate()
