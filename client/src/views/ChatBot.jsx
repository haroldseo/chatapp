import React, { Component } from 'react';
import io from 'socket.io-client';

class ChatBot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newMessage: {
                room: 'bot-room',
                sender: props.currentUser, 
                body: '',
            },
            messages: []
        }
    }

    componentDidMount() {
        this.socketio = io();
        this.socketio.emit('CONNECT_TO_BOT_ROOM', this.state.newMessage.room)
        this.socketio.on('RECEIVE_MESSAGE', (data) => {
            this.addMessage(data)
        })
    }

    componentWillUnmount() {
        // disconnect from socket.io when leaving the chat window
        this.socketio.emit('LEAVE_BOT_ROOM', this.state.newMessage.room)
        this.socketio.disconnect()
    }

    addMessage(data) {
        console.log(data)
        this.setState({messages: [...this.state.messages, data]})
        console.log(this.state.messages)
        this.scrollToBottom();
    }

    onInputChange(evt) {
        this.setState({
            newMessage: {
                ...this.state.newMessage,
                [evt.target.name]: evt.target.value
            }
        })
    }

    onFormSubmit(evt) {
        evt.preventDefault()
        this.socketio.emit('SEND_MESSAGE', this.state.newMessage)
        this.setState({newMessage: {
            room: 'bot-room',
            sender: this.props.currentUser,
            body: ''
        }})
    }

    scrollToBottom() {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    }

    render(){
        return (
            <div className="chat-container">
                <h3 className="bot-chatroom">Bot's Chat Room</h3>
                <div className="messages">
                    {this.state.messages.map((message, index) => {
                        return (
                            <div id="chat-messages">
                                <div key={index} id="chat-messages-content"><span id="content"><span id="sender">{message.sender.name}</span>: {message.body}</span></div>
                            </div>
                        )
                    })}
                    <div ref={(el) => {this.messagesEnd = el}}>
                    </div>
                </div>
                <br/>
                <form onChange={this.onInputChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
                    <div>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Message" name="body" value={this.state.newMessage.body}/>
                            <span className="input-group-btn">
                            <button className="btn btn-primary">Send</button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default ChatBot;