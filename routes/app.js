var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index');
});

// add a custom message route from below post request
router.get('/message/:msg', function (req, res, next) {
    res.render('message', {message: req.params.msg});
});

//request from form
router.post('/message', function(req, res, next) {
    var message = req.body.message;
    res.redirect('/message/' + message);
});

module.exports = router;