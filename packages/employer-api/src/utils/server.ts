import cors from "cors"
import express, { NextFunction, Request, Response } from "express"
import helmet from "helmet"
import morgan from "morgan"
import { Issuer } from "openid-client"

const createServer = async () => {
    const corsOptions = {
        origin: [
            process.env.ORIGIN_URL || process.env.OPENSHIFT_NODEJS_ORIGIN_URL || ("http://localhost:3000" as string),
            process.env.CHEFS_FRONTEND_URL as string
        ],
        credentials: true,
        optionsSuccessStatus: 200
    }

    const issuerUrl = `${process.env.AUTH_KEYCLOAK_SERVER_URL}/realms/${process.env.AUTH_KEYCLOAK_REALM}`
    const keycloakIssuer = await Issuer.discover(issuerUrl)
    const oidcClient = new keycloakIssuer.Client({
        client_id: process.env.AUTH_KEYCLOAK_CLIENT || "",
        client_secret: process.env.AUTH_KEYCLOAK_CLIENT_SECRET || "",
        token_endpoint_auth_method: "client_secret_basic"
    })

    const protect = async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ error: "Missing or invalid Authorization header" })
            return
        }
        const token = authHeader.split(" ")[1]
        try {
            const introspection = await oidcClient.introspect(token)
            if (!introspection.active) {
                res.status(401).json({ error: "Token is not active" })
                return
            }
            ;(req as any).auth = introspection
            next()
        } catch (err) {
            res.status(401).json({ error: "Token validation failed" })
        }
    }

    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(morgan("[:date] :method :url :status :res[content-length] - :remote-addr - :response-time ms"))
    app.set("trust proxy", "loopback, linklocal, uniquelocal")
    app.use(cors(corsOptions))
    app.use(helmet())

    return { app, protect }
}

export default createServer
