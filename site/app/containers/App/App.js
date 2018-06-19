import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';
import Async from 'react-code-splitting';
import Header from 'components/Header/Header';
import { getLogin, getLogout } from 'actions/login';

require('./app.scss');

const About = () => <Async load={import('containers/About/About')} />;
const Contributions = () => <Async load={import('containers/Contributions/Contributions')} />;
const Help = () => <Async load={import('containers/Help/Help')} />;
const History = () => <Async load={import('containers/History/History')} />;
const Landing = () => <Async load={import('containers/Landing/Landing')} />;
const Login = () => <Async load={import('containers/Login/Login')} />;
const NoMatch = () => <Async load={import('containers/NoMatch/NoMatch')} />;
const Search = () => <Async load={import('containers/Search/Search')} />;
const Terms = () => <Async load={import('containers/Terms/Terms')} />;

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
};

class App extends Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
	}
	componentWillMount() {
		this.props.dispatch(getLogin());
	}
	handleLogout() {
		this.props.dispatch(getLogout());
		window.location.href = window.location.origin;
	}

	render() {
		const loginData = this.props.loginData.data || {};
		const initial = loginData.name ? loginData.name[0] : '';
		return (
			<div>
				<Helmet>
					<title>Prior Art Archive</title>
					<meta name="description" content={'Search the world\'s prior art.'} />
					<link rel="icon" type="image/png" sizes="192x192" href={'/icon.png'} />
					<link rel="apple-touch-icon" type="image/png" sizes="192x192" href={'/icon.png'} />
					<meta property={'og:title'} content={'Prior Art Archive'} />
					<meta property={'og:type'} content={'website'} />
					<meta property={'og:description'} content={'Search the world\'s prior art.'} />
					<meta property={'og:url'} content={window.location.origin} />
					<meta property={'og:image'} content={'https://www.priorartarchive.org/icon.png'} />
					<meta property={'og:image:url'} content={'https://www.priorartarchive.org/icon.png'} />
					<meta property={'og:image:width'} content={'500'} />
					<meta name={'twitter:card'} content={'summary'} />
					<meta name={'twitter:site'} content={'@pubpub'} />
					<meta name={'twitter:title'} content={'Prior Art Archive'} />
					<meta name={'twitter:description'} content={'Search the world\'s prior art.'} />
					<meta name={'twitter:image'} content={'https://www.priorartarchive.org/icon.png'} />
					<meta name={'twitter:image:alt'} content={'Icon for Prior Art Archive'} />
				</Helmet>
				<Header
					userName={loginData.name}
					userInitials={initial}
					userSlug={loginData.slug}
					userAvatar={loginData.avatar}
					onLogout={this.handleLogout}
				/>
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route exact path="/about" component={About} />
					<Route exact path="/contributions" component={Contributions} />
					<Route exact path="/help" component={Help} />
					<Route exact path="/history" component={History} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/search" component={Search} />
					<Route exact path="/terms" component={Terms} />
					<Route component={NoMatch} />
				</Switch>
			</div>
		);
	}
}

App.propTypes = propTypes;
export default withRouter(connect(state => ({
	loginData: state.login
}))(App));
