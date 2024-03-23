const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        maxlength: 32,
    },
    email: {
        type: String,
        required: true,
        maxlength: 100,
    },
    password: {
        type: String,
        required: true,
        maxlength: 100,
    },
    owner: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    ban: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;