import cors from "cors"
import express from "express"
import helmet from "helmet"
import Keycloak, { KeycloakConfig } from "keycloak-connect"
import claimRoute from "./routes/claim.route"
import wageRoute from "./routes/wage.route"

const corsOptions = {
    origin: process.env.ORIGIN_URL || process.env.OPENSHIFT_NODEJS_ORIGIN_URL || "http://localhost:3001",
    credentials: true,
    optionsSuccessStatus: 200
}

const kcConfig: KeycloakConfig = {
    "confidential-port": process.env.AUTH_KEYCLOAK_CONFIDENTIAL_PORT || 0,
    "auth-server-url": process.env.AUTH_KEYCLOAK_SERVER_URL || "",
    resource: process.env.AUTH_KEYCLOAK_CLIENT || "",
    "ssl-required": process.env.AUTH_KEYCLOAK_SSL_REQUIRED || "",
    "bearer-only": false,
    realm: process.env.AUTH_KEYCLOAK_REALM || ""
}

const app = express()

console.log(kcConfig)
const keycloak = new Keycloak({}, kcConfig)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(helmet())
app.use(keycloak.middleware())

app.use("/", keycloak.protect(), claimRoute)
app.use("/", keycloak.protect(), wageRoute)

const port = process.env.PORT || "8002"
app.listen(port, () => {
    console.log(`server started at :${port}`)
})
