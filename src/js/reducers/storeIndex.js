import createReducers from './createReducers.js';

const initialState ={
	update:false,
	disTop:0,
	is_subscribe: false,
	subscribeAllow:true,
	sign: {},
	shop_cat_list:[],
	shop_decoration_data:{
		is_show_coupon:0,
		modules:[
			{}
		]
	},
	resultShow: false
};
function storeIndex( state=initialState, action ){
	switch( action.type ){
		case 'initialData':
			return { ...state,...action.value};
		case 'subscribeStore':
			return { ...state,is_subscribe:action.state};
		case 'subscribeAllow':
			return { ...state,subscribeAllow:action.state};
		case 'resultShow':
			return { ...state,resultShow:action.resultShow};
		case 'dataUpdate':
			return { ...state,update:action.update};
		case 'saveTop':
			return { ...state, disTop: action.value };
		default:
			return state;
	}
}
export default createReducers("storeIndex",storeIndex,initialState );