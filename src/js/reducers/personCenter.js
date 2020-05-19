import createReducers from './createReducers.js';

let initialState ={
	userInfo:{},
	orderNum:{},
	couponNum:0,
	couponUpdate:false
};

function personCenter( state = initialState, action ){
	switch( action.type ){
		case "getUserInfo":
			return {...state,userInfo:action.data };
		case "getOrderNum":
			return {...state,orderNum:action.data };
		case "getCouponNum":
			return {...state,couponNum:action.num, couponUpdate:!state.couponUpdate };
		default:
			return state;
	}
}

export default createReducers("personCenter",personCenter,initialState );