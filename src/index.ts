import express, {Request, Response} from 'express'
import {videosRouter} from "./routes/videos-router";

// create express app/
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/', videosRouter)



//start app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})