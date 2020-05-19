import createReducers from './createReducers.js';
import Immutable from 'immutable';

let initialState = {
	load:true,
	nav:"",
	comingList:"",
	listLoad:true,
	showBanner:true,
	list:{
		data:"",
		page:1,
		total:10,
		isComing:false
	},
	categoryId:"",
};
function initData( state, result  ){
	let imState =Immutable.fromJS(state);
	imState = imState.set("load",false );
	result[0].data.data.unshift({ category_id:"",name:"精选" });
	result[0].data.data.push({name:"预告" });
	imState = imState.set("nav", result[0].data.data );
	imState = imState.set("banner", result[1].data.data );
	return imState.toJS();
}

function setList( state, result ) {
	let imData = Immutable.fromJS( state );
	imData = imData.set("listLoad", false );
	imData = imData.set('list',{
		data:result.data.items,
		page: result.data.page,
		total: Math.ceil( result.data.count/20 ),
		isComing:result.data.is_coming
	});
	return imData.toJS();
}

function concatList( state, result ) {
	let imData = Immutable.fromJS( state );
	imData = imData.updateIn(['list','data'], ( list )=>{
		return list.concat( result.data.items );
	});
	imData = imData.setIn(['list','page'], result.data.page );
	imData = imData.setIn(['list','total'], Math.ceil( result.data.count/20 )  );
	return imData.toJS();
}

function groupMallHome( state = initialState, action ) {
	switch ( action.type ){
		case 'initSuccess':
			return initData( state, action.result );
		case 'getListLoad':
			return { ...state, listLoad:true, list : initialState.list };
		case 'getListSuccess':
			return setList( state, action.result );
		case 'concatDataSuccess':
			return concatList( state, action.result );
		case 'changeId':
			return { ...state, categoryId: action.id };
		case 'hideBanner':
			return { ...state, showBanner: action.showBanner };
		case 'saveTop':
			return { ...state,disTop: action.value };
		default:
			return state;
	}
}

export default createReducers("groupMallHome",groupMallHome,initialState );