var express = require('express')
var router = express.Router()

/* GET firms listing. */
router.get('/', function(req, res, next) {
  res.json({"error": false, "message": "Hello World"})
})

module.exports = router
