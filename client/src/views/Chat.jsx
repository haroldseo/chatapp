import React, { Component } from 'react';
import io from 'socket.io-client';

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newMessage: {
                sender: props.currentUser._id,
                body: '',
            },
            messages: []
        }
    }
    

    componentDidMount() {
        this.socketio = io();
        this.socketio.on('RECEIVE_MESSAGE', (data) => {
            this.addMessage(data)
        })
        this.socketio.emit('FETCH_MESSAGES')
        this.socketio.on('RECENT_MESSAGES_RECEIVED', (recentMessages) => {
            this.setState({ messages: recentMessages })
        })
    }

    componentWillUnmount() {
        // disconnect from socket.io when leaving the chat window
        this.socketio.disconnect()
    }

    addMessage(data) {
        console.log(data)
        this.setState({messages: [...this.state.messages, data]})
        console.log(this.state.messages)
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
        this.setState({newMessage: {sender: this.props.currentUser._id, body: ''} })
    }
    
    render(){
        return (
            <div>
                <h3 className="global-chatroom">Global Chat</h3>
                <div className="messages">
                    {this.state.messages.map((message, index) => {
                        return (
                            <div key={index}>{message.sender}: {message.body}</div>
                        )
                    })}
                </div>
                <form onChange={this.onInputChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
                    <input type="text" placeholder="Message" name="body" value={this.state.newMessage.body}/>
                    <button>Send</button>
                </form>
            </div>
        );
    }
}

export default Chat;