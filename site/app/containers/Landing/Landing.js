import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import SearchBar from 'components/SearchBar/SearchBar';

require('./landing.scss');

const propTypes = {
	history: PropTypes.object.isRequired,
};

class Landing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emptyQueryWarning: false,
			searchQuery: '',
			operator: 'AND',
		};
		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
		this.handleOperatorChange = this.handleOperatorChange.bind(this);
	}

	handleSearchChange(evt) {
		this.setState({
			searchQuery: evt.target.value,
			emptyQueryWarning: false,
		});
	}

	handleSearchSubmit(evt) {
		evt.preventDefault();
		if (!this.state.searchQuery) {
			return this.setState({ emptyQueryWarning: true });
		}
		const operatorString = this.state.operator !== 'AND' ? `&operator=${this.state.operator}` : '';
		return this.props.history.push(`/search?q=${encodeURIComponent(this.state.searchQuery)}${operatorString}`);
	}

	handleOperatorChange(evt) {
		this.setState({ operator: evt.target.value });
	}

	render() {
		return (
			<div className={'landing-wrapper'}>
				<div className={'container landing'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>Prior Art Archive</h1>
							{/* <img src="/logo.png" alt="Priot Art Archive" /> */}
							<form onSubmit={this.handleSearchSubmit}>
								<SearchBar
									queryValue={this.state.searchQuery}
									onQueryChange={this.handleSearchChange}
									operatorValue={this.state.operator}
									onOperatorChange={this.handleOperatorChange}
								/>
							</form>
							{this.state.emptyQueryWarning &&
								<div className={'warning'}>Enter keywords and then click Search</div>
							}
							<div className="terms-link">
								<Link to={'/terms'}>Terms of Use & Privacy Policy</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Landing.propTypes = propTypes;
export default withRouter(Landing);
