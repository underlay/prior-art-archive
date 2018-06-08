/* global Raven */

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_LOGIN_LOAD,
	GET_LOGIN_SUCCESS,
	GET_LOGIN_FAIL,

	POST_LOGIN_LOAD,
	POST_LOGIN_SUCCESS,
	POST_LOGIN_FAIL,

	GET_LOGOUT_LOAD,
	GET_LOGOUT_SUCCESS,
	GET_LOGOUT_FAIL,
} from 'actions/login';


/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	error: undefined,
};

const isDev = window.location.origin.indexOf('localhost:') > -1;

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_LOGIN_LOAD:
	case GET_LOGIN_FAIL:
		return state;
	case POST_LOGIN_LOAD:
		return {
			data: undefined,
			isLoading: true,
			error: undefined,
		};
	case GET_LOGIN_SUCCESS:
	case POST_LOGIN_SUCCESS:
		if (!isDev) {
			Raven.setUserContext({ username: action.result.slug });
		}
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case POST_LOGIN_FAIL:
		return {
			data: undefined,
			isLoading: false,
			error: 'Invalid Email or Password'
		};
	case GET_LOGOUT_LOAD:
	case GET_LOGOUT_FAIL:
		return state;
	case GET_LOGOUT_SUCCESS:
		if (!isDev) {
			Raven.setUserContext();
		}
		return defaultState;
	default:
		return state;
	}
}
