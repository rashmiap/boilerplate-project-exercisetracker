# Exercise Journal API

A REST API that processes exercise activity

### Development
    * Frontend is built using HTML/CSS and is used to demo API functions
    * API is built using Node/Express and handles data creation, updates, and retrieval
    * Backend is a MongoDB document database that stores user and exercise data

### User Stories:
    1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
    2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
    3. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). App will return the user object with added array log and count (total exercise count).
    4. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

### Usage:
Go to API demo app:
[https://wme-exercisetracker.glitch.me/]('https://wme-exercisetracker.glitch.me/')

#### Create a New User
```POST /api/exercise/new-user```

#### Add Exercise
```POST /api/exercise/add```

#### List Users
```GET /api/exercise/users```

#### View Exercise Journal
```GET /api/exercise/log?userId=USERID&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&limit=6

** The date and limit parameters are optional

