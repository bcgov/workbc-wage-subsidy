import cors from "cors"
import express from "express"
import helmet from "helmet"
import Keycloak from "keycloak-connect"
import morgan from "morgan"

import claimRoute from "./routes/claim.route"
import applicationRoute from "./routes/application.route"
import eventRoute from "./routes/event.route"

const corsOptions = {
    origin: process.env.ORIGIN_URL || process.env.OPENSHIFT_NODEJS_ORIGIN_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
}

const kcConfig = {
    "confidential-port": process.env.AUTH_KEYCLOAK_CONFIDENTIAL_PORT || 0,
    "auth-server-url": process.env.AUTH_KEYCLOAK_SERVER_URL || "",
    resource: process.env.AUTH_KEYCLOAK_CLIENT || "",
    "ssl-required": process.env.AUTH_KEYCLOAK_SSL_REQUIRED || "",
    "bearer-only": false,
    realm: process.env.AUTH_KEYCLOAK_REALM || "",
    secret: process.env.AUTH_KEYCLOAK_CLIENT_SECRET || ""
}

const keycloak = new Keycloak({}, kcConfig)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(morgan("[:date] :method :url :status :res[content-length] - :remote-addr - :response-time ms"))
app.set("trust proxy", "loopback, linklocal, uniquelocal")
app.use(helmet())
app.use(keycloak.middleware())

app.use("/applications", keycloak.protect(), applicationRoute)
app.use("/claims", keycloak.protect(), claimRoute)
app.use("/events", eventRoute)

const port = process.env.PORT || "8000"
app.listen(port, () => {
    console.log(`server started at :${port}`)
})
