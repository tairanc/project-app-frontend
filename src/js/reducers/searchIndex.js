import createReducers from './createReducers.js';
import Immutable from 'immutable';
import { browserHistory } from 'react-router';

let initialState = {
	keyWord:"",
	param:{},
	searchHistory:[],
	hotList:[],
	compList:[],
	prompt:{
		show:false,
		msg:""
	}
};

const specList ={
	brand:{text:"进入品牌",url:( id, key )=>{  browserHistory.push( `/searchResult?brand=${id}`) }  },
	country_property:{text:"进入国家",url:( id, key )=>{  browserHistory.push( `/searchResult?property=${id}`) } },
	primary_category:{text:"进入分类",url:( id,key )=>{  window.location=`trmall://category?catId=${id}` } },
	secondary_category:{text:"进入分类",url:( obj, key )=>{  window.location=`trmall://category?catId=${obj.first}&subId=${obj.second}` } },
	tertiary_category:{text:"进入分类",url:( id,key)=>{  browserHistory.push( `/searchResult?category=${id}`)  } }
};

function dataHandle( type ){
	let newType = {};
	if( type.brand ) newType.brand = type.brand;
	if( type.country_property ) newType.country_property = type.country_property;
	if( type.primary_category ) {newType.primary_category = type.primary_category;}
	else if( type.secondary_category ) {newType.secondary_category = {second: type.secondary_category, first:type.secondary_category_primary };}
	else if( type.tertiary_category ) {newType.tertiary_category = type.tertiary_category;}
	return newType;
}

function searchCpt( state, result, keyWord ) {
	if( !result.status ){
		return state;
	}
	let { data } = result;
	data.type = dataHandle( data.type );

	let keys = Object.keys( data.type );
	let specialList = keys.length ? keys.map( ( key, i)=>{
		return {
			text:keyWord,
			accurate: specList[key].text,
			clickHandle: specList[key].url.bind( null, data.type[key], keyWord )
		}
	}):[];
	let compList = data.suggests.length ? data.suggests.map( ( key,i)=>{
		return { text: key }
	}):[];

	return {...state, compList: specialList.concat( compList ) };
}


function searchIndex( state = initialState, action ) {
	switch ( action.type ){
		case 'keyCtrl':
			return { ...state, keyWord: action.key };
		case 'paramCtrl':
			return { ...state, param: action.param };
		case 'listCtrl':
			return { ...state, compList: action.list };
		case 'ctrlPrompt':
			return { ...state, prompt:{ ...action.prompt } };
		case 'historyCtrl':
			return { ...state, searchHistory: action.history };
		case 'initPlaceHolderSuccess':
			return { ...state, placeHolder: action.result.data };
		case 'updateHotSuccess':
			return { ...state, hotList: action.result.data  };
		case 'searchCptSuccess':
			return searchCpt( state,action.result, action.cbData );
		default:
			return state;
	}
}

export default createReducers("searchIndex",searchIndex,initialState );