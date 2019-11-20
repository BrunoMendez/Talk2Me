let express = require( "express" );
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let bcrypt = require("bcrypt");
let session = require('express-session')
let router = express.Router();
let { AdminList } = require('./admin-model');
const { DATABASE_URL, PORT } = require( './config' );

let app = express();
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

app.use( express.static( __dirname + "/public" ) );

app.use( morgan( "dev" ) );
app.use(bodyParser.json());
app.use('/', router);
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false
}))


// Middleware para checar que este logged in
var requiresLogin = function (req, res, next) {
	if (req.session && req.session.userId) {
		console.log(req);
	  return next();
	} else {
	  var err = new Error('You must be logged in to view this page.');
	  err.status = 401;
	  return next(err);
	}
  }

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/admin-login', function(req, res) {
	res.sendFile(path.join(__dirname+'/admin-login/index.html'));
});

router.get('/listener-login', function(req, res) {
	res.sendFile(path.join(__dirname+"/listener-login/index.html"));
});

router.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname+"/login/index.html"));
});

router.get('/admin-homepage', requiresLogin, function(req, res) {
	res.sendFile(path.join(__dirname+"/admin-homepage/index.html"));
});

router.get('/listener-homepage', requiresLogin, function(req, res) {
	res.sendFile(path.join(__dirname+"/listener-homepage/index.html"));
});

router.get('/chat', function(req, res) {
	res.sendFile(path.join(__dirname+"/chat/index.html"));
});

router.get('/logout', function(req, res, next) {
	if (req.session) {
		req.session = null;
	}
	res.redirect('/');
	console.log(req.session);
  });

app.post('/admin-register', function(req, res) {
	let email = req.body.email;
	let password = req.body.password;

	let newAdmin = {
		email: email,
		password: password
	}
	AdminList.post(newAdmin)
        .then(admin => {
            return res.status(200).json({
                message: "Registered!",
                status:200
            });
        })
        .catch( err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
        });
});

app.post('/admin-login', function(req, res) {
	let email = req.body.email;
	let password = req.body.password;

	AdminList.login(email, password, function(err, user) {
		if (err) {
			if (err.status === 401) {
				res.statusMessage = "User not found";
					return res.status( 401 ).json({
					status : 401,
					message : "User not found"
				});
			}
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		}
		if (user) {
			req.session.userId = user._id;
			console.log(req);
			console.log(user);
			return res.status(200).json({
				message: "Logged in",
				status:200
			});
		} else {
			return res.status(403).json({
				message: "Wrong password",
				status:403
			});
		}
	});
})

app.post('/listener-register', function(req, res) {
	let email = req.body.email;
	let password = req.body.password;
	let firstName = req.body.name;
	let lastName = req.body.lastName;

	let newAdmin = {
		email: email,
		password: password,
		firstName: firstName,
		lastName: lastName
	}
	AdminList.post(newAdmin)
        .then(admin => {
            return res.status(200).json({
                message: "Registered!",
                status:200
            });
        })
        .catch( err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
        });
});

app.post('/listener-login', function(req, res) {
	let email = req.body.email;
	let password = req.body.password;

	AdminList.login(email, password, function(err, user) {
		if (err) {
			if (err.status === 401) {
				res.statusMessage = "User not found";
					return res.status( 401 ).json({
					status : 401,
					message : "User not found"
				});
			}
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		}
		if (user) {
			req.session.userId = user._id;
			console.log(req);
			console.log(user);
			return res.status(200).json({
				message: "Logged in",
				status:200
			});
		} else {
			return res.status(403).json({
				message: "Wrong password",
				status:403
			});
		}
	});
})

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true}, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };
