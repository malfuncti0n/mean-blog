var express = require('express');
var router = express.Router();

//just render index so angular take over
router.get('/', function (req, res, next) {
    res.render('index');
});

module.exports = router;
