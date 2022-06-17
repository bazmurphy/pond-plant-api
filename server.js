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

MongoClient.connect(connectionString)
// connect to MongoDB using a URL ^
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('pond-plant-api')
        // specify which database we are looking for^
        const infoCollection = db.collection('plant-info')
        // specificy which collection we are looking for ^

    // root ROUTE
    app.get('/', (request, response) => {
        response.sendFile(__dirname + '/index.html')
    })

    // client side CSS ROUTE
    app.get('/css/styles.css', (request, response) => {
        response.sendFile(__dirname + '/css/styles.css')
    })

    // client side JS ROUTE
    app.get('/js/main.js', (request, response) => {
        response.sendFile(__dirname + '/js/main.js')
    })

    // client side IMAGES
    app.get('/images/pondOne.png', (request, response) => {
        response.sendFile(__dirname + '/images/pondOne.png')
    })

    app.get('/images/pondTwo.png', (request, response) => {
        response.sendFile(__dirname + '/images/pondTwo.png')
    })

    // API Request ROUTE
    app.get('/api/:name', (request,response) => {
        const plantName = request.params.name.toLowerCase()
        // get the parameter from the URL ^
        infoCollection
            .find({ commonName: plantName }).toArray()
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

})
.catch(error => console.error(error))

// use Heroku Environment PORT
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})