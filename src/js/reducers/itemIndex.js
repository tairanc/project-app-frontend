/**
 * Created by hzhdd on 2017/11/1.
 */
import createReducers from './createReducers.js';
import Immutable from 'immutable';

let initialState = {
	updata: false,
	status: false,
	mixStatus: false,
	rateStatus: false,
	recommendStatus: false,
	proStatus: false,
	cartInfoStatus: false,
	data: {},
	mix: {},
	promotion: {},
	itemRules: {},
	rate: {},
	recommend: {},
	cartNum: {},
	promotionData: {},//特卖秒杀直降促销数据
	itemId: "",
	weight: "",

	promotionModal: false,
	couponsModal: false,
	searverModal: false,
	buyModal: false,
	buyActive: null,

	scrollHeight: 0,

	areaData: {
		area: "",
		areaCode: "",
		addressData: ""
	},

	retState: {
		flag: false,  //该字段为跳转拼团详情页标记，若为true，可通用数据
		selectArr: [],
		specKey: []
	},
	firstT: 0,
	returnT: 0,
	intervalT: 0,
	// orderInitParams:{} //订单确认初始接口参数
};

function initPtomotionData(data, state) {
	let business = getBusinessNotice(data.data);
	let ret = {
		flag: true,
		nowSku: {},      //规格sku信息
		newData: getNewData(data.data),
		selectArr: [],  //属性值key
		specKey: [],    //属性key
		// nowSkuId: "",
		storeNum: data.data.realStore,
		nowPrice: rangePrice(data.data),
		groupPrice: data.data.groupBuy && data.data.promotion[0].rules.group_price,
		num: 1,
		business: business
	};
	let retState = {...state.retState, ...ret};
	//特卖秒杀直降promotion数据
	return {...state, promotion: data.data, proStatus: true, retState, promotionData: getPromotionData(data.data)}
}

//获取促销信息里的数据
function getPromotionData(data) {
	let {promotion, activity_type} = data;
	let promotionObj = {};
	promotion.some((item, i) => {
		if (item.type === activity_type) {
			promotionObj[item.type] = item;
			return
		}
	});
	return promotionObj;
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

//获取区间价
function rangePrice(data) {
	let {skus} = data.info, priceArr = [], priceArr2 = [], rangePrice;
	for (let i in skus) {
		if (skus[i].business && !data.activity_type) { //最低企业购对应的标准售价[特卖 直降 秒杀不显示企业价] 拼团普通购买 同 企业购商品
			let priceObj = {};
			priceArr.push(parseFloat(parseFloat(skus[i].business[0].sell_price).toFixed(2)));
			priceObj.price1 = skus[i].business[0].sell_price;
			priceObj.price2 = skus[i].price;
			priceObj.num = skus[i].business[0].threshold;
			priceArr2.push(priceObj)
		} else {
			priceArr.push(parseFloat((parseFloat(skus[i].price).toFixed(2))))
		}
	}

	if (priceArr.length > 1) {
		priceArr = priceArr.sort((a, b) => {
			return a - b;
		});

		if (priceArr2.length > 0) {//企业
			rangePrice = ((priceArr2.filter(item => item.price1 == priceArr[0]))[0]).price2;  //最小企业售价对应的最小售价
		} else if (data.activity_type === "FlashSale" || data.activity_type === "SecKill" || data.groupBuy) {//特卖  秒杀 拼团
			rangePrice = priceArr[0];  //普通售价对应最小价格
		} else {  //直降通普通商品  显示区间价
			rangePrice = priceArr[0] !== priceArr[priceArr.length - 1] ? priceArr[0] + "-" + priceArr[priceArr.length - 1] : priceArr[0];
		}
	} else {
		if (priceArr2.length === 1) {
			rangePrice = priceArr2[0].num === "1" ? priceArr2[0].price1 : priceArr2[0].price2;
		} else {
			rangePrice = priceArr[0]
		}
	}
	return rangePrice
}

//获取企业信息
function getBusinessNotice(data) {
	let {skus} = data.info, businessArr = [], businessNoticeArr = [], business;
	if (data.activity_type) {  //特卖  直降  秒杀 不显示企业价
		return
	}
	for (let i in skus) {
		if (skus[i].business) {
			businessArr.push(parseFloat(skus[i].business[0].sell_price));
			businessNoticeArr.push(skus[i].business[0])
		}
	}
	if (businessArr.length > 1) {
		businessArr = businessArr.sort((a, b) => {
			return a - b;
		});
	}
	for (let k = 0; k < businessNoticeArr.length; k++) {
		if (businessArr[0] === parseFloat(businessNoticeArr[k].sell_price)) {
			business = businessNoticeArr[k];
			break
		}
	}
	return business
}

function updataTime(action, state) {
	let {intervalT} = state;
	if (action.T2) {
		intervalT = action.T2 - action.T1;
	}
	return {...state, firstT: action.T1, returnT: action.T2, intervalT: intervalT}
}

function initMixData(data, state) {
	let {addrList} = data, areaCode = [];
	if (addrList.recent_addr.length > 0) {
		let {province, city, district} = addrList.recent_addr[0].area;
		areaCode.push(province.code), areaCode.push(city.code), district.code && areaCode.push(district.code);
		addrList.recent_addr[0].address_id = addrList.recent_addr[0].id;
	} else if (addrList.default_addr.area) {
		let {province, city, district} = addrList.default_addr.area;
		areaCode.push(province.code), areaCode.push(city.code), district.code && areaCode.push(district.code);
		addrList.default_addr.address_id = addrList.default_addr.id;
	} else {
		areaCode = ["330000", "330100"];
	}
	let defaultArea = {
		"area": {
			"district": {
				"code": "330108",
				"text": "滨江区"
			},
			"province": {
				"code": "330000",
				"text": "浙江省"
			},
			"city": {
				"code": "330100",
				"text": "杭州市"
			}
		},
		"detail_address": "浙江省杭州市滨江区"
	};
	let areaData = {
		area: addrList.recent_addr[0] && (addrList.recent_addr[0].detail_address) || addrList.default_addr.detail_address || "杭州市滨江区",
		areaCode: areaCode,
		addressData: addrList.recent_addr[0] || addrList.default_addr || defaultArea
	};
	window.sessionStorage.setItem("areaData", JSON.stringify(areaData.addressData));  //商品详情页地址保存到sessionStorage，用于订单确认页
	return {...state, mix: data, mixStatus: true, areaData: areaData};
}

function itemIndex(state = initialState, action) {
	let ret, retState;
	switch (action.type) {
		case 'initAndClearData':
			return initialState;
		case 'changeStatus':
			return {...state, updata: action.updata,status: action.status};
		case 'initData':
			ret = {itemId: action.itemId, weight: action.data.weight};
			retState = {...state.retState, ...ret};
			return {...state, data: action.data, status: action.status, updata: action.updata, retState};
		case 'mixDataSuccess':
			return initMixData(action.result.data, state);
		case 'promotionDataSuccess':
			return initPtomotionData(action.result, state);
		case 'rateDataSuccess':
			return {...state, rate: action.result.data, rateStatus: true};
		case 'recommendDataSuccess':
			return {...state, recommend: action.result.data, recommendStatus: true};
		case 'cartInfoDataSuccess':
			return {...state, cartNum: action.result.data.count, cartInfoStatus: true};

		case 'initState':
			return {...state, retState: action.ret};
		/*case 'orderInitParams':
		 return {...state, orderInitParams: action.orderInitParams};*/
		case 'promotionBackFlag':
			return {...state, promotionModal: true};

		case 'goScrollHeght':
			return {...state, scrollHeight: action.height, loginBack: "loginBack"};

		case 'changePromotionModal':
			return {...state, promotionModal: action.flag};

		case 'couponsBackFlag':
			return {...state, couponsModal: true};
		case 'changeCouponsModal':
			return {...state, couponsModal: action.flag};

		case 'changeSearverModal':
			return {...state, searverModal: action.flag};

		case 'changeAreaData':
			let newAreaData = {...state.areaData, ...action.areaData};
			window.sessionStorage.setItem("areaData", JSON.stringify(newAreaData.addressData));  //商品详情页地址保存到sessionStorage，用于订单确认页
			return {...state, areaData: newAreaData};

		case 'updateBuyModal':
			return {...state, ...action};

		case 'updateCartInfo':
			return {...state, cartNum: action.count};

		case 'UpdataTimer':
			return updataTime(action, state);
		default:
			return state;
	}
}

export default createReducers("itemIndex", itemIndex, initialState);