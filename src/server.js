const { asyncWrapProviders, triggerAsyncId } = require("async_hooks");
const express = require("express");
const path = require("path");
const  {appError, notFound} = require("./middleware/errorMiddleware");
const router = require("./route")
const app = express();



app.use(express.static(path.join(__dirname, "../public")));

app.use(router);

app.get("/healthz", (req,res) =>{
    res.json({
        status: 200,
        ip: req.ip,
        msg: "Server health check 100%"
    })
})

app.use(notFound)
app.use(appError)

const PORT = process.env.PORT || 3060;
async function startServer() {
    const now  = new Date;
    try {
        app.listen(PORT, () =>{
            console.log("Server is running on port ", PORT)
            console.log("Server started at ", now.toISOString())
        })
    } catch (error) {
        console.log("server crashed at  ", now.toISOString())
        console.error(eror)
        console.error(error.message)
    }
}

startServer()