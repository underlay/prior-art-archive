import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import { Button } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import { postLogin } from 'actions/login';
import queryString from 'query-string';

require('./login.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
};

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		};
		this.onLoginSubmit = this.onLoginSubmit.bind(this);
		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const queryObject = queryString.parse(this.props.location.search);
		if (!this.props.loginData.data && nextProps.loginData.data && nextProps.loginData.data.slug) {
			window.location.href = queryObject.redirect || '/';
		}
	}

	onLoginSubmit(evt) {
		evt.preventDefault();
		this.props.dispatch(postLogin(
			this.state.username.toLowerCase(),
			SHA3(this.state.password).toString(encHex))
		);
	}

	onUsernameChange(evt) {
		this.setState({ username: evt.target.value });
	}

	onPasswordChange(evt) {
		this.setState({ password: evt.target.value });
	}

	render() {
		return (
			<div className={'login'}>
				<Helmet>
					<title>Login</title>
				</Helmet>

				<div className={'container small'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>Login</h1>

							<form onSubmit={this.onLoginSubmit}>
								<InputField
									label={'Username'}
									value={this.state.username}
									onChange={this.onUsernameChange}
								/>
								<InputField
									label={'Password'}
									type={'password'}
									value={this.state.password}
									onChange={this.onPasswordChange}
									// helperText={<Link to={'/password-reset'}>Forgot Password</Link>}
								/>
								<InputField error={this.props.loginData.error}>
									<Button
										name={'login'}
										type={'submit'}
										className={'pt-button pt-intent-primary'}
										onClick={this.onLoginSubmit}
										text={'Login'}
										disabled={!this.state.username || !this.state.password}
										loading={this.props.loginData.isLoading}
									/>
								</InputField>
							</form>
							<div className="details">Username and Password are required only if you need to publish documents.</div>
							<div className="details">If you have been given an SFTP Username and Password before, the same credentials can be used to Login.</div>
							<div className="details">If you do not have a Username and Password, please send your inquiries and request to join at <a href="mailto:priorartarchive@media.mit.edu">priorartarchive@media.mit.edu</a></div>
							{/*<Link to={'/signup'} className={'switch-message'}>Don't have an account? Click to Signup</Link>*/}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Login.propTypes = propTypes;
export default withRouter(connect(state => ({
	loginData: state.login,
}))(Login));
