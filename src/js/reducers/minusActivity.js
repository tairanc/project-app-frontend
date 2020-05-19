import createReducers from './createReducers.js';
import Immutable from 'immutable';

let initialState = {
  load: true,
  promotionId: "",
  shopId: "",
  list: {
    data: "",
    page: 1,
    total: 1
  },
  rule: "",
  cart: "",
  prompt: {
    show: false,
    msg: ""
  },
  itemData: {},
  modalCtrl: {show: false},
  promptBig: {
    show: false,
    msg: ""
  },
  countCart: 0,
  isNonPayment:false,
};

function initData(state, result) {
  let imData = Immutable.fromJS(state);
  let listData = result[0].data;
  let ruleData = result[1].data;

  imData = imData.set('load', false);

  if (!listData.status || !ruleData.status || !listData.data) {
    return imData.toJS();
  }
  imData = imData.set('list', {
    data: listData.data.items,
    page: listData.data.page,
    total: Math.ceil(listData.data.count / 20)
  });
  imData = imData.set('rule', ruleData.data);
  return imData.toJS();
}

function concatData(state, result) {
  let imData = Immutable.fromJS(state);
  imData = imData.updateIn(['list', 'data'], (list) => {
    return list.concat(result.data.items);
  });
  imData = imData.setIn(['list', 'page'], result.data.page);
  imData = imData.setIn(['list', 'total'], Math.ceil(result.data.count / 20));
  return imData.toJS();
}


function shopData(state, result) {
  if (!result.status) {
    return state;
  }
  return {...state, cart: result.data};
}

//获取区间价
function rangePrice(data) {
  let {skus} = data.info, priceArr = [], rangePrice;
  for (let i in skus) {
    priceArr.push(parseFloat(skus[i].price.toFixed(2)))
  }
  if (priceArr.length > 1) {
    priceArr = priceArr.sort((a, b) => {
      return a - b;
    });
    if (data.itemRules) {
      rangePrice = priceArr[0];
    } else {
      rangePrice = priceArr[0] + "-" + priceArr[priceArr.length - 1];
    }
  } else {
    rangePrice = priceArr[0]
  }
  return rangePrice
}

//组合新数据结构
function getNewData(data) {
  let {skus} = data.info;
  let arr = Object.keys(skus);
  let newData = arr.map((item, i) => {
    let ids = item.split("_");
    let dataItem = skus[item];
    return {
      ids,
      skus: dataItem
    }
  });
  return newData;
}

function isNonPayment(promotion) {
  //还有机会[特卖]
  if (promotion.itemRules) {
    let {real_store, item_sales, sales_count} = promotion.itemRules;
    if (!real_store) {
      return item_sales !== sales_count;
    }
  }
}

function itemData(state, result) {
  let id = result[0].data.data.promotion[0].item_id;
  let itemData = {...state.itemData};
  let res = {
    data: result[0].data.data,
    specs: result[0].data.data.specs,
    promotion: result[0].data.data.promotion,
    itemRules: result[0].data.data.promotion.itemRules || {},
    active: "cart",
    itemId: id
  };
  let ret = {
    nowSku: {},      //规格sku信息
    newData: getNewData(result[0].data.data),
    selectArr: [],  //属性值key
    specKey: [],    //属性key
    // nowSkuId: "",
    storeNum: result[0].data.data.store.real,
    nowPrice: rangePrice(result[0].data.data),
    num: 1,
    weight: state.weight,
    itemId: id,
    active: "cart",
  };
  let promotion = result[0].data.data;
  let data = result[1].data.data;
  itemData = res;
  let isNonPay=isNonPayment(promotion);
  return {...state, data, itemData, promotion, retState: ret, modalCtrl: {show: true}, modalLoading: false,isNonPayment:isNonPay}
}

function getCartCount(state, result) {
  let countCart = result.cart_num;
  let obj = Object.assign({}, {...state}, {
    countCart: countCart
  });
  return obj;
}

function minusActivity(state = initialState, action) {
  switch (action.type) {
    case 'resetData':
      return {...initialState, ...action.query};
    case 'getDataSuccess':
      return initData(state, action.result);
    case 'getShopSuccess':
      return shopData(state, action.result);
    case 'concatDataSuccess':
      return concatData(state, action.result);
    case 'promptCtrl':
      return {...state, prompt: action.prompt};
    case 'promptBigCtrl':
      return {...state, promptBig: action.prompt};
    case "getChannelItemLoad":
      return {...state, modalLoading: true}
    case "getChannelItemSuccess":
      return itemData(state, action.result)
    case "modalCtrl":
      return {...state, modalCtrl: action}
    case 'initState':
      return {...state, retState: action.ret};
    case 'updateCartInfo':
      return {...state, countCart: action.cart_num};
    case 'getCartCountSuccess':
      return getCartCount(state, action.result);

    default:
      return state;
  }
}

export default createReducers("minusActivity", minusActivity, initialState);