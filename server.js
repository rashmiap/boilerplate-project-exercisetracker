require('dotenv').load();

const express = require('express')
const port = process.env.PORT || 3000
const app = express()

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const shortid = require('shortid')

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
// const dbURI = 'mongodb://localhost:27017/exercisedb'
const dbURI = process.env.DBCONNECT

const createUser = (user, res) => {
  MongoClient.connect(dbURI, (err, conn) => {
    if (err) throw err
    else {
      const data = conn.db("wme-exercisedb")
      data.collection("journal").findOne({ 'username': user }, (err, doc) => {
      if (doc != null) { 
        res.send(`username "${user}" already exists`) 
      } 
      else {
        let record = {
          username: user,
          _id: shortid.generate(),
          timestamp: new Date(),
        }
        data.collection("journal").insertOne(record, (err, doc) => {
          if (err) throw err;
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
  const { userId, description, duration } = exercise
  MongoClient.connect(dbURI, (err, conn) => {
    if (err) throw err
    else {
      const data = conn.db("wme-exercisedb");
      data.collection("journal").findOne({ '_id': userId }, (err, doc) => {
        if (err) throw err
        
        if (doc === null) {
          res.send(`ERROR: userID "${userId}" does not exist`)
        }
        else {
          const user = doc.username
          // Auto-popluate date field with current date
          if (exercise.date === '') {
            var exerciseDate = new Date();
            var exerciseDate = exerciseDate.toISOString().slice(0, 10);
          } else { var exerciseDate = exercise.date }
          let workout = {
            description: description,
            duration: duration,
            date: exerciseDate,
          }
          data.collection("journal").update({ _id: userId }, { $push: { log: workout } }, (err, doc) => {
            if (err) throw err;
            let workout = {
              username: user,
              description: description,
              duration: duration,
              _id: userId,
              date: exerciseDate,
            }
            res.send(workout)

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
      const data = conn.db("wme-exercisedb");
      data.collection("journal").find()
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

const displayUser = (userId, startDate, endDate, limit, res) => {
  MongoClient.connect(dbURI, (err, conn) => {
    if (err) throw err
    else {
      const data = conn.db("wme-exercisedb");
      const userData = data.collection("journal").find({"_id": userId})
      userData.toArray((err, results) => {
        if (err) throw err

        if (results.length < 1) {
          res.json({ ERROR: "User not found in the database." })
        } else {
          var logEntries = []
          var displayList = results.map(result => {
            if (result.log === undefined) {
              res.send({ ERROR: "There are no activity records for this user " })
            } else {
                if (startDate !== '' && endDate !== '') {
                  var log = result.log.filter(activity => { return activity.date >= startDate && activity.date <= endDate })
                } else {
                  var log = result.log
                }

                if (limit > '') {
                  var loopLength = log.length - (log.length - limit)
                } else {
                  var loopLength = log.length
                }
                for (i = 0; i < loopLength; i++) {
                  logEntries.push(log[i])
                }

                return {
                  "username": result.username,
                  "_id": result._id,
                  "count": logEntries.length,
                  "log": logEntries,
                }
              }
          })

          try {
              if (logEntries.length < 1) {
                res.send({ERROR: "There are no activity records in the specified dates "})
              } else { 
                  res.send(displayList) 
              }
          }
          finally {
            return
          }
        }
      })

      conn.close();
    }
  })
}

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
  addExercise(workout, res)
});

app.get('/api/exercise/users/', (req, res) => {
  listUsers(res);
})

app.get('/api/exercise/log', (req, res) => {
  var { userId, startDate, endDate, limit } = req.query
  displayUser(userId, startDate, endDate, limit, res);
})



// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
    
  res.status(errCode).type('txt')
    .send(errMessage)
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})
