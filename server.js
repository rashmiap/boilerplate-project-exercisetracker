require('dotenv').load();

const express = require('express')
const port = process.env.PORT || 3000
const app = express()

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const shortid = require('shortid')

// const cors = require('cors')

// const mongoose = require('mongoose')
// mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track')

// app.use(cors())

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const dbURI = 'mongodb://localhost:27017/exercisedb'

const createUser = (user, res) => {
  MongoClient.connect(dbURI, (err, conn) => {
    if (err) throw err
    else {
      const data = conn.db("exercisedb");
      data.collection("users").findOne({ 'username': user }, (err, doc) => {
      if (doc != null) { 
        res.send(`username "${user}" already exists`) 
      } 
      else {
        let record = {
          username: user,
          _id: shortid.generate(),
          timestamp: new Date(),
          // activities: [],
        }
        data.collection("users").insertOne(record, (err, doc) => {
          if (err) throw err;
          console.log(doc.ops)
          // const { username, _id } = 
          let newUser = {
            username: doc.ops[0].username,
            _id: doc.ops[0]._id
          }
          res.send(newUser)
          conn.close();
        })
      }
    })
    }
  })
}
const addExercise = (exercise, res) => {
  const { userId, description, duration, date } = exercise
  MongoClient.connect(dbURI, (err, conn) => {
    if (err) throw err
    else {
      const data = conn.db("exercisedb");
      data.collection("users").findOne({ '_id': userId }, (err, doc) => {
      if (doc === null) { 
        res.send(`ERROR: userID "${userId}" does not exist`) 
      }
      else {
        data.collection("users").update({_id: userId}, {$push: { activities: exercise } }, (err, doc) => {
        // data.collection("activities").insertOne(exercise, (err, doc) => {
          if (err) throw err;
          console.log(doc[0])
          res.send(doc[0])
          conn.close();
        })
      }    
   })
  }
 })
}

const listUsers = (res) => {
  MongoClient.connect(dbURI, (err, conn) => {
    if (err) { throw err }
    else {
      const data = conn.db("exercisedb");
      data.collection("users").find()
        .toArray((err, results) => {
          var displayList = [];
          for (let i = 0; i < results.length; i++) {
            let itemDict = {
              username: results[i].username,
              _id: results[i]._id,
            }
            displayList.push(itemDict);
          }

          res.send(displayList);
        })

      conn.close();
    }
  })
}

const displayUser = (user, res) => {
  MongoClient.connect(dbURI, (err, conn) => {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', dbURI);
      const data = conn.db("exercisedb"),
        collection = data.collection("journal");
      collection.findOne({ 'username': user }, (err, doc) => {
        if (doc != null) {
          let userData = {
            username: doc.username,
            _id: doc._id
          }
          res.send(userData);
        } else {
          res.json({ error: "user not found in the database." });
        }
        conn.close();
      });
    }
  });
}

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user/', urlencodedParser, (req, res) => {
  const { username } = req.body
  createUser(username, res)
});

app.post('/api/exercise/add/', urlencodedParser, (req, res) => {
  let workout = req.body
  console.log(workout)

  addExercise(workout, res)
});

app.get('/api/exercise/users/', (req, res) => {
  listUsers(res);
})



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
