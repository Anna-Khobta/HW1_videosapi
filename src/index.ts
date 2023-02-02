import express, {Request, Response} from 'express'
import bodyParser from "body-parser"

// create express app
const app = express()
const port = process.env.PORT || 3000

const videos = [
    {
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": (new Date().toISOString()),
        "publicationDate": (new Date().toISOString()),
        "availableResolutions": [ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"
        ]
    },
    {
        "id": 1,
        "title": "Anna",
        "author": "Anna1",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": (new Date().toISOString()),
        "publicationDate": (new Date().toISOString()),
        "availableResolutions": [ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"
        ]
    }
]

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.get('/hometask_01/api/videos', (req: Request, res: Response ) => {
    res.status(200).send(videos)
    })

app.post('/hometask_01/api/videos', (req: Request, res: Response ) => {
    if (req.body.title === null) {
        let error = {
            "errorsMessages": [
                {
                    "message": "The title is null. Please, write the title",
                    "field": "title"
                }
            ]
        }
        return res.status(400).send(error)
    } else if (req.body.author === null) {
        let error = {
            "errorsMessages": [
                {
                    "message": "The author is null. Please, write the author",
                    "field": "author"
                }
            ]
        }
        return res.status(400).send(error)
    } else {
        const newlyCreatedVideo = {
            id: +(new Date()),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: (new Date().toISOString()),
            publicationDate: (new Date().toISOString()),
            availableResolutions: req.body.availableResolutions
        }
        videos.push(newlyCreatedVideo)
        res.status(201).send(newlyCreatedVideo)
    }
})

app.get('/hometask_01/api/videos/:id', (req: Request, res: Response ) => {
    let findVideo = videos.find(p => p.id === +req.params.id)
    if (findVideo) {
        return res.status(200).send(findVideo)
    } else {
        return res.send(404)
    }

})

app.put('/hometask_01/api/videos/:id', (req: Request, res:Response) => {
    let findVideo = videos.find(p => p.id === +req.params.id)
    let resolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
    let elem = req.body.availableResolutions[0]

    let errorTitle = {
        "errorsMessages": [
            {
                "message": "The title is too long. Maximum length is 40 symbols",
                "field": "title"
            }
        ]
    }
    let errorAuthor = {
        "errorsMessages": [
            {
                "message": "The title is too long. Maximum length is 40 symbols",
                "field": "title"
            }
        ]
    }
    let errorCanBeDownloaded = {
        "errorsMessages": [
            {
                "message": "Please write true or false.",
                "field": "canBeDownloaded"
            }
        ]
    }
    let errorAvailableResolutions = {
        "errorsMessages": [
            {
                "message": "Please, select 1 of these properties: " + resolutions + ". And use [ ] to add Resolutions",
                "field": "availableResolutions"
            }
        ]
    }
    let errorMinAgeRestriction = {
        "errorsMessages": [
            {
                "message": "Please, use numbers. Available numbers from 1 to 18",
                "field": "minAgeRestriction"
            }
        ]
    }

     function contains(resolutions:any,elem:any) {
        let isExists = false;
        for (let i = 0; i < resolutions.length; i++) {
             if (elem === resolutions[i]) {
                 isExists = true
             }
        }
        return isExists
    }
    if (findVideo) {
        if (req.body.title.length > 40) {
            return res.status(400).send(errorTitle)
        } else if (req.body.author.length > 20) {
            return res.status(400).send(errorAuthor)
        } else if (typeof req.body.canBeDownloaded !== "boolean") {
            return res.status(400).send(errorCanBeDownloaded)
        //} else if (resolutions.includes(elem) == false) {
        } else if (!contains(resolutions, elem)) {
            return res.status(400).send(errorAvailableResolutions)
        } else if (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1 || typeof req.body.minAgeRestriction !== "number") {
            return res.status(400).send(errorMinAgeRestriction)
        } else {
            findVideo.title = req.body.title
            findVideo.author = req.body.author
            findVideo.canBeDownloaded = req.body.canBeDownloaded
            findVideo.minAgeRestriction = req.body.minAgeRestriction
            findVideo.availableResolutions = req.body.availableResolutions
            findVideo.publicationDate = req.body.publicationDate
            return res.send(findVideo)
        }

    } else {
        return res.send(404)
    }
})

app.delete('/hometask_01/api/videos/:id', (req: Request, res: Response ) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
        videos.splice(i, 1);
        res.send(204)
        return;
    }
}
    res.send(404)
})

//start app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})