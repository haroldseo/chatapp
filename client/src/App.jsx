import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import clientAuth from './clientAuth'

import NavBar from './NavBar'
import LogIn from './views/LogIn'
import LogOut from './views/LogOut'
import SignUp from './views/SignUp'
import Users from './views/Users'
import Home from './views/Home'
import ChatRoom from './views/ChatRoom'
import GlobalChat from './views/GlobalChat'

class App extends Component {
	state = { currentUser: clientAuth.getCurrentUser() }

	componentDidMount() {
		this.setState({ currentUser: clientAuth.getCurrentUser() })
	}

	onLoginSuccess(user) {
		this.setState({ currentUser: clientAuth.getCurrentUser() })
	}

	logOut() {
		clientAuth.logOut()
		this.setState({ currentUser: null })
	}
	
	render() {
		const { currentUser } = this.state
		return (
			<div className='App'>
				
				<NavBar currentUser={currentUser} />
				<br/>
				<Switch>

					<Route path="/login" render={(props) => {
						return <LogIn {...props} onLoginSuccess={this.onLoginSuccess.bind(this)} />
					}} />

					<Route path="/logout" render={(props) => {
						return <LogOut onLogOut={this.logOut.bind(this)} />
					}} />

					<Route path="/signup" render={(props) => {
						return <SignUp {...props} onSignUpSuccess={this.onLoginSuccess.bind(this)} />
					}} />

					<Route path="/users" render={(props) => {
						return currentUser
							? <Users {...props} currentUser={currentUser} />
							: <Redirect to="/login" />
					}} />

					<Route path="/chat/:id" render={(props) => {
						return currentUser
							? <ChatRoom {...props} currentUser={currentUser}/>
							: <Redirect to="/login" />
					}} />

					<Route exact path="/chat" render={() => {
						return currentUser
							? <GlobalChat currentUser={currentUser}/>
							: <Redirect to="/login" />
					}} />
					
					<Route path="/" component={Home} />

				</Switch>
			</div>
		)
	}
}

export default App