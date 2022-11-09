import cors from "cors"
import express from "express"
import helmet from "helmet"
import claimRoute from "./routes/claim.route"
import wageRoute from "./routes/wage.route"

const corsOptions = {
    origin: process.env.ORIGIN_URL || process.env.OPENSHIFT_NODEJS_ORIGIN_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
}

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(helmet())

app.use("/", wageRoute)
app.use("/", claimRoute)

const port = process.env.PORT || "8000"
app.listen(port, () => {
    console.log(`server started at :${port}`)
})
