import React, { Component } from 'react';
import store from 'store/dist/store.legacy';
import { NonIdealState } from '@blueprintjs/core';

require('./history.scss');

class History extends Component {
	constructor() {
		super();
		this.state = {
			searchHistory: store.get('searchHistory') || []
		};
		this.clearHistory = this.clearHistory.bind(this);
	}
	clearHistory() {
		store.clearAll();
		this.setState({ searchHistory: [] });
	}
	render() {
		const searchHistory = this.state.searchHistory;
		return (
			<div className={'history-wrapper'}>
				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>
							{!!searchHistory.length &&
								<div className={'button-wrapper'}>
									<button className={'pt-button'} onClick={this.clearHistory}>Clear History</button>
								</div>
							}

							<h1>History</h1>
							{!!searchHistory.length &&
								<p>Your search history is stored locally in your browser. Clearing your history is permanent.</p>
							}
							{!searchHistory.length &&
								<NonIdealState
									title={'Search History Empty'}
									visual={'history'}
								/>
							}
							{!!searchHistory.length &&
								<table className={'pt-table pt-striped pt-interactive'}>
									<thead>
										<tr>
											<th>Search Number</th>
											<th>Search String</th>
											<th>Timestamp</th>
											<th>Total Hits</th>
											<th>Operator</th>
											<th>Sources</th>
										</tr>
									</thead>
									<tbody>
										{searchHistory.sort((foo, bar)=> {
											if (foo.searchedAt < bar.searchedAt) { return 1; }
											if (foo.searchedAt > bar.searchedAt) { return -1; }
											return 0;
										}).map((item, index)=> {
											return (
												<tr key={item.searchedAt}>
													<td>{searchHistory.length - index}</td>
													<td>{item.query}</td>
													<td>{new Date(item.searchedAt).toString()}</td>
													<td>{item.totalHits}</td>
													<td>{item.operator}</td>
													<td>{item.sources}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default History;
