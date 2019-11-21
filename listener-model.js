let mongoose = require('mongoose');
let bcrypt = require("bcrypt");
mongoose.Promise = global.Promise;

var ListenerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});

ListenerSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

ListenerSchema.statics.authenticate = function (email, password, callback) {
    Listener.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}

var Listener = mongoose.model('Listener', ListenerSchema);

let ListenerList = {
    login: function (email, password, callback) {
        return Listener.authenticate(email, password, callback);
    },
    register: function (newListener) {
        return Listener.create(newListener)
            .then(listener => {
                return newListener;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    removeOne: function (email) {
        return Listener.remove({email: email})
            .then(listener => {
                return listener;
            })
            .catch(error => {
                throw Error(error);
            });
    }
}

module.exports = { ListenerList };
