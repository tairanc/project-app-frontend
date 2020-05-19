import createReducers from './createReducers.js';
import Immutable from 'immutable';

let initialState ={
	load: true,
	promotionId:"",
	shopId:"",
	list:{
		data:"",
		page:1,
		total:1
	},
	rule:"",
	cart:"",
	prompt:{
		show:false,
		msg:""
	},
	itemData: {},
	modalCtrl: {show:false},
	promptBig:{
		show:false,
		msg:""
	}
};

function initData( state, result ) {
	let imData = Immutable.fromJS( state );
	let listData = result[0].data;
	let ruleData = result[1].data;

	imData = imData.set( 'load', false );
	if( !listData.status || !ruleData.status || !listData.data ){
		return imData.toJS();
	}
	imData = imData.set('list', {
		data: listData.data.items,
		page: listData.data.page,
		total: Math.ceil( listData.data.count/20 )
	});
	imData = imData.set('rule', ruleData.data );
	return imData.toJS();
}

function concatData( state, result ) {
	let imData = Immutable.fromJS( state );
	imData = imData.updateIn(['list','data'], ( list )=>{
		return list.concat( result.data.items );
	});
	imData = imData.setIn(['list','page'], result.data.page );
	imData = imData.setIn(['list','total'], Math.ceil( result.data.count/20 )  );
	return imData.toJS();
}


function shopData( state, result ){
	if( !result.status ){
		return state;
	}
	return { ...state,cart:result.data };
}

function itemData(state, result) {
	let id = result.data.item.item_id;
	let itemData = {...state.itemData};
	let res = {
		data: result.data,
		specs: result.data.specs,
		promotion: result.data.promotion,
		itemRules: result.data.promotion.itemRules || {},
		active: "cart",
		itemId: id
	};
	itemData[id] =res;
	return {...state, itemData, modalCtrl: {show: true, activeItemData: res},modalLoading: false}
}
function optionbuyActivity( state = initialState, action ) {
	switch ( action.type ){
		case 'resetData':
			return { ...initialState, ...action.query };
		case 'getDataSuccess':
			return initData( state, action.result );
		case 'getShopSuccess':
			return shopData( state, action.result );
		case 'concatDataSuccess':
			return concatData( state, action.result );
		case 'promptCtrl':
			return { ...state, prompt:action.prompt };
		case 'promptBigCtrl':
			return { ...state, promptBig: action.prompt };
		case "getChannelItemLoad":
			return {...state, modalLoading: true}
		case "getChannelItemSuccess":
			return itemData(state, action.result)
		case "modalCtrl":
			return {...state, modalCtrl: action}
		default:
			return state;
	}
}

export default createReducers("optionBuyActivity", optionbuyActivity, initialState );