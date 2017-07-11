var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

//require database models
var User = require('../models/user');
var Message = require('../models/message');

//get all messages
router.get('/', function (req, res, next) {
    Message.find()
        //because messages and users has relationship we can populate needed user fileds
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});

//check for authentication . user need to singin to have access to the other routes
router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        next();
    })
});

//create a message
router.post('/', function (req, res, next) {
    //decode token to get users id
    var decoded = jwt.decode(req.query.token);

    //mongoose search
    User.findById(decoded.user._id, function (err, user) {
        //mongoose error
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        //we have message and user id
        var message = new Message({
            content: req.body.content,
            user: user
        });
        message.save(function (err, result) {
            //if we have error on saving
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            //all good. message created
            user.messages.push(result);
            user.save();
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });
    });
});
//update an existed message
router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function (err, message) {
        //general mongoose error
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        //no message find
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }
        //try to update a message of onother user
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        message.content = req.body.content;
        message.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            //message updated
            res.status(200).json({
                message: 'Updated message',
                obj: result
            });
        });
    });
});
//delete a message
router.delete('/:id', function (req, res, next) {
    //get user id from token
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function (err, message) {
        //general mongoose error
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        //no such message
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }
        //message dont belong to user
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        //delete the message
        message.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }//all good
            res.status(200).json({
                message: 'Deleted message',
                obj: result
            });
        });
    });
});

module.exports = router;