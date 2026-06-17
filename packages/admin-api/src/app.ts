import "dotenv/config"
import createServer from "./utils/server"
import applicationRoute from "./routes/application.route"
import claimRoute from "./routes/claim.route"
import permissionRoute from "./routes/permission.route"
import notificationRoute from "./routes/notification.route"
import employerRoute from "./routes/employer.route"

const start = async () => {
    const { app, protect } = await createServer()

    app.use("/permission", protect, permissionRoute)
    app.use("/applications", protect, applicationRoute)
    app.use("/claims", protect, claimRoute)
    app.use("/notification", protect, notificationRoute)
    app.use("/employer", protect, employerRoute)

    const port = process.env.PORT || "8002"
    app.listen(port, () => {
        console.log(`server started at :${port}`)
    })
}

start()
