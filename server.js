require('dotenv').load();

const express = require('express')
const port = process.env.PORT || 3000
const app = express()

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const dbURI = 'mongodb://localhost:27017/exercisedb'

const createUser = (doc) => {
  MongoClient.connect(dbURI, (err, conn) => {
    if (err) {
      throw err
    } else {
      const data = conn.db("exercisedb");
      data.collection("journal").insertOne(doc, (err, res) => {
        if (err) throw err;
        conn.close();
      });
    }
  })
}

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user/', (req, res) => {
  // var { search, offset } = req.query
  // let record = {
  //   search: search,
  //   offset: offset,
  //   timestamp: new Date(),
  // }
  // createUser(record);
  console.log(req.query)
  
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})
