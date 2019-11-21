let mongoose = require('mongoose');
let bcrypt = require("bcrypt");
mongoose.Promise = global.Promise;

var MessageSchema = new mongoose.Schema({
    message: String,
    isListener: Boolean,
    time: Date,
});

var RoomSchema = new mongoose.Schema({
    listener: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    messages: [MessageSchema]
});

var Room = mongoose.model('Room', RoomSchema);

let RoomList = {
    get: function (id) {
        return Room.findById(id, function (err, res) {
        });
    }
}

module.exports = { RoomList };
