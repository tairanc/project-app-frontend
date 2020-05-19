import createReducers from './createReducers.js';

let initialState ={
	winHeight: $(window).height()
};

function global( state = initialState, action ) {
	switch ( action.type ){
		case "changeLogin":
			return { ...state,isLogin:action.login };
		case "getLoginSuccess":
			if( action.result.isLogined ==="true" ){
				return { ...state,isLogin:true };
			}
		default:
			return state;
	}
}

export default createReducers("global",global,initialState );