const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const db = require('./database')
const {userRouter,movieRouter}=require('./routers')
// main app
const app = express()

// apply middleware
app.use(cors())
app.use(bodyparser.json())

db.connect(err => (
    err?
        console.log('Mysql connection failed :', err.stack) :
        console.log('Mysql connection successful ID :',db.threadId)
))

// main route
const response = (_, res) => res.status(200).send('<h1>REST API JCWM1504</h1>')
app.get('/', response)
app.use('/user', userRouter)
app.use('/movies',movieRouter)
// app.use('/movies')




// bind to local machine
const PORT = 1000
app.listen(PORT, () => `CONNECTED : port ${PORT}`)