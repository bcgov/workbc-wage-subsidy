import cors from "cors"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import addressRoute from "./routes/address.route"
import claimRoute from "./routes/claim.route"
import emailRoute from "./routes/email.route"
import wageRoute from "./routes/wage.route"

const whitelist = [
    process.env.CHEF_DEV_URL,
    process.env.CHEF_TEST_URL,
    process.env.OPENSHIFT_NODEJS_ORIGIN_URL || "http://localhost:3000"
]
const corsOptions = {
    origin: (origin: any, callback: any) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    // origin: "*",
    credentials: true,
    optionsSuccessStatus: 200
}

const app = express()

app.use(morgan("[:date] :method :url :status :res[content-length] - :remote-addr - :response-time ms"))
app.set("trust proxy", "loopback, linklocal, uniquelocal")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "form-action": ["'none'"],
            "style-src": ["'none'"],
            "font-src": ["'none'"]
        }
    })
)

app.use("/", wageRoute)
app.use("/", claimRoute)
app.use("/", addressRoute)
app.use("/", emailRoute)

const port = process.env.PORT || "8001"
app.listen(port, () => {
    console.log(`server started at :${port}`)
})
