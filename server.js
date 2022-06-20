const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000

const MongoClient = require('mongodb').MongoClient
// allows us to make connections to mongodb ^
const connectionString = 'mongodb+srv://bazusername:bazpassword@cluster0.wgff3.mongodb.net/?retryWrites=true&w=majority'
// mongodb connection string ^

app.use(cors()) 
// allows our server to communicate CROSS-DOMAIN (not just internally - default security feature)
app.use(express.json())
// allows us to convert back and forth to JSON ^

// sets the view engine to EJS
app.set('view engine', 'ejs')
// sets the static public folder (so you don't have to link all css/js/images etc)
app.use(express.static('public'))

MongoClient.connect(connectionString)
// connect to MongoDB using a URL ^
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('pond-plant-api')
        // specify which database we are looking for^
        const infoCollection = db.collection('plant-info')
        // specificy which collection we are looking for ^

    // root ROUTE
    // app.get('/', (request, response) => {
    //     response.sendFile(__dirname + '/index.html')
    // })

    app.get('/', (request, response) => {
        db.collection('plant-info').find().toArray()
            .then(data => {
                response.render('index.ejs', { info: data })
            })
            .catch(error => console.error(error))
    })

    // API Request ROUTE
    app.get('/api/:name', (request,response) => {
        const plantName = request.params.name.toLowerCase()
        // get the parameter from the URL ^
        infoCollection
            .find({commonName:plantName}).toArray()
            // find method to look for { key : value }
            // also for some reason it needs it to be wrapped as an Array ^
            // .find RETURNS A CURSOR < thats why turning into an Array works 
            .then(results => {
                console.log(results)
                response.json(results[0])
                // we remove the Array wrapper by specifying [0]^
        })
        .catch(error => console.error(error))
    })

    app.post('/addPlant', (request, response) => {
        console.log(request.body)
        db.collection('plant-info').insertOne({ commonName: request.body.commonName, scientificName: request.body.scientificName, plantDescription: request.body.plantDescription, plantImage: request.body.plantImage})
        .then(result => {
            console.log('Plant Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
    })

})
.catch(error => console.error(error))

// use Heroku Environment PORT
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})