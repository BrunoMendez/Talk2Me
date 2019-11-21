let express = require("express");
let morgan = require("morgan");
var cookieParser = require('cookie-parser');
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let session = require('express-session');
let { AdminList } = require('./admin-model');
let { ListenerList } = require('./listener-model');
let { RoomList } = require('./room-model');
const { DATABASE_URL, PORT } = require('./config');

let app = express();
let router = express.Router();
mongoose.Promise = global.Promise;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false,
	cookie: { maxAge: 8*60*60*1000 }
}));
app.use('/', router);


router.get('/', function (req, res, next) {
	if (req.session && req.session.userId && !req.session.isAdmin) {
		res.render('listener', {name : req.session.name});
	} else if(req.session && req.session.userId && req.session.isAdmin) {
		res.render('admin');
	} else {
		res.render('index');
	}
});

router.get('/login', function (req, res, next) {
	if (req.session && req.session.userId && !req.session.isAdmin) {
		res.render('listener', {name : req.session.name});
	} else if(req.session && req.session.userId && req.session.isAdmin) {
		res.render('admin');
	} else {
		res.render('login');
	}
});

router.get('/admin-homepage', function (req, res, next) {
	if (req.session && req.session.userId && req.session.isAdmin) {
		res.render('admin');
	} else {
		res.redirect('/');
	}
});

router.get('/listener-homepage', function (req, res, next) {
	if (req.session && req.session.userId && !req.session.isAdmin) {
		res.render('listener', {name : req.session.name});
	} else {
		res.redirect('/');
	}
});

router.get('/chat/:id', function (req, res, next) {
	RoomList.get(req.params.id)
		.then(room => {
			if (!room) {
				res.redirect('/');
			} else if (req.session && !req.session.isAdmin && req.session.name) {
				res.render('chat', {roomId: req.params.id, isListener: true, name: req.session.name});
			} else{
				res.render('chat', {roomId: req.params.id, isListener: false, name: "anonymous"});
			}
		})
		.catch(err => {
			res.redirect('/');
		})
});

router.get('/logout', function (req, res, next) {
	if (req.session) {
		console.log(req.session);
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				console.log(req.session);
				return res.redirect('/');
			}
		});
	}
});

app.get('/user-name', function(req, res) {
	if (req.session && req.session.name) {
		return res.status(200).json({
			status: 200,
			name: req.session.name
		});
	}
	return res.status(404).json({
		status: 404,
		message: "Session data not found!"
	});
})

app.delete('/leave-chat/:id', function(req, res) {
	RoomList.removeOne(req.params.id)
	.then(chat =>{
		return res.status(200).json({
			message: "Deleted!",
			status: 200
		});
	})
	.catch(err => {
		res.statusMessage = "Something went wrong with the DB. Try again later.";
		return res.status(500).json({
			status: 500,
			message: "Something went wrong with the DB. Try again later."
		});
	});
})

app.get('/get-messages/:id', function(req, res) {
	RoomList.get(req.params.id)
		.then(chat => {
			return res.status(200).json({
				messages: chat.messages,
				status: 200
			})
		})
		.catch(err => {
			return res.status(500).json({
				message: "Something went wrong with the DB",
				status: 500
			})
		})
});

app.post('/add-message/:id', function(req,res) {

	RoomList.pushMessage(req.params.id, req.body)
		.then(chat => {
			return res.status(200).json({
				message: chat,
				status: 200
			})
		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({
				message: "Something went wrong with the DB",
				status: 500
			})
		})
});

app.get('/find-chat', function(req, res) {
	RoomList.getActive()
		.then(chat =>{
			res.redirect('/chat/' + chat._id);
		})
		.catch(err =>{
			res.redirect('/');
		});
});

app.delete('/remove-chats', function(req, res) {
	RoomList.removeAll()
		.then(chat =>{
			return res.status(200).json({
				message: "Deleted!",
				status: 200
			});
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				status: 500,
				message: "Something went wrong with the DB. Try again later."
			});
		});
})

app.post('/new-chat', function(req, res) {
	if(!req.session) {
		res.redirect('/');
	}
	let currentTime = new Date();
	let initalMessage ={
		message: "Chat open",
		isListener: true,
		time: currentTime
	}
	let newChat = {
		listener: req.session.name,
		startDate: currentTime,
		messages: [initalMessage],
		isActive: true
	}
	RoomList.new(newChat)
		.then(chat =>{
			res.redirect('/chat/' + chat._id);
		})
		.catch(err => {
			res.redirect('/');
		})
});

app.post('/admin-register', function (req, res) {
	let email = req.body.email;
	let password = req.body.password;
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;

	let newAdmin = {
		email: email,
		password: password,
		firstName: firstName,
		lastName: lastName
	}
	AdminList.register(newAdmin)
		.then(admin => {
			return res.status(200).json({
				message: "Registered!",
				status: 200
			});
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				status: 500,
				message: "Something went wrong with the DB. Try again later."
			})
		});
});

app.post('/admin-login', function (req, res) {
	let email = req.body.email;
	let password = req.body.password;

	AdminList.login(email, password, function (err, user) {
		if (err) {
			if (err.status === 401) {
				res.statusMessage = "User not found";
				return res.status(401).json({
					status: 401,
					message: "User not found"
				});
			}
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				status: 500,
				message: "Something went wrong with the DB. Try again later."
			})
		}
		if (user) {
			console.log(req.session);
			req.session.userId = user._id;
			req.session.isAdmin = true;
			req.session.name = user.firstName;
			return res.status(200).json({
				message: "Logged in",
				status: 200
			});
		} else {
			return res.status(403).json({
				message: "Wrong password",
				status: 403
			});
		}
	});
})

app.post('/listener-register', function (req, res) {
	let email = req.body.email;
	let password = req.body.password;
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;

	let newListener = {
		email: email,
		password: password,
		firstName: firstName,
		lastName: lastName
	}
	ListenerList.register(newListener)
		.then(listener => {
			return res.status(200).json({
				message: "Registered!",
				status: 200
			});
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				status: 500,
				message: "Something went wrong with the DB. Try again later."
			})
		});
});

app.post('/listener-login', function (req, res) {
	let email = req.body.email;
	let password = req.body.password;

	ListenerList.login(email, password, function (err, user) {
		if (err) {
			if (err.status === 401) {
				res.statusMessage = "User not found";
				return res.status(401).json({
					status: 401,
					message: "User not found"
				});
			}
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				status: 500,
				message: "Something went wrong with the DB. Try again later."
			})
		}
		if (user) {
			req.session.userId = user._id;
			req.session.name = user.firstName;
			req.session.isAdmin = false;
			console.log(req.session);
			return res.status(200).json({
				message: "Logged in",
				status: 200
			});
		} else {
			return res.status(403).json({
				message: "Wrong password",
				status: 403
			});
		}
	});
})

let server;

function runServer(port, databaseUrl) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, response => {
			if (response) {
				return reject(response);
			}
			else {
				server = app.listen(port, () => {
					console.log("App is running on port " + port);
					resolve();
				})
					.on('error', err => {
						mongoose.disconnect();
						return reject(err);
					})
			}
		});
	});
}

function closeServer() {
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close(err => {
					if (err) {
						return reject(err);
					}
					else {
						resolve();
					}
				});
			});
		});
}

runServer(PORT, DATABASE_URL)
	.catch(err => {
		console.log(err);
	});

module.exports = { app, runServer, closeServer };
