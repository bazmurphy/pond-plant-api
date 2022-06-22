const express = require('express')
// require express
const app = express()
// set "app" as the shorthand for express
const cors = require('cors')
// require CORS for cross domain issues
const MongoClient = require('mongodb').MongoClient
// allows us to make connections to mongodb ^
const PORT = 8000
// set the port
require('dotenv').config()
// require dotenv for the .env file


let db,
    dbConnectionString = process.env.DB_STRING,
    dbName = 'pond-plant-api'
// create 3 variables the db,
// the Connection String stored in the .env file as DB_STRING

MongoClient.connect(dbConnectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to the ${dbName} Database`)
        db = client.db(dbName)
    })


app.use(cors())
// allows our server to communicate CROSS-DOMAIN (not just internally, it's a security feature turned off by default)

app.set('view engine', 'ejs')
// sets the view engine to EJS

app.use(express.static('public'))
// sets the static public folder (so you don't have to link all css/js/images manually)

app.use(express.urlencoded({ extended: true }))
// express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
// This method is called a middleware in your application using the code: app.use(express.urlencoded());

app.use(express.json())
// allows us to convert back and forth to JSON ^


// root ROUTE
app.get('/', (request, response) => {
    db.collection('plant-info')
        .find()
        .toArray()
        .then(data => {
            response.render('index.ejs', { info: data })
        })
        .catch(error => console.error(error))
})

// API Request ROUTE
app.get('/api/:name', (request,response) => {
    const plantName = request.params.name
    // get the parameter from the URL ^
    db.collection('plant-info')
        .find({ commonName: plantName }) 
        // find method to look for { key : value }
        .toArray() 
        // also for some reason it needs it to be wrapped as an Array ^
        // .find RETURNS A CURSOR < thats why turning into an Array works 
        .then(results => {
            console.log(results)
            response.json(results[0])
            // we remove the Array wrapper by specifying [0]^
    })
    .catch(error => console.error(error))
})

// '/addPlant' POST (Create) ROUTE
app.post('/addPlant', (request, response) => {
    console.log(request.body)
    db.collection('plant-info')
        .insertOne({ commonName: request.body.commonName, 
                    scientificName: request.body.scientificName, 
                    description: request.body.description, 
                    image: request.body.image })
        .then(result => {
            console.log('Plant Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

// '/updatePlant' PUT (Update) ROUTE
app.put('/updatePlant', (request, response) => {
    console.log(request.body)
    Object.keys(request.body).forEach(key => {
        if (request.body[key] === null || request.body[key] === undefined || request.body[key] === '') {
            delete request.body[key]
        }
    })
    console.log(request.body)
    db.collection('plant-info')
        .findOneAndUpdate(
        { commonName: request.body.commonName },
        {   
            $set: request.body
        }
    )
    .then(result => {
        console.log(result)
        response.json('Plant Updated')
    })
    .catch(error => console.error(error))
})

// '/deletePlant' DELETE (Delete) ROUTE
app.delete('/deletePlant', (request, response) => {
    db.collection('plant-info').deleteOne(
        { commonName: request.body.commonName }
    )
    .then(result => {
        console.log(result)
        response.json('Plant Deleted')
    })
    .catch(error => console.error(error))
})


// use Heroku Environment PORT
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})