process.env['NODE_CONFIG_DIR'] = __dirname + '/config/'
const config = require('config')
const express = require('express')
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const auth = require('./middleware/auth')
const authRoutes = require('./app/routes/auth')
const categoriesRoutes = require('./app/routes/categoriesRoutes')
const subcategoriesRoutes = require('./app/routes/subcategoriesRoutes')
const threadsRoutes = require('./app/routes/threadsRoutes')
const commentsRoutes = require('./app/routes/commentsRoutes')
const dataInitializerRoutes = require('./app/routes/dataInitizialerRoutes')

const port = process.env.PORT || 5000

//Do not show the log when it is test environment
if (config.util.getEnv('NODE_ENV') !== 'test') {
  //Use morgan to log at command line
  app.use(morgan('combined'))
}

app.use(bodyParser.json()) //Parse application/json and look for raw text
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(auth)

mongoose.Promise = global.Promise

let uristring =
  process.env.MONGODB_URI ||
  process.env.MONGOHQ_URL ||
  config.get('DBHost')

//DB options for testing
let options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
}

//Connect to MongoDB
mongoose.connect(uristring, options)
  .then(() => console.log('Mongo DB connected...'))
  .catch(err => console.log(err))
mongoose.Promise = global.Promise

app.use('/', authRoutes)
app.use('/api/initializeData', dataInitializerRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/subcategories', subcategoriesRoutes)
app.use('/api/threads', threadsRoutes)
app.use('/api/comments', commentsRoutes)

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')))

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = app //For testing