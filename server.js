const
	dotenv = require('dotenv').load(),
	express = require('express'),
	app = express(),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/chatapp',
	PORT = process.env.PORT || 3001,
	http = require('http'),
    httpServer = http.Server(app),
    socketio = require('socket.io'),
	io = socketio(httpServer),
	Message = require('./models/Message'),
	usersRoutes = require('./routes/users.js')

mongoose.connect(MONGODB_URI, (err) => {
	console.log(err || `Connected to MongoDB.`)
})

app.use(express.static(`${__dirname}/client/build`))
app.use(logger('dev'))
app.use(bodyParser.json())

app.get('/api', (req, res) => {
	res.json({message: "API root."})
})

app.use('/api/users', usersRoutes)

io.on('connection', (socketio) => {
    console.log('A user connected ' + socketio.id)
    socketio.on('SEND_MESSAGE', (data) => {
		Message.create(data, (err, message) => {
			console.log('this is the message', message)
			io.emit('RECEIVE_MESSAGE', message)
		})
	})
	
	socketio.on('FETCH_MESSAGES', () => {
		Message.find({}, (err, messages) => {
			socketio.emit('RECENT_MESSAGES_RECEIVED', messages)
		})
	})
})

app.use('*', (req, res) => {
	res.sendFile(`${__dirname}/client/build/index.html`)
})

httpServer.listen(PORT, (err) => {
	console.log(err || `Server running on port ${PORT}.`)
})