import { combineReducers } from 'redux';
import login from './login';
import search from './search';

export default combineReducers({
	login,
	search,	
});
