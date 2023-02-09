import createServer from "./utils/server"

const app = createServer()

const port = process.env.PORT || "8002"
app.listen(port, () => {
    console.log(`server started at :${port}`)
})
