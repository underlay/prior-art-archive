import { searchFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_SEARCH_LOAD = 'search/GET_SEARCH_LOAD';
export const GET_SEARCH_SUCCESS = 'search/GET_SEARCH_SUCCESS';
export const GET_SEARCH_FAIL = 'search/GET_SEARCH_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getSearch(searchParams) {
	if (!searchParams.searchQuery) {
		return { type: null };
	}

	return (dispatch) => {
		dispatch({ type: GET_SEARCH_LOAD });
		return searchFetch({
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(searchParams)
		})
		.then((result) => {
			dispatch({
				type: GET_SEARCH_SUCCESS,
				result,
				searchOperator: searchParams.searchOperator,
				filters: searchParams.filters,
			});
		})
		.catch((error) => {
			dispatch({ type: GET_SEARCH_FAIL, error });
		});
	};
}
