import createReducers from './createReducers.js';
import Immutable from 'immutable';

let initialState = {
	errorState:false,
	from:"",
	filterUpdate:true,
	filterState:true,
	windowHeight:0,
	goodHeight:1,
	load:false,
	init:false,
	isScroll:true,
	isQuickSelect:false,
	keyWord:"",
	param:{},
	searchType:"",
	searchData:"",
	currentPage:"",
	totalPage:"",
	brandsList:[],
	brandsOrderList:[],
	categoriesList:[],
	categoriesLevelList:[],
	correction:"",
	coupon:"",
	listStyle:2
};

function setData( state, result,filterUpdate ) {
	let data = Object.assign({}, {...state},{
		load: true,
		goodsList: result.data.items
	});
	if(filterUpdate){
		data = Object.assign({}, data,{
			service:result.data.service||[],
			brandsList:result.data.brands?result.data.brands.list:[],
			brandsOrderList:result.data.brands?result.data.brands.alphabet:[],
			categoriesList: getCategoriesList(result.data.categories||[]),
			categoriesLevelList:result.data.categories||[],
			properties:result.data.properties||[],
			correction:result.data.correction,
			coupon:result.data.coupon
		});
	}
	return data;
}
function concatData( state,result ){
	state.goodsList = state.goodsList.concat(result.data.items);
	return state;
}
function setSearch(state,data){
	let searchData = {...state.searchData,...data};
	return {...state,searchData:searchData};
}
function setSearchService(state,data){
	let service = {...state.searchData.service,...data};
	let searchData = {...state.searchData,service};
	return setSearch(state,searchData);
}
function getCategoriesList(list){
	let categoryList = [];
	for(let i=0;i<list.length;i++){
		categoryList = categoryList.concat(list[i].children);
	}
	return categoryList.sort(function(a,b){
		return b.count - a.count
	});
}
function searchResult( state = initialState, action ) {
	switch ( action.type ){
		case 'isError':
			return {...state,errorState:action.errorState};
		case 'setFrom':
			return {...state,from:action.from};
		case 'setFilterUpdate':
			return {...state,filterUpdate:action.filterUpdate};
		case 'windowHeight':
			return {...state,windowHeight:action.windowHeight};
		case 'goodHeight':
			return {...state,goodHeight:action.goodHeight};
		case 'setInit':
			return {...state,init:action.init};
		case 'setFilterState':
			return {...state,filterState:action.filterState};
		case 'resetState':
			return { ...initialState, keyWord: action.keyWord, searchType: action.searchType };
		case 'setInitItem':
			return {
				...state,
				service:action.result.data.service||[],
				brandsList:action.result.data.brands?action.result.data.brands.list:[],
				brandsOrderList:action.result.data.brands?action.result.data.brands.alphabet:[],
				categoriesLevelList:action.result.data.categories||[] ,
				categoriesList: getCategoriesList(action.result.data.categories||[]),
				properties:action.result.data.properties||[],
				correction:action.result.data.correction,
				coupon:action.result.data.coupon
			};
		case 'isLoad':
			return { ...state, load:action.load };
		case 'setData':
			return setData( state, action.result,action.filterUpdate );
		case 'setSearch':
			return setSearch( state,action.searchData);
		case 'setSearchService':
			return setSearchService( state,action.service);
		case 'setCorrection':
			return { ...state,correction:action.correction };
		case 'concatData':
			return concatData( state,action.result);
		case 'setCurrentPage':
			return { ...state,currentPage:action.current };
		case 'setTotalPage':
			return { ...state,totalPage:action.total };
		case 'changeListStyle':
			return {...state,listStyle:action.style};
		case 'toggleQuickSelect':
			return {...state,isQuickSelect:action.isQuickSelect};
		default:
			return state;
	}
}

export default createReducers("searchResult3", searchResult, initialState );