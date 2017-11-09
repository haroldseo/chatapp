import React, { Component } from 'react';
import clientAuth from '../clientAuth'

class LogIn extends Component {
	state = {
		fields: { email: '', password: ''}
	}

	onInputChange(evt) {
		this.setState({
			fields: {
				...this.state.fields,
				[evt.target.name]: evt.target.value
			}
		})
	}

	onFormSubmit(evt) {
		evt.preventDefault()
		clientAuth.logIn(this.state.fields).then(user => {
			this.setState({ fields: { email: '', password: '' } })
			if(user) {
				this.props.onLoginSuccess(user)
				this.props.history.push('/')
			}
		})
	}
	
	render() {
		const { email, password } = this.state.fields
		return (
			<div className='LogIn'>
				<h1>Log In</h1>
				<br/>
				<form onChange={this.onInputChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
					<div class="form-group">
						<input type="text" className="form-control" placeholder="Email" name="email" value={email} />
					</div>
					<div class="form-group">
						<input type="password" className="form-control" placeholder="Password" name="password" value={password} />
					</div>
					<button className="btn btn-primary">Log In</button>
				</form>
			</div>
		)
	}
}

export default LogIn