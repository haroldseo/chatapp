import React, { Component } from 'react';
import { Link } from 'react-router-dom'


class Home extends Component {
	render() {
		return (
			<div className='Home'>
				<div className="jumbotron">
					<h1 className="display-3">ChatApp</h1>
					<p className="lead">A chatting app, for instant communications on electronic devices. ChatApp users can communicate with all other users in a global chatroom, private 1-on-1, or our very own ChatBot.</p>
					<hr className="my-4"/>
					<p className="lead">
						<Link className="btn btn-primary btn-lg" to="/signup">Sign Up Now</Link>
					</p>
				</div>
			</div>
		)
	}
}

export default Home