import {filter, wrap, each} from "../util/index"
import Popup from 'component/modal2';

let MSG = {
	ACTIONERROR: "请求错误",
	NOTAREA: "不在配送区域",
	CARTSUCCESS: "加入购物车成功",
	SELECTSPEC: "请选择所有规格",
	MINNUM: "此商品最少购买1件",
	MAXNUM: "此商品最多只能购买{0}件",
	STRATEGY: "请先选择分期策略"
};

export let createMSG = wrap(filter(MSG), function (fnc, str) {
	let val = fnc(str),
		arg = [...arguments];
	return  val.replace(/\{(\d+)\}/g, (a, b) => arg[+b + 2])
});

const TRADE = {
	Domestic: "国内贸易",
	Overseas: "海淘",
	Bonded: "跨境保税",
	Direct: "海外直邮"
};

export let FilterTrade = function (str) {
	if (str == "BONDED" || str == "DIRECT") {
		return TRADE[str]
	}
};

export let TradeFade = function (data) {
	return data.trade_type !=="DOMESTIC" && data.tax_rate != 0
}

export let FilterTradeType = function (str) {
	return str === "OVERSEAS"||str==="DIRECT" ? "海外直邮" : str==="BONDED"?"跨境保税":""
}

export let FilterTradeClass = function (str) {
	return (str === "BONDED" ? "blue-label" : "yellow-label") + " label"
}


export let PurchaseLimit = function (str) {
	return str === "DIRECT" || str === "BONDED"
}




export let createAction = function (actions, flag) {

	return wrap(filter(actions), function (filter, type, obj = {}) {
		let action = filter(type);
		if (!action) {
			return null
		}
		let suc = obj.success,
			err = obj.error,
			ret = Object.assign({}, action, obj, flag ? {
				error(data) {
					Popup.MsgTip({msg: createMSG('ACTIONERROR')});
					err && err(data)
				},
				success(data) {
					if (data.msg || data.message) {
						Popup.MsgTip({msg: data.msg || data.message})
					}
					suc && suc(data);
				}
			}: {})

		return ret
	})
}






