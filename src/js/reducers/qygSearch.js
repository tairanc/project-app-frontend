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



function qygSearch( state = initialState, action ) {
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
			return {...state, compList:action.result.data.suggests };
		default:
			return state;
	}
}

export default createReducers("qygSearch",qygSearch,initialState );