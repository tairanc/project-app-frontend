import { combineReducers } from 'redux';

import global from './global.js';
import orderCancel from './orderCancel.js';
import tradeDetail from './tradeDetail.js';
import afterSaleApply from './afterSaleApply.js';
import afterSaleDetail from './afterSaleDetail'
import logicompany from  './logicompany.js';
import consultrecord from  './afterconsultrecord.js';
import personCenter from './personCenter.js';
import zeroBuy from './zeroBuy.js';
import groupMallHome from './groupMallHome.js';
import minusActivity from './minusActivity.js';
import searchResult from './searchResult.js';
import searchResult3 from './searchResult3.js';
import searchIndex from './searchIndex.js';
import qygSearch from './qygSearch.js';
import invoiceSelect from './invoiceSelect.js';
import orderConfirm from './orderConfirm.js';
import itemIndex from './itemIndex';
import seckill from './seckill.js';
import storeIndex from './storeIndex.js';



function initial(state={}, action) {
	let newState={};
  switch (action.type) {
	  //普通订单列表
	  case 'TRADE_LIST':
		  newState.type="TRADE_LIST";
		  newState.listNum =action.listNum;
		  return newState;
	  //弹窗控制
	  case 'POPUP':
		  return Object.assign({}, action);
	  //拼团订单列表
	  case 'MY_GROUP_LIST':
		  newState.type="MY_GROUP_LIST";
		  newState.listNum =action.listNum;
		  return newState;
		//购物车
		case 'SHOP_CART':
			newState.type="SHOP_CART";
	    if( action.update ){
		    newState.update = true;
		    newState.ctrl = action.ctrl;
		    newState.data = action.data;
	    }
		  if( action.editChange ){
			  newState.editChange = true;
			  newState.edit = action.edit;
		  }
			newState.msg = action.msg;
		  return newState;
		//商品详情
	    case 'ITEM':
		    return Object.assign({}, state, action);
		//评价列表
		case 'EVALUATE_LIST':
			state.type = "EVALUATE_LIST";
			return state;
		//评价内容
		case 'EVALUATE_INPUT':
			state.type = "EVALUATE_INPUT";
			return state;
		//评价成功
		case 'EVALUATE_SUCCESS':
			state.type = "EVALUATE_SUCCESS";
			return state;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
	initial,
	global,
	personCenter,
	orderCancel,
	tradeDetail,
	groupMallHome,
	orderConfirm,
	minusActivity,
	afterSaleApply,
    afterSaleDetail,
    consultrecord,
    logicompany,
	invoiceSelect,
	itemIndex,
	seckill,
	zeroBuy,
	searchIndex,
	qygSearch,
	searchResult,
	searchResult3,
	storeIndex
});
export default rootReducer;