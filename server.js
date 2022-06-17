const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000

const MongoClient = require('mongodb').MongoClient
// allows us to make connections to mongodb ^
const connectionString = 'mongodb+srv://bazusername:bazpassword@cluster0.wgff3.mongodb.net/?retryWrites=true&w=majority'
// mongodb connection string ^

app.use(cors())
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

    app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
    })

    // app.get('/css/styles.css', (request, response) => {
    // response.sendFile(__dirname + '/css/styles.css')
    // })

    // app.get('/js/main.js', (request, response) => {
    // response.sendFile(__dirname + '/js/main.js')
    // })

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


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})