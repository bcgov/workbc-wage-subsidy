import createServer from "./utils/server"
import employerRoute from "./routes/employer.route"
import claimRoute from "./routes/claim.route"
import applicationRoute from "./routes/application.route"
import eventRoute from "./routes/event.route"
import addressRoute from "./routes/address.route"

const start = async () => {
    const { app, protect } = await createServer()

    app.use("/applications", protect, applicationRoute)
    app.use("/claims", protect, claimRoute)
    app.use("/events", eventRoute)
    app.use("/employers", protect, employerRoute)
    app.use("/address", addressRoute)

    const port = process.env.PORT || "8000"
    app.listen(port, () => {
        console.log(`server started at :${port}`)
    })
}

start()
