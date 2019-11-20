let mongoose = require('mongoose');
let bcrypt = require("bcrypt");
mongoose.Promise = global.Promise;

var AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
});

AdminSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

AdminSchema.statics.authenticate = function (email, password, callback) {
    Admin.findOne({ email: email })
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

var Admin = mongoose.model('Admin', AdminSchema);

let AdminList = {
    login: function (email, password, callback) {
        return Admin.authenticate(email, password, callback);
    },
    post: function (newAdmin) {
        return Admin.create(newAdmin)
            .then(admin => {
                return newAdmin;
            })
            .catch(error => {
                throw Error(error);
            });
    }
}

module.exports = { AdminList };
