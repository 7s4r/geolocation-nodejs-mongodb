var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    config = require('./config'),
    restful = require('node-restful'),
    mongoose = restful.mongoose

var app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json({type:'application/vnd.api+json'}))
app.use(methodOverride())

// Connect to Mongo db
mongoose.connect(config.db, function(err) {
  if (err) { throw err }
})

var zone = app.zone = restful.model('zone', mongoose.Schema({
    id_firm: { type: 'number', required: true },
    trade: { type: 'string', required: true },
    lng: { type: 'string' },
    lat: { type: 'string' },
    radius: { type: 'number' },
  }))
  .methods(['get', 'post', 'put', 'delete'])

zone.register(app, '/zones')

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
