var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var config = require('./config')

var app = express()

function error(status, msg) {
  var err = new Error(msg)
  err.status = status
  return err
}

// Connect to Mongo db
mongoose.connect(config.db)

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api', function(req, res, next){
  var key = req.query['api-key']

  // key isn't present
  if (!key) return next(error(400, 'api key required'))

  // key is invalid
  if (!config.apiKeys.indexOf(key)) return next(error(401, 'invalid api key'))

  // all good, store req.key for route access
  req.key = key
  next()
})

var geolocation = require('./routes/geolocation')
app.use('/api/geolocation', geolocation)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.json({"status": "error", "message": err.message})
})

module.exports = app
