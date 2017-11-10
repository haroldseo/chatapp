import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.png'

class NavBar extends Component {
	state = {
		menuOpen: false
	}

	toggleMenu() {
		this.setState({menuOpen: !this.state.menuOpen})
	}

	render() {
		const {currentUser} = this.props
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<div className='NavBar'>
				<button onClick={ this.toggleMenu.bind(this)} className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className={`collapse navbar-collapse  ${this.state.menuOpen ? 'show' : '' }`} id="navbarNavAltMarkup">
					{currentUser
						? (
							<span>
								<ul className="navbar-nav mr-auto">
									<li className="nav-item active">
										<Link to="/" className="navbar-brand"><img src={Logo} width="60" height="60" alt=""/></Link>
									</li>
									<li className="nav-item active">
										<Link to="/users" className="nav-link">Users</Link>
									</li>
									<li className="nav-item active">
										<Link to="/chat" className="nav-link">GChat</Link>
									</li>
									<li className="nav-item active">
										<Link to="/chatbot" className="nav-link">ChatBot</Link>
									</li>
									<li className="nav-item active">
										<Link to={`/chat/${currentUser._id}`} className="nav-link">{currentUser.name}</Link>
									</li>
									<li className="nav-item active">
										<Link to="/logout" className="nav-link">Log Out</Link>
									</li>
								</ul>
							</span>
						)
						: (
							<span>
								<ul className="navbar-nav mr-auto">
									<li className="nav-item active">
										<Link to="/" className="navbar-brand">Home</Link>
									</li>
									<li className="nav-item active">
										<Link to="/login" className="nav-link">Log In</Link>
									</li>
									<li className="nav-item active">
										<Link to="/signup" className="nav-link">Sign Up</Link>
									</li>
								</ul>
							</span>
						)
					}
				</div>
				</div>
			</nav>
		)
	}
}

export default NavBar