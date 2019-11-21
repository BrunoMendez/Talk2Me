let mongoose = require('mongoose');
let bcrypt = require("bcrypt");
mongoose.Promise = global.Promise;

var MessageSchema = new mongoose.Schema({
    name: String,
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
    messages: [MessageSchema],
    isActive: {
        type: Boolean,
        required: true
    }
});

var Room = mongoose.model('Room', RoomSchema);

let RoomList = {
    get: function(id) {
        return Room.findOne({ _id: id })
            .then(room => {
                return room;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getActive: function() {
        return Room.findOne({ isActive: true })
            .then(room => {
                return room;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    new: function(room) {
        return Room.create(room)
            .then(room => {
                return room;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    pushMessage: function(id, message) {
        return Room.update({ _id: id }, { $push: { messages: message } });
    },
    pushMessages: function(id, messages) {
        return Room.update({ _id: id }, { $push: { messages: { $each: messages } } });
    },
    turnInactive: function(id) {
        return Room.updateOne({ _id: id }, { isActive: false })
            .then(room => {
                return room;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    removeAll: function() {
        return Room.remove({})
            .then(room => {
                return room;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    removeOne: function(id) {
        return Room.remove({ _id: id })
            .then(room => {
                return room;
            })
            .catch(error => {
                throw Error(error);
            });
    }
}

module.exports = { RoomList };