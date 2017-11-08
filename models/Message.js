const
    mongoose = require('mongoose'),
    messageSchema = new mongoose.Schema({
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        body: {type: String}
    }, {timestamps: true})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message