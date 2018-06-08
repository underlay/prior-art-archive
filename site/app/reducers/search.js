/* ---------- */
// Load Actions
/* ---------- */
import store from 'store/dist/store.legacy';
import {
	GET_SEARCH_LOAD,
	GET_SEARCH_SUCCESS,
	GET_SEARCH_FAIL,
} from 'actions/search';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	error: undefined,
};

let searchHistory;

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_SEARCH_LOAD:
		return {
			isLoading: true,
			error: undefined,
		};
	case GET_SEARCH_SUCCESS:
		searchHistory = store.get('searchHistory') || [];
		searchHistory.push({
			query: action.result.searchQuery,
			searchedAt: new Date(),
			totalHits: action.result.totalHits,
			operator: action.searchOperator,
			sources: action.filters.reduce((prev, curr)=> {
				if (curr.filterName === 'Source') {
					return curr.filterData.join(', ');
				}
				return prev;
			}, 'All')
		});
		store.set('searchHistory', searchHistory);

		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case GET_SEARCH_FAIL:
		return {
			isLoading: false,
			error: action.error,
		};
	default:
		return state;
	}
}
