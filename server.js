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
	apiai = require('apiai')(process.env.APIAI_TOKEN),
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

app.get('/users', (req, res) => {
	User.find({}, (err, users) => {
		res.json(users)
	})
})

io.on('connection', (socketio) => {
	console.log('A user connected ' + socketio.id)
	
	socketio.on('CONNECT_TO_ROOM', (roomId) => {
		socketio.join(roomId)
		Message.find({room: roomId}).populate('sender').exec((err, messages) => {
			io.to(roomId).emit('ROOM_MESSAGES_RECEIVED', messages)
		})
	})

	socketio.on('LEAVE_ROOM', (roomId) => {
		socketio.leave(roomId)
	})

	socketio.on('CONNECT_TO_BOT_ROOM', (botRoom) => {
		socketio.join(botRoom)
	})

	socketio.on('SEND_MESSAGE', (data) => {
		// CHAT BOT RESPONSE:
		let apiaiReq = apiai.textRequest(data.body, {sessionId: process.env.APIAI_SESSION_ID})
		apiaiReq.on('response', (botResponse) => {
			console.log(botResponse.result.fulfillment.speech)
			data.body = botResponse.result.fulfillment.speech

			const chatBotReply = {body: botResponse.result.fulfillment.speech, sender: {name: "Jimi-5000"}}
			if(data.room == 'bot-room') io.emit('RECEIVE_MESSAGE', chatBotReply)
		})
		apiaiReq.on('error', (error) => {
			console.log(error)
		})
		apiaiReq.end()
	
		Message.create(data, (err, message) => {
			message.populate('sender', (err) => {
				if(message.room) io.to(message.room).emit('RECEIVE_MESSAGE', message)
				else io.to('global').emit('RECEIVE_MESSAGE', message)
			})
			
		})
	})
	
	socketio.on('FETCH_MESSAGES', () => {
		Message.find({room: 'global'}).populate('sender').exec((err, messages) => {
			io.to('global').emit('RECENT_MESSAGES_RECEIVED', messages)
		})
	})
})

app.use('*', (req, res) => {
	res.sendFile(`${__dirname}/client/build/index.html`)
})

httpServer.listen(PORT, (err) => {
	console.log(err || `Server running on port ${PORT}.`)
})