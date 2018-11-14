import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Tooltip, Icon } from '@blueprintjs/core';

require('./searchBar.scss');

const propTypes = {
	queryValue: PropTypes.string.isRequired,
	onQueryChange: PropTypes.func.isRequired,
	operatorValue: PropTypes.string.isRequired,
	onOperatorChange: PropTypes.func.isRequired,
};

const SearchBar = function(props) {
	const operators = ['AND', 'OR', 'ADJ', 'NEAR', 'WITH', 'SAME'];
	return (
		<div className={'search-bar-wrapper'}>
			<div className="pt-control-group pt-large">
				<div className="pt-input-group pt-fill pt-large">
					<Icon icon="search" />
					<input
						placeholder={'Search...'}
						value={props.queryValue}
						onChange={props.onQueryChange}
						className={'pt-input'}
					/>
				</div>
			</div>
			<button className="pt-button pt-intent-primary">Search</button>
			<div className="pt-select pt-large">
				<select value={props.operatorValue} onChange={props.onOperatorChange}>
					{operators.map((item)=> {
						return <option value={item} key={`operator-${item}`}>{item}</option>;
					})}
				</select>
				<Icon icon="double-caret-vertical" />
			</div>
			<Tooltip content="History">
				<Link to={'/history'} className="pt-button pt-large history-button">
					<Icon icon="history" />
				</Link>
			</Tooltip>
		</div>

	);
};

SearchBar.propTypes = propTypes;
export default SearchBar;
