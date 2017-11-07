import React, { Component } from 'react';
import io from 'socket.io-client';

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.currentUser.name,
            message: '',
            messages: []
        }
    }
    

    componentDidMount() {
        this.socketio = io();
        this.socketio.on('RECEIVE_MESSAGE', (data) => {
            this.addMessage(data)
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
            ...this.state,
            [evt.target.name]: evt.target.value
        })
    }

    onFormSubmit(evt) {
        evt.preventDefault()
        this.socketio.emit('SEND_MESSAGE', {
            name: this.state.name,
            message: this.state.message
        })
        this.setState({message: ''})
    }
    
    render(){
        return (
            <div>
                <h3 className="global-chatroom">Global Chat</h3>
                <div className="messages">
                    {this.state.messages.map((message, index) => {
                        return (
                            <div key={index}>{message.name}: {message.message}</div>
                        )
                    })}
                </div>
                <form onChange={this.onInputChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
                    <input type="text" placeholder="Message" name="message" value={this.state.message}/>
                    <button>Send</button>
                </form>
            </div>
        );
    }
}

export default Chat;