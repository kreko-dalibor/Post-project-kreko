require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')


// Set strictQuery to true (current default)
mongoose.set('strictQuery', true);


const app = express()
const PORT = process.env.PORT || 4000

//database connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to databse!'))

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))


//middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('uploads'))

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}))


app.use((req,res,next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

//set template engene EJS

app.set('view engine', 'ejs')



app.use("", require('./routes/routes'))




app.listen(PORT, (req,res) => {
    console.log(`Server is running on port ${PORT}....`)
});
