import React, { Component } from 'react';
import clientAuth from '../clientAuth'

class SignUp extends Component {
	state = {
		fields: { name: '', email: '', password: ''}
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
		clientAuth.signUp(this.state.fields).then(user => {
			this.setState({ fields: { name: '', email: '', password: '' } })
			if(user) {
				this.props.onSignUpSuccess(user)
				this.props.history.push('/')
			}
		})
	}
	
	render() {
		const { name, email, password } = this.state.fields
		return (
			<div className='SignUp'>
				<h1>Sign Up</h1>
				<br/>
				<form onChange={this.onInputChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
					<div class="form-group">
						<input type="text" className="form-control" placeholder="Name" name="name" value={name} />
					</div>
					<div class="form-group">					
						<input type="text" className="form-control" placeholder="Email" name="email" value={email} />
					</div>
					<div class="form-group">
						<input type="password" className="form-control" placeholder="Password" name="password" value={password} />
					</div>
					<button className="btn btn-primary">Sign Up</button>
				</form>
			</div>
		)
	}
}

export default SignUp