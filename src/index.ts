import express, {Request, Response} from 'express'
import bodyParser from "body-parser"

// create express app/
const app = express()
const port = process.env.PORT || 3000

let videos: any[] = []
const resolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
let error: { errorsMessages: any[] } = {errorsMessages: []}

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)


app.get('/videos', (req: Request, res: Response ) => {
    res.status(200).send(videos)
    })

app.post('/videos', (req: Request, res: Response ) => {

    if (req.body.title.length > 40 ) {
        error.errorsMessages.push({
            "message": "The title is wrong.",
            "field": "title"
        })
    }
    if (req.body.author.length > 20) {
        error.errorsMessages.push({
            "message": "The author is wrong.",
            "field": "author"
        })
    }
    if (!(resolutions.includes(req.body.availableResolutions[0]))) {
        error.errorsMessages.push({
            "message": "The availableResolutions is wrong.",
            "field": "availableResolutions"
        })
    }
    if ( req.body.title.length > 40 || req.body.author.length > 20
        || !(resolutions.includes(req.body.availableResolutions[0]))  )
        return res.status(400).send(error)

    else {
        const newlyCreatedVideo = {
            id: +(new Date()),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: (new Date().toISOString()),
            publicationDate: (new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()),
            availableResolutions: req.body.availableResolutions
        }
        videos.push(newlyCreatedVideo)
        res.status(201).send(newlyCreatedVideo)
    }
})

app.get('/videos/:id', (req: Request, res: Response ) => {

    let findVideo = videos.find(p => p.id === +req.params.id)

    if (findVideo) {
        return res.status(200).send(findVideo)
    } else {
        return res.send(404)
    }

})

app.put('/videos/:id', (req: Request, res:Response) => {

    let findVideo = videos.find(p => p.id === +req.params.id)

    if (findVideo) {
        if (req.body.title.length > 40 || typeof req.body.title === 'object') {
            error.errorsMessages.push({
                "message": "The title is wrong",
                "field": "title"
            })
        }
        if (req.body.author.length > 20) {
            error.errorsMessages.push({
                "message": "The author is wrong.",
                "field": "author"
            })
        }
        if (!(resolutions.includes(req.body.availableResolutions[0]))) {
            error.errorsMessages.push({
                "message": "The availableResolutions is wrong.",
                "field": "availableResolutions"
            })
        }
        if (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1) {
            error.errorsMessages.push({
                "message": "The minAgeRestriction is wrong.",
                "field": "minAgeRestriction"
            })
        }
        if (typeof req.body.canBeDownloaded === 'string') {
            error.errorsMessages.push({
                "message": "The canBeDownloaded is wrong.",
                "field": "canBeDownloaded"
            })
        }
        if (req.body.title.length > 40 || req.body.author.length > 20 ||
            !(resolutions.includes(req.body.availableResolutions[0])) ||
            req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1
            || typeof req.body.canBeDownloaded === 'string' || typeof req.body.title === 'object')
            return res.status(400).send(error)


        else {
            let updatedVideo = {
                id: +req.params.id,
                title: req.body.title || findVideo.title,
                author: req.body.author || findVideo.author,
                canBeDownloaded: req.body.canBeDownloaded || findVideo.canBeDownloaded,
                minAgeRestriction: req.body.minAgeRestriction || findVideo.minAgeRestriction,
                createdAt: findVideo.createdAt,
                publicationDate: req.body.publicationDate || findVideo.publicationDate,
                availableResolutions: req.body.availableResolutions || findVideo.availableResolutions
            }
            videos.push(updatedVideo)
            res.status(204)
        }
    }
})


app.delete('/videos/:id', (req: Request, res: Response ) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
        videos.splice(i, 1);
        res.send(204)
        return;
    }
}
    res.send(404)
})

app.delete('/testing/all-data', (req: Request, res: Response ) => {
    videos.splice(0, videos.length)
    res.send(204)
})

//start app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})