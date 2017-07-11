var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
    content: {type: String, required: true},
    //field filled with user object
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});


//function to hook(run) every time a message is deleted to also clear it from users
schema.post('remove', function (message) {
    User.findById(message.user, function (err, user) {
        user.messages.pull(message);
        user.save();
    });
});

module.exports = mongoose.model('Message', schema);