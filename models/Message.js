const
    mongoose = require('mongoose'),
    messageSchema = new mongoose.Schema({
        sender: {type: String, require: true},
        body: {type: String}
    }, {timestamps: true})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message