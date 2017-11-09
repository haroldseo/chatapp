import React, { Component } from 'react';
import axios from 'axios';

class Users extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newUser: '',
            usersList: []
		}
	}
	
	componentDidMount() {
		axios.get('/api/users')
			.then(res => res.data)
			.then(users => {
				console.log(users)
				this.setState({
					...this.state,
					usersList: users.filter((user) => user._id !== this.props.currentUser._id)
				})
			})
	}

	chatWith(_id) {
		this.props.history.push(`/chat/${_id}`)
	}
    
    render(){
        return (
            <div className="Users">
                <h1>All Users</h1>
				<ul className="list-group">
					{this.state.usersList.map((user, index) => {
                        return (
                            <div>
								<li key={index} className="list-group-item d-flex justify-content-between align-items-center">
									{user.name} <button onClick={this.chatWith.bind(this, user._id)} type="button" class="btn btn-outline-primary">Chat</button>
								</li>
							</div>
                        )
                    })}
				</ul>
			</div>
        );
    }
}

export default Users;