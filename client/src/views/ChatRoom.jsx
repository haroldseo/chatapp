import React, { Component } from 'react';
import io from 'socket.io-client';

class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newMessage: {
                room: props.match.params.id,
                sender: props.currentUser, 
                body: '',
            },
            messages: []
        }
    }

    componentDidMount() {
        this.socketio = io();
        this.socketio.emit('CONNECT_TO_ROOM', this.props.match.params.id)
        this.socketio.on('RECEIVE_MESSAGE', (data) => {
            this.addMessage(data)
        })
        this.socketio.emit('FETCH_MESSAGES')
        this.socketio.on('ROOM_MESSAGES_RECEIVED', (recentMessages) => {
            this.setState({ messages: recentMessages })
            this.scrollToBottom();
        })
    }

    componentWillUnmount() {
        // disconnect from socket.io when leaving the chat window
        this.socketio.emit('LEAVE_ROOM', this.props.match.params.id)
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
            room: this.props.match.params.id,
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
                <h3 className="chatroom">{this.state.newMessage.sender.name}'s Chat Room</h3>
                <div className="messages">
                    {this.state.messages.map((message, index) => {
                        return (this.props.currentUser._id === message.sender._id
                            ?   (<div id="chat-messages" className="my-message">
                                    <div key={index} id="chat-messages-content"><span id="content"><span id="sender">{message.sender.name}</span>: {message.body}</span></div>
                                </div>)
                            :   (<div id="chat-messages">
                                    <div key={index} id="chat-messages-content"><span id="content"><span id="sender">{message.sender.name}</span>: {message.body}</span></div>
                                </div>)
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

export default ChatRoom;