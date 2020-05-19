import createReducers from './createReducers.js';
import Immutable from 'immutable';

let initialState = {
	load:true,
	listLoad:true,
	firstTime:true,
	form:"",
	keyWord:"",
	brands:"",//品牌
	category:"",//分类
	property:"",//属性
	dataList:"",//搜索列表
	priceRange:"",//价格分区
	initSearch:"",
	preProperty:[],
	searchType:"",
	isPrev:false,
	prevSearchData:{},
	couponId:"",
	shop:"",
	searchData:{
		search_keywords:"", //关键词
		category:[], //分类
		brand:[], //品牌
		orderBy:{ type:"", direct:"" }, //排序
		priceRange:{ min:"",max:"", id:"" }, //价格范围
		properties:{}, //属性
		promotion:"", //促销
		self:"" , //自营
		pages:1,//页数
		coupon_id:"", //优惠券id
	},
	totalPage:1,//总的页数
	listType:"category",
	
	/*状态*/
	dropType:"",
	dropProperty:false,
	disTop:0,
	prompt:{
		show:false,
		msg:""
	}
};

function initData( state, result ) {
	state = Immutable.fromJS( state).toJS();
	state.load = false;
	state.listLoad = false;
	//预先搜索条件
	if( state.initSearch ){
		if( state.initSearch.coupon_id ){
			state.couponId = state.initSearch.coupon_id;
		}
		if( state.initSearch.shop ){
			state.shop = state.initSearch.shop;
		}
		if( state.initSearch.brand ){
			state.searchData.brand = state.initSearch.brand.split(",").map( ( item,i )=> Number(item) );
		}
		if( state.initSearch.category){
			state.searchData.category.push( state.initSearch.category );
		}
		if( state.initSearch.properties ){
			state.preProperty =  state.initSearch.properties;
		}
		if( state.initSearch.orderBy ){
			let [ type, direct ] =  state.initSearch.orderBy.split(":");
			state.searchData.orderBy = { type, direct };
		}
		if( state.initSearch.searchType ){
			state.searchType = state.initSearch.searchType;
		}
		state.initSearch = "";
	}

	if( !result.status ){
		state.prompt = { show:true, msg: result.msg };
		return state;
	}
	let { data } = result;
	
	if( ! ( data && data.items ) ){
		state.dataList = "";
		return state;
	}
	
	//首次搜索
	if( state.firstTime ){
		state.firstTime = false;
		state.brands = data.brands;
		state.category = data.categoriesInfo;
		
		data.price_ranges = ( data.price_ranges.length &&  data.price_ranges.length >=4 ) ? data.price_ranges.map( (item,i)=>{
			item.id = `price_${i}`;
			return item;
		}):[];
		state.priceRange = 	data.price_ranges;
		
		state.property = data.category.length ? data.category.map( ( item, i)=>{
			state.searchData.properties[ `property_${i}`] = [];
			item.id = `property_${i}`;
			return item;
		}):[];
		
		state.property.unshift(
			{ id:"category",name:"分类", list: data.categoriesInfo },
			{ id:"brand", name:"品牌", list: data.brands},
			{ id:"price",  "name":"价格" ,list: data.price_ranges }
		);

	}
	
	state.searchData.pages = data.pagers.current;
	state.totalPage = data.pagers.total;
	state.correction = data.correction;
	state.dataList = data.items;
	state.searchData.search_keywords = state.keyWord;
	
	if( data.correction ){
		state.searchData.search_keywords = data.correction;
	}
	
	return state;
}

function concatData( state, result ) {
	if( state.listLoad || !state.dataList ) return state;
	state = Immutable.fromJS( state ).toJS();
	state.dataList = state.dataList.concat( result.data.items );
	state.searchData.pages = result.data.pagers.current;
	state.totalPage =  result.data.pagers.total;
	return state;
}

function updateSortOrder( state, type, direct ) {
	let imState = Immutable.fromJS( state);
	imState = imState.setIn(["searchData","orderBy"],{
		type:type,
		direct:direct
	});
	return imState.toJS();
}

function itemTypeChg( state, itemType ){
	let imState = Immutable.fromJS( state );
	imState = imState.setIn(["searchData", itemType ], !state.searchData[itemType]? 1: "" );
	return imState.toJS();
}

function filterSelect( state, data, type ) {
	let imState = Immutable.fromJS( state );
	imState = imState.setIn(["searchData", type ], data );
	return imState.toJS();
}

function filterSelectReset( state, type ) {
	let imState = Immutable.fromJS( state );
	imState = imState.setIn(["searchData", type ], [] );
	return imState.toJS();
}

function filterProperty( state, id, data ) {
	state = Immutable.fromJS( state ).toJS();
	let arr = state.searchData.properties[id];
	let index = arr.indexOf( data.property_value_id );
	if( index > -1 ){
		arr.splice( index,1 );
	}else{
		arr.push( data.property_value_id );
	}
	state.searchData.properties[id] = arr;
	return state;
}

function allSelectReset( state ) {
	state = Immutable.fromJS( state ).toJS();
	state.searchData.brand = [];
	state.searchData.category = [];
	state.searchData.priceRange = { min:"", max:"" };
	let keys = Object.keys( state.searchData.properties);
	keys.forEach(( id )=>{
		state.searchData.properties[id]=[];
	});
	state.listType = "category";
	return state;
}

function filterPrice( state, ctrl, value ) {
	state = Immutable.fromJS( state ).toJS();
	let { priceRange } = state.searchData;
	priceRange[ctrl] = value;
	if( priceRange.min !=="" ){
		if( priceRange.max !=="" ){
			priceRange ={
				min: Math.min( priceRange.min, priceRange.max ),
				max: Math.max( priceRange.min, priceRange.max )
			}
		}else{
			if( priceRange.min === 0 ){
				priceRange ={ min:"", max:"" }
			}else{
				priceRange ={ min:0, max: priceRange.min }
			}
		}
	}else{
		if( priceRange.max !=="" ){
			if( priceRange.max === 0 ){
				priceRange ={ min:"", max:"" }
			}else{
				priceRange ={ min:0, max: priceRange.max }
			}
		}
		
	}
	state.searchData.priceRange = priceRange;
	return state;
}

function resetSearchList( state ) {
	state = Immutable.fromJS( state ).toJS();
	state.listLoad = true;
	state.pages = 1;
	return state;
}

function priceSelect( state, id ) {
	let imData = Immutable.fromJS( state );
	imData = imData.setIn(["searchData","priceRange","id"], id );
	imData = imData.setIn(["searchData","priceRange","min"], "" );
	imData = imData.setIn(["searchData","priceRange","max"], "" );
	return imData.toJS();
}

function minPrice( state, value ) {
	let { min } = state.searchData.priceRange;
	let imData = Immutable.fromJS( state );
	if( value !== "" ){
		if( !(/^[0-9]+$/).test( value ) ){
			value = min;
		}else{
			value = + value;
		}
		imData = imData.setIn(["searchData","priceRange","id"], "" );
	}
	imData = imData.setIn(["searchData","priceRange","min"], value );
	return imData.toJS();
}

function maxPrice( state, value ) {
	let { max } = state.searchData.priceRange;
	let imData = Immutable.fromJS( state );
	if( value !== "" ){
		if( !(/^[0-9]+$/).test( value ) ){
			value = max;
		}else{
			value = + value;
		}
		imData = imData.setIn(["searchData","priceRange","id"], "" );
	}
	imData = imData.setIn(["searchData","priceRange","max"], value );
	return imData.toJS();
}

function searchResult( state = initialState, action ) {
	switch ( action.type ){
		case 'resetState':
			return { ...initialState, keyWord: action.keyWord, searchType: action.searchType};
		case 'resetSearchData':
			return { ...state, searchData: action.data };
		case 'saveTop':
			return { ...state, disTop: action.value };
		case 'isLoad':
			return { ...state, load: false,listLoad:false };
		case 'setFrom':
			return { ...state, from: action.from };
		case 'initSearch':
			return { ...state, initSearch:action.searchData };
		case 'sortOrder':
			return updateSortOrder( state, action.navType, action.direct );
		case 'itemType':
			return itemTypeChg( state, action.itemType );
		case 'dropType':
			return { ...state, dropType: action.dropType && ( action.dropType === state.dropType?"" :action.dropType ) };
		case 'listType':
			return { ...state, listType:action.listType };
		case 'filterSelect':
			return  filterSelect( state, action.data, action.filterType );
		case 'filterSelectReset':
			return filterSelectReset( state, action.filterType );
			
		case 'filterProperty':
			return filterProperty( state, action.id, action.data );
		case 'allSelectReset':
			return allSelectReset( state );
			
		case 'filterPrice':
			return filterPrice( state, action.ctrl, action.value );
		case 'priceSelect':
			return priceSelect( state, action.id );
		case 'minPrice':
			return minPrice( state, action.value );
		case 'maxPrice':
			return maxPrice( state, action.value );
			
		case 'resetSearchList':
			return resetSearchList( state );
		case 'filterPopupCtrl':
			return { ...state,dropType:"", dropProperty: !state.dropProperty };
		
		case 'initData':
			return initData( state, action.result );
		case 'concatData':
			return concatData( state, action.result );
			
		case 'ctrlPrompt':
			return { ...state, prompt:{ ...action.prompt } };
		default:
			return state;
	}
}

export default createReducers("searchResult", searchResult, initialState );