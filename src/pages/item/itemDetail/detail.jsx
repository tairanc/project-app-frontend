import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Link} from 'react-router';
import {base64encode, utf16to8} from "src/js/util/index";
import 'src/scss/item.scss';

import {
	FilterTrade,
	FilterTradeType,
	createMSG,
	createAction,
	PurchaseLimit,
	FilterTradeClass,
	TradeFade
} from 'filters/index'
import {dateUtil, RHOST} from "../../../js/util/index"
import {LoadingRound, EmptyPage, ShareAndTotop, LinkChange, OpenInAppGuide} from 'component/common';
import {browserHistory} from 'react-router';
import {onAreaResultJSBrige} from "../../../js/jsbrige/index"
import Popup, {Modal, Fix} from 'component/modal';


export let Action = createAction({
	toCart: {
		url: "/originapi/cart/add",
		type: "post"
	},
	Spec: {
		url: "/originapi/item/specs",
		type: "get"
	},
	DelFav: {
		url: "/originapi/user/collection/remove",
		type: "get"
	},
	Fav: {
		url: "/originapi/user/collection/add",
		type: "post"
	},
	GetCoupon: {
		url: "/originapi/user/coupon/code/get",
		type: "post"
	},
	Preview: {
		url: "/originapi/item/rate/preview",
		type: "get"
	}
}, true);


export let PromotionInfo = {
	//特卖
	flashsale: {
		link: "/flashsale",
		getValue(props) {
			return (<span>限时特卖正在火热抢购中...</span>)
		},
		getNum(props, state) {
			let {itemRules} = props;
			let count = itemRules.user_buy_limit - itemRules.user_buy_count;
			if (state.nowPromotioinSpec) {
				return Math.min(count, state.nowPromotioinSpec.real_store);
			}
			return count
		},
		getStore(props, state) {
			return state.nowPromotioinSpec ? state.nowPromotioinSpec.real_store : true
		},
		name: "flashsale"
	},
	fullminus: {
		link(itemData) {
			return `/minusActivity?promotion_id=${itemData.promotion_id}&shop_id=${itemData.shop_id}`
		},
		getValue(props) {
			let {itemdata} = props;

			let item = itemdata.rules.rule.map((val, i) => `满${val.limit_money}减${val.deduct_money}` + (i !== itemdata.rules.rule.length - 1 ? ";" : ""));
			if (itemdata.rules.no_capped) {
				item.push(";上不封顶")
			}
			return (
				<ul className="full-cut-list c-fl">
					<li>
						{item.join('')}
					</li>
				</ul>
			)
		},
		name: "fullminus"
	},
	// 满折
	fulldiscount: {
		link(itemData) {
			return `/discountActivity?promotion_id=${itemData.promotion_id}&shop_id=${itemData.shop_id}`
		},
		getValue(props) {
			let {rules} = props.itemdata;

			return (
				<ul className="full-cut-list c-fl">
					<li>
						{rules.map((val, i) => `${val.full}件${val.discount / 10}折` + (i !== rules.length - 1 ? ";" : "")).join('')};
					</li>
				</ul>
			)
		}
	},
	optionbuy: {
		link(itemData) {
			return `/optionBuyActivity?promotion_id=${itemData.promotion_id}&shop_id=${itemData.shop_id}`
		},
		getValue(props) {
			let {itemdata} = props;
			return (<span>{`${itemdata.rules.rule.option_amount}元任选${itemdata.rules.rule.option_quantity}件`}</span>)
		}
	},
	// 直降
	directreduction: {

		getValue(props) {
			let {specs, promotion} = props;
			let {itemRules} = promotion;
			let sku_ids = itemRules.sku_ids.slice();
			let {min_promotion_price} = itemRules;
			let keys = Object.keys(specs), num;

			sku_ids = sku_ids.filter((val) => itemRules[val].promotion_price == min_promotion_price);

			keys.forEach((key) => {
				if (sku_ids.indexOf(specs[key].sku_id) >= 0 && (!num || specs[key].price - min_promotion_price > num)) {
					num = specs[key].price - min_promotion_price
				}
			})

			return (
				<span>直降{num.toFixed(2)}元 </span>
			)
		}
	},
	//秒杀

	seckill: {
		name: "seckill",
		getNum(props, state) {
			let {itemRules} = props;
			let count = itemRules.user_buy_limit - itemRules.user_buy_count;
			if (state.nowPromotioinSpec) {
				return Math.min(count, state.nowPromotioinSpec.real_store);
			}
			return count
		},
		getStore(props, state) {
			return state.nowPromotioinSpec ? state.nowPromotioinSpec.real_store : true
		},
		getValue(props) {
			return (<span>限时秒杀,每个ID限购{props.promotion.itemRules.user_buy_limit}件</span>)
		}
	},
	//加价换购
	exchangebuy: {
		getValue(props) {
			let {itemdata} = props;
			if (props.flag) {
				return (<a
					href={`/exchangeBuyActivity?promotion_id=${itemdata.promotion_id}&shop_id=${itemdata.shop_id}`}><span>满{itemdata.rules.rule.exchange_full}元加价可在购物袋换购热销商品</span><i
					className="icon icon-forward vertical-middle"><img
					src="/src/img/icon/arrow/arrow-right-icon.png"/></i></a>)
			} else {
				return (<span>满{itemdata.rules.rule.exchange_full}元加价可在购物袋换购热销商品</span>)
			}
		}
	},
	//赠品
	giftsbuy: {
		getValue(props) {
			if (props.flag) {
				let keys = Object.values(props.itemdata.subItems);
				let ret = [];
				keys.forEach((i, keys) => {
					for (let k in i) {
						ret.push(i[k])
					}
				});
				let html = ret.map(function (item, i) {
					return <li key={i}>
						<span className="title">赠品{i + 1}</span>
						<a href={`/item?item_id=${item.item_id}`}><span className="image"><img
							src={item.subItemStatus === "open" ? item.primary_image : "/src/img/item/no-item.png"}/></span></a>
						<i>×{item.giftNum}</i>
					</li>
				});
				return (<div className="gift-title"><p style={{lineHeight: "45px"}}>购买可获赠热销商品，赠完为止</p>
					<div className="gift-wrapper">
						<ul className="gift-buy">
							<div className="wrapper">
								{html}
							</div>
						</ul>
					</div>
				</div>)
			} else {
				return <div className="gift-title"><p style={{display: "inline-block"}}>购买可获赠热销商品，赠完为止</p></div>
			}
		}
	},
	default() {
		return null
	}
}

export function FreePostage({data, className}) {
	let {is_free} = data.dlytmplInfo;
	return (
		+is_free ? <span className={className + " free-postage-tag"}>包邮</span> : null
	)
}

export function urlParam(props, ret) {
	let {user_id, for_ap, roomInfoId} = props.location.query;
	// 添加分佣用户id
	if (user_id) {
		ret.commission_user_id = user_id
	}
	//直播
	if (for_ap) {
		ret['params[for_ap]'] = for_ap
	}
	if (roomInfoId) {
		ret['params[roomInfoId]'] = roomInfoId
	}
	return ret
}


function CouponClassFix(data) {
	if (data.isset_limit_money) {
		return "coupon-red"
	} else {
		return "coupon-yellow"
	}
}

export let CouponType = {
	text(data) {
		let txt;
		if (data.coupon_type === 0) {
			//	店铺券
			txt = data.shop_name + "适用";
		} else if (data.coupon_type === 1) {
			//	跨店券
			if (data.used_shop_type === "self") {//自营券
				if (data.used_category === "all") {//自营全部分类
					if (data.used_brand === "all") {//自营全场
						txt = '指定自营商品适用';
					} else {//自营部分品牌
						txt = '自营商品指定品牌适用';
					}
				} else {//自营部分分类
					if (data.used_brand === "all") {//自营部分分类
						txt = '自营商品指定分类适用';
					} else {//自营部分分类、品牌
						txt = '自营商品指定分类、品牌适用';
					}
				}
			} else {
				if (data.used_category === "all") {//全部分类
					if (data.used_brand === "all") {//全场
						txt = '指定商品适用';
					} else {//平台部分品牌
						txt = '指定品牌适用';
					}
				} else {//部分分类
					if (data.used_brand === "all") {//部分分类
						txt = '指定分类适用';
					} else {//部分分类、品牌
						txt = '指定分类、品牌适用';
					}
				}
			}
		} else {
			if (data.used_category === "all") {//平台全部分类
				if (data.used_brand === "all") {//平台全场
					txt = '全平台（特殊商品除外）';
				} else {//平台部分品牌
					txt = '指定品牌适用';
				}
			} else {//平台部分分类
				if (data.used_brand === "all") {//平台部分分类
					txt = '指定分类适用';
				} else {//平台部分分类、品牌
					txt = '指定分类、品牌适用';
				}
			}
		}
		return txt
	},
	title(data) {
		return data.coupon_type === 0 ? "店铺券" : (data.coupon_type === 1 ? (data.used_shop_type === "self" ? "自营券" : "跨店券") : "平台券")
	}
}

let EvaluateGrade = {
	"Good": "好评!",
	"Bad": "差评!",
	"Neutral": "中评!"
}


export function getPrice(props) {
	let {data, nowPromotioinSpec, nowSpec, itemRules, showPrice} = props;
	let type = judgeBunisess(props.data.item.marks, props.promotion);
	if (type) {
		let ret = getBunisessRet(props);
		if (ret["number"] === "1" && !nowSpec) {
			return parseFloat(ret["price"]).toFixed(2)
		} else {
			if (props.num >= ret["number"]) {
				return parseFloat(ret["price"]).toFixed(2)
			} else {
				return showPrice || parseFloat(nowSpec && nowSpec.price || data.item.sell_price)
			}
		}
	} else {
		return showPrice || parseFloat(nowPromotioinSpec && nowPromotioinSpec.promotion_price || nowSpec && nowSpec.price || itemRules.min_promotion_price || data.item.sell_price).toFixed(2)
	}
}

export function getDefaultSku(props) {
	let {skus} = props, skuArr = [];
	if (!(skus instanceof Array)) {
		for (let key in skus) {
			skuArr.push(skus[key]);
		}
	}
	if (skuArr.length === 1) {
		return skuArr[0].spec_values
	}
}

//判断是否是企业购商品，提交订单是URL加参数
export function judgeBunisess(marks, promotion) {
	let buy_type;
	if (marks && (!(marks instanceof Array) && (!promotion.itemRules) && marks.business)) {
		return buy_type = 1;
	} else {
		return buy_type = 0;
	}
};

export function getBunisessRet(props) {
	let {nowSpec, data} = props;
	let {item} = data;
	let rules, obj = {}, marks;
	if (nowSpec) {
		let skuId = nowSpec.sku_id, SKU = item.skus;
		for (let key in SKU) {
			if (skuId === Number(key)) {
				rules = SKU[key].marks.business.rules
			}
		}
	} else {
		marks = item.marks;
		rules = marks.business.rules;
	}
	for (let k in rules) {
		obj["number"] = k;
		obj["price"] = rules[k];
	}
	return obj
};

class ScrollImage extends Component {

	static defaultProps = {
		src: "",
		alt: ""
	};

	render() {
		return (
			<div className="swiper-slide"><img data-src={this.props.src} alt={this.props.alt} className="swiper-lazy"/>
				<div className="swiper-lazy-preloader"></div>
			</div>
		)
	}
}


export class ScrollImageState extends Component {
	static defaultProps = {
		isUpdate: true
	};

	componentDidMount() {
		this.initSwiper();
	}

	componentDidUpdate() {
		//  if (this.props.isUpdate) {
		//      this.initSwiper();
		//  }
	}

	initSwiper() {
		if (this.swiper) {
			this.swiper.destroy();
		}
		this.swiper = new Swiper(this.refs.swiper, {
			pagination: '.swiper-pagination',
			lazyLoading: true,
			paginationClickable: true,
			spaceBetween: 30,
			centeredSlides: true,
			loop: false,
			autoplayDisableOnInteraction: false
		});
	}

	render() {
		let html = this.props.data.map(function (item, i) {
			return <ScrollImage key={i} src={item}/>
		});
		let {H5_pic, H5D_pic, group_data} = this.props;
		return (
			<div className="c-pr" data-plugin="swiper" data-page="trade-list">
				{H5_pic ? <img className="c-pa" style={{width: '120px', top: 0, left: 0, zIndex: 3}}
											 src={H5_pic}/> : (group_data && group_data.group_type === "ROOKIE_GROUP" ?
					<img className="c-pa" style={{width: "40px", top: "10px", left: "10px", zIndex: 3}}
							 src="/src/img/activity/new-group.png"/> : "")}
				<div className="swiper-container detail-banner" ref="swiper">
					<div className="swiper-wrapper">
						{html}
					</div>
					<div className="swiper-pagination"></div>
				</div>
				{H5D_pic ? <img style={{width: '100%'}} src={H5D_pic}/> : ''}
			</div>
		)
	}
}


export class GoodsTit extends Component {
	render() {
		let strfilterTrade = FilterTrade(this.props.item.trade_type);
		let tradeClass = FilterTradeClass(this.props.item.trade_type);
		let {marks} = this.props.item;
		let {promotion} = this.props;
		let type = judgeBunisess(marks, promotion);
		return (
			<span>
				<p className="goods-tit">
					{type ? <span className="enterprise-purchase">企业购</span> : ""}
					{strfilterTrade &&
					<span className={tradeClass}>{strfilterTrade}</span>}
					{this.props.item.title}
				</p>
				{this.props.item.sub_title ? <p className="c-fs12 c-c666 sub-title">{this.props.item.sub_title}</p> : ""}
			</span>
		)
	}
}

export class Price extends Component {

	getPrice() {
		let {item_type} = this.props.data;
		let {price} = this.props;
		let type = judgeBunisess(this.props.item.marks, this.props.promotion);
		let ret = type ? getBunisessRet(this.props) : {};
		return parseFloat(price ? price : (item_type == "invest" ? 0 : (type && ret["number"] === "1" ? ret["price"] : (this.props.itemRules.min_promotion_price || this.props.data.item.sell_price)))).toFixed(2);
	}

	render() {
		let {market_price} = this.props.data.item;
		let {marks} = this.props.item;
		let {promotion} = this.props;
		let type = judgeBunisess(marks, promotion);
		return (
			<div>
				<div className="price-info">
					<span className="sale action-update-price c-fl"> ¥{this.getPrice()}</span>
					{market_price ?
						<span className="sale  market-price c-fl"> ¥{market_price.toFixed(2)}</span> : null }
					<FreePostage {...this.props} className="c-fl"/>
				</div>
				{type ? <EnterprisePurchase {...this.props}/> : ""}
			</div>

		)
	}
}

//企业购
export class EnterprisePurchase extends Component {
	render() {
		let ret = getBunisessRet(this.props);
		return ret["number"] > 1 ? <div className="EP">
			<span className="c-fs13 EPur">满{ret["number"]}件¥{ret["price"]}每件</span>
		</div> : null
	}
}

export class Tag extends Component {
	getList() {
		let brandcountryImg = this.props.item.country;
		let tradeType = this.props.item.trade_type;
		let selfSupport = this.props.item.self_support;
		let strFilterTradeType = FilterTradeType(tradeType);
		let ret = [];

		brandcountryImg && ret.push(<li key='brandcountry'><img src={brandcountryImg.image}/>{brandcountryImg.text}
		</li>);
		selfSupport && ret.push(<li key='trc'><img src="/src/img/icon/trc-logo-icon.png"/> 泰然城</li>);
		strFilterTradeType && ret.push(<li key='tradetype'><img
			src="/src/img/icon/trade-type-icon.png"/> {strFilterTradeType}</li>);
		return ret;
	}

	render() {
		let style = this.getList();
		return (style.length ? <div className="all-tag">
			<ul>
				{style}
			</ul>
		</div> : null)
	}
}


export class PriceArea extends Component {
	render() {
		return (
			<div className="price-area">
				<Price item={this.props.data.item} dlytmplInfo={this.props.data.dlytmplInfo} {...this.props}/>
				<GoodsTit item={this.props.data.item} promotion={this.props.promotion}/>
				<Tag item={this.props.data.item}/>
			</div>
		)
	}
}

class Add extends Component {
	static contextTypes = {
		isApp: React.PropTypes.bool,
		store: React.PropTypes.object
	};

	componentWillMount() {
		let {data} = this.props;

		this.setState({areaDate: this.props.data.default_city});

		window.onAreaResult = onAreaResultJSBrige(data.item.delivery_regions, (data, flag) => {
			this.setState({
				areaDate: data
			});
			if (!flag) {
				Popup.MsgTip({msg: "不在配送区域"});
			}
		});
	}

	componentWillUnmount() {
		window.onAreaResult = null;
	}

	render() {
		let {data} = this.props;

		let html = (
			<div>
				配送：
				<span className="addr-fh"> {data.dlytmplInfo && data.dlytmplInfo.depart_add}</span> 至
				<i className="icon place-icon"></i>
				<span className="addr-solected">{this.state.areaDate}</span>
				<i className="icon icon-forward vertical-middle"><img
					src="/src/img/icon/arrow/arrow-right-icon.png"/></i></div>
		);

		return (
			<div className="addr-ser">
				<div className="sever-addr">
					{this.context.isApp ? <a href="jsbridge://getAreaInfo">{html}</a> : <LinkChange to="/">{html}</LinkChange>}
				</div>
			</div>
		)
	}
}


class GoodsModal extends Component {


	render() {
		let {item} = this.props.data;
		let departAdd = item.storehouse && item.storehouse.name;
		let isTradeFade = TradeFade(this.props.data);
		let {delivery_regions} = item;
		return (
			<Modal isOpen={this.props.modal} title="服务说明" className="modal sever-pop-wrap"
						 onClose={() => this.props.onClose()}>
				<section className="container">
					<ul>

						<li>

							<div className="hd">
								<i className="detail-serve-icon"></i> {item.support_ecard ? "支持活动e卡" : "不支持活动e卡"}
							</div>
							<div className="tax-cont">
								{item.support_ecard ? "支持活动e卡。" : "不支持活动e卡。"}
							</div>
						</li>
						{isTradeFade && item.trade_type !== "Domestic" ?
							<li>
								<div className="hd">
									<i className="detail-serve-icon"></i> 商品税费
								</div>
								<div className="tax-cont">
									按照国家规定，本商品适用于跨境综合税，税率为{(item.tax.tax_rate * 100).toFixed(2)}%， 实际结算税费请以提交订单时的应付总额明细为准。
								</div>
							</li> : null
						}

						{departAdd ?
							<li>
								<div className="hd">
									<i className="detail-serve-icon"></i> {departAdd}
								</div>

								<div className="tax-cont">
									本商品由{departAdd}发货。
								</div>
							</li> : null}
						<li>

							<div className="hd">
								<i className="detail-serve-icon"></i> 正品保证
							</div>
							<div className="tax-cont">
								泰然城每件商品都经过严苛的质量把关，保障正品、保障品质，杜绝一切假货，让您购物无忧。
							</div>
						</li>

						<li>
							<div className="hd">
								<i className="detail-serve-icon"></i> {!item.tags.free_refund ? "不支持" : null}七天无理由退货
							</div>
							<div className="tax-cont">
								{item.tags.free_refund ? "本商品支持7天无理由退货,在商品签收之日起7天内可发起退货申请,退回商品应当完好" : "本商品不支持七天无理由退货"}
							</div>
						</li>
						{typeof (delivery_regions) !== "boolean" ? <li>

							<div className="hd">
								<i className="detail-serve-icon"></i> 部分区域配送
							</div>
							<div className="tax-cont">
								本商品只支持部分配送区域。
							</div>
						</li> : null}

					</ul>
				</section>
			</Modal>
		)
	}
}


class Goods extends Component {

	constructor(props) {
		super(props);
		this.state = {
			modal: false
		}
	};

	onClose() {
		this.setState({
			modal: !this.state.modal
		})
	}

	render() {
		let {data} = this.props;
		let departAdd = data.item.storehouse && data.item.storehouse.name;
		let isTradeFade = TradeFade(this.props.data);
		let {delivery_regions} = data.item;
		return (
			<div className="goods-tax" onTouchTap={() => this.setState({modal: !this.state.modal})}>
				<div className="promotion-ti c-fl">说明：</div>

				<GoodsModal {...this.props} modal={this.state.modal} onClose={() => this.onClose()}/>
				<section className="promotion-list c-fl">
					<div className="list-details">
						<ul>
							<li><i className="detail-serve-icon"></i>{data.item.support_ecard ? "支持活动e卡" : "不支持活动e卡"}</li>
							{
								isTradeFade && data.item.trade_type !== "Domestic" ?
									<li><i className="detail-serve-icon"></i>商品税费</li> : null
							}
							{departAdd ?
								<li><i className="detail-serve-icon"></i>{departAdd}</li>
								: ""}
							<li><i className="detail-serve-icon"></i>正品保证</li>
							<li><i className="detail-serve-icon"></i>{data.item.tags.free_refund ? "支持" : "不支持"}七天无理由退货</li>
							{+data.dlytmplInfo.is_free ? <li><i className="detail-serve-icon"></i>包邮</li> : null}
							<li><i className="detail-serve-icon"></i>担保交易</li>
							{typeof (delivery_regions) !== "boolean" ? <li><i className="detail-serve-icon"></i>部分区域配送</li> : ""}
						</ul>
						<i className="icon icon-forward vertical-middle"><img
							src="/src/img/icon/arrow/arrow-right-icon.png"/></i>
					</div>
				</section>
				<p className="clearfix"></p>
			</div>
		)
	}
}


export class SeverArea extends Component {
	render() {
		let {store} = this.context;
		return (
			<div>
				<Add {...this.props} />
				<Goods {...this.props} />
			</div>
		)
	}
}

export class ShopArea extends Component {
	render() {
		let {shop} = this.props.data.item;
		return (
			shop.open_state === "open" ?
				<ul className="shop-arer">
					<li className="image">
						<LinkChange to={`/store/home?shop=${+shop.shop_id}`}>
							<img src={shop.logo}/>
						</LinkChange>
					</li>
					<li>
						<p className="shop-name c-fs15">{shop.alias ? shop.alias : shop.name}</p>
						<p className="shop-msg c-fs10 c-c999">泰然城精选商家，品质保证</p>
					</li>
					<li className="button">
						<Link className="link" to={`/store/home?shop=${+shop.shop_id}`}>
							进入店铺
						</Link>
					</li>
				</ul> : null
		)
	}
}

export class EvaluateArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			update: false
		}
	}

	componentDidMount() {
		$.ajax(Action("Preview", {
			data: {
				item_id: this.props.itemId
			},
			success: (res) => {
				this.setState({
					update: true,
					data: res
				})
			}
		}))
	}

	render() {
		let {itemId, data} = this.props;
		return (
			<div className="evaluate-area detail">
				<div className="hd">
					<LinkChange to={`/evaluate?item_id=${itemId}`} data-notLogin={true}>
						商品评价 {this.state.update ? `(${this.state.data.total})` : null }
						<i className="icon icon-forward vertical-middle"><img
							src="/src/img/icon/arrow/arrow-right-icon.png"/></i>
					</LinkChange>
				</div>

				{this.state.update ? <EvaluateAreaContents data={this.state.data} itemId={this.props.itemId}/> : null}
			</div>
		)
	}
}

export class EvaluateAreaContents extends Component {

	getList() {
		let {rates} = this.props.data;
		let {itemId} = this.props;
		let flag = true;
		if (rates.length == 3) {
			rates.some((val) => {
				if (!val.images.length) flag = false
			})
		} else {
			flag = false;
		}

		if (flag) {
			return rates.map((val, i) => <EvaluateAreaContent data={val} key={i} itemId={itemId}/>)
		}
		return null
	}

	componentDidMount() {
		if (this.refs.swiper) {
			this.initSwiper();
		}
	}

	initSwiper() {
		this.swiper = new Swiper(this.refs.swiper, {
			loop: false,
			slidesPerView: 1.5,
			spaceBetween: 10
		});
	}

	render() {
		let html = this.getList();

		return (
			html ?
				<div data-plugin="swiper">
					<div className="swiper-container evaluate-swiper-container" ref="swiper">
						<div className="swiper-wrapper">
							{html}
						</div>
					</div>
				</div>
				: null
		)
	}
}
//
class EvaluateAreaContent extends Component {
	getName(name) {
		return name ? name.replace(/(\d{3})\d{5}(\d{3})/, "$1*****$2") : null
	}

	render() {
		let {data, itemId} = this.props;
		return (
			<div className="swiper-slide">
				<LinkChange to={`/evaluate?item_id=${itemId}`} data-notLogin={true}>
					<div className="c-fl">
						<h2><span><img
							src={data.head_portrait || "/src/img/icon/avatar/no-user.png"}/></span><font>{this.getName(data.show_name)}</font>
						</h2>
						<div className="evaluate-content">
							{data.content || EvaluateGrade[data.experience]}
						</div>
					</div>
					<div className="c-fr">
						<img src={data.images[0]}/>
					</div>
				</LinkChange>
				<p className="c-cb"></p>
			</div>
		)
	}
}

function dangerouslySet(data) {
	return <div className="goods-pic" dangerouslySetInnerHTML={{__html: data.item.desc && data.item.desc.handset}}></div>
}

export class GoodsDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: 0,
			twcontent: false
		}
	}

	componentDidMount() {
		let height = $(window).height();
		let self = this;
		let twOffset = $(this.refs.twContent).offset().top;
		this.twContentPosition = twOffset
		$(this.refs.detail).css('min-height', height - 40);

		function fn() {
			if (window.scrollY + height >= twOffset) {
				self.state.twcontent = true;
				self.setState(self.state)
				$(window).unbind("scroll", fn);
			}
		}

		$(window).bind('scroll', fn)

	}

	changeTag(active) {
		if (active != this.state.active) {
			this.setState({
				active
			})
			document.body.scrollTop = this.twContentPosition;
		}
	}

	checkTag(active) {
		return this.state.active === active ? "active" : "";
	}

	getList() {
		let {item} = this.props.data
		let {properties} = this.props.data.item;
		let ret = [
			<li key="id">商品编号：<span className="c-fr">{item.art_no}</span></li>,
			<li key="time">上架时间：<span className="c-fr">{dateUtil.format(item.shelved_at * 1000, "Y-M-D")}</span></li>,
			<li key="weight">商品毛重：<span className="c-fr">{item.weight}kg</span></li>
		];
		for (var i in properties) {
			ret.push(<li key={i}>{properties[i].name}：<span className="c-fr">{properties[i].text}</span></li>)
		}
		return ret
	}

	getGoodsHtml() {
		return {__html: 'First &middot; Second'};
	}

	render() {
		let {data} = this.props;
		let item_t_type = data.item.trade_type;
		return (
			<div className="pic-area detail goods-detail" ref="twContent">
				<Fix>
					<div className="tab-ti-wrap">
						<div className="tab-ti">
							<ul>
								<li className={this.checkTag(0)} onClick={() => this.changeTag(0)}><span>图文详情</span>
								</li>
								<li className={this.checkTag(1)} onClick={() => this.changeTag(1)}><span>商品参数</span>
								</li>
							</ul>
						</div>
					</div>
				</Fix>
				<div className="tab-con">
					<div className={"tw-con " + this.checkTag(0)}>
						{item_t_type == 'Direct' || item_t_type == 'Overseas' ?
							<div className='zhiyou img-w'>
								<img src="/src/img/pintuan/zhiyou.jpg"/>
							</div>
							: null
						}
						{ this.state.twcontent ? dangerouslySet(data) : null}
						{ item_t_type == 'Direct' || item_t_type == 'Bonded' || item_t_type == 'Overseas' ?
							<div className="goods_text img-w">
								<img src="/src/img/pintuan/goods_text.jpg"/>
							</div>
							: ''
						}
						<div className="price_text img-w">
							<img src="/src/img/pintuan/price_text.jpg"/>
						</div>
					</div>
					<div className={"cs-con " + this.checkTag(1)} ref="detail">
						<ul className="goods-detail">
							{this.getList()}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}


// 收藏
export class Collect extends Component {
	componentWillMount() {
		this.state = {
			collect: this.props.data.collect
		}
	}

	locked(flag) {
		if (flag != null) {
			this.update = flag;
		}
		return this.update
	}

	onCollect() {
		let self = this;
		if (!this.locked()) {
			this.locked(true);
			let action = Action(this.state.collect ? "DelFav" : "Fav", {
				data: {
					item_id: this.props.itemId
				},
				success(data) {
					if (data.status) {
						self.setState({
							collect: !self.state.collect
						})
					}
				},
				complete() {
					self.locked(false)
				}
			});
			$.ajax(action)
		}

	}

	render() {
		return (
			<div className="collect">
				<LinkChange className={this.state.collect ? "save curr uncollect-goods" : "save collect-goods"}
										onClick={() => this.onCollect()}>
					{
						this.state.collect ? [<span className="icon icon-favor text_sc" key="0"><img
							src="/src/img/icon/collected-icon.png"/></span>, <span className="icon-title" key="1">已收藏</span>] :
							[<span className="shoucang" key="0"><img src="/src/img/icon/collect-icon.png"/></span>,
								<span className="icon-title" key="1"> 收藏</span>]
					}
				</LinkChange>

			</div>
		)
	}
}

// 购物袋
export class ToCart extends Component {

	render() {
		let {data} = this.props
		return (
			<div className="collect serve-kf tocart">
				<a href="trmall://shoppingbag" className="save">

                <span className="details-kf">
                <img src="/src/img/icon/tocart-icon.png"/>
									{data.cartCount && data.cartCount.countCart ? <em>{data.cartCount.countCart}</em> : null }
                </span>

					<span className="icon-title">购物袋</span>
				</a>
			</div>
		)
	}
}

export class Specs extends Component {

	initList() {
		let {isOn, spec, changeOn, data} = this.props;
		let defaultS = getDefaultSku(data.item) ? "on" : "";
		let values = spec.values;
		let ret = [];
		let keys = Object.keys(values);
		keys.forEach((i, keys) => {
			let specValue = values[i];
			ret.push(
				<li key={keys} className={isOn(specValue.spec_value_id, spec.spec_id) || defaultS}
						onTouchTap={ () => changeOn(specValue.spec_value_id, spec.spec_id)}>
					<a href="javascript:void(0);" title={specValue.text}>
						{spec.show_type == "Text" || !specValue.image ? specValue.text :
							<img src={specValue.image} width="25" height="25"/>}
					</a>
				</li>)
		})

		return ret
	}

	render() {
		let {spec} = this.props;
		return (
			<div className="color parameter">
                <span className="tit">
                {spec.name}
                </span>
				<ul className="size_ul">
					{this.initList()}
				</ul>
			</div>

		)
	}
}


class BuyModalTitle extends Component {

	initList() {
		let {clickList, getSpec, data} = this.props;
		let defaultSku = getDefaultSku(data.item) || {};
		let keys = $.isEmptyObject(clickList) ? Object.keys(defaultSku) : Object.keys(clickList);
		let list = [], spec;
		if (!keys) {
			return
		} else {
			keys.forEach((val, keys) => {
				spec = $.isEmptyObject(clickList) ? getSpec(val, defaultSku[val]) : getSpec(val, clickList[val]);
				list.push(<span key={keys}>{spec.text}</span>)
			});
			return (
				<p className="text-price-sel" style={{display: "block"}}>已选
					{list}
				</p>
			)
		}
	}

	getImg() {
		let {clickList, getSpec, data} = this.props;
		let defaultSku = getDefaultSku(data.item);
		let keys = Object.keys(defaultSku || clickList).reverse();
		let ret, spec;
		keys.some((val, keys) => {
			spec = getSpec(val, (defaultSku && defaultSku[val] || clickList[val]));
			ret = spec.image;
			return ret
		});
		if (!ret) {
			return this.props.data.item.primary_image
		} else {
			return ret
		}
	}

	render() {
		let {item} = this.props.data;
		let strfilterTrade = FilterTrade(item.trade_type);
		let tradeClass = FilterTradeClass(item.trade_type);
		let type = judgeBunisess(this.props.data.item.marks, this.props.promotion);
		return (
			<ul className="ui-table-view">
				<li className="ui-table-view-cell">
                <span className="posit-img"><img className="ui-media-object ui-pull-left" src={this.getImg()}
																								 width="80" height="80"/></span>
					<div className="ui-media-body window-head">
						{
							strfilterTrade ?
								<p style={{position: "relative", height: "18px"}}>
									<span className={tradeClass}>{strfilterTrade}</span>
								</p> : null
						}
						<div className="price-tag">
							<p className="ui-ellipsis text-price action-update-price">
								¥{getPrice(this.props)}</p>
							<p className="free-postage-tag-wrap">
								<FreePostage {...this.props} />
							</p>
						</div>
						{type ? <EnterprisePurchase item={item} modalFlag={true}{...this.props}/> : this.initList()}
					</div>

				</li>
			</ul>
		)
	}
}

export class ExpectTax extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rateShow: false
		}
	}

	getRate() {
		let {item} = this.props.data;
		let isTradeFade = TradeFade(this.props.data);

		if (!isTradeFade || item.trade_type === "Domestic") {
			return null
		}
		let realRate = item.tax.tax_rate * 100;
		let rate = realRate.toFixed(2);
		let price = getPrice(this.props);
		let tax = ((this.props.num ? this.props.num : 1) * realRate * price / 100);
		tax = (+tax.toFixed(2) + (tax - tax.toFixed(2) >= 0.001 ? 0.01 : 0)).toFixed(2);
		return (<div>
			<div className="expect_tax" onClick={() => this.setState({rateShow: !this.state.rateShow})}>
				预计税费
				<span className={"icon_slide c-fr " + (this.state.rateShow ? "rotate" : "")}><img
					src="/src/img/icon/arrow/arrow-btm-icon.png"/></span>
				<span className="tax_count c-fr" style={{display: this.state.rateShow ? "none" : "block"}}>￥{tax}</span>
			</div>
			<div className="expect_tax_con disnon" style={{display: this.state.rateShow ? "block" : "none"}}>
				<div className="tax_count">￥{tax}</div>
				<div className="hd">
					<img src="/src/img/icon/checked-icon.png"/> 税率<span id="tax_cou">{rate}</span>%
				</div>
				<div className="tax_cont tax_cont1"> 按照国家规定，本商品适用于跨境综合税，税率为{rate}%， 实际结算税费请以提交订单时的应付总额明细为准。</div>
				<div className="hd">
					<img src="/src/img/icon/checked-icon.png"/> 税费计算
				</div>
				<div className="tax_cont">
					进口税费=商品完税价格(包括运费)*税率
				</div>
			</div>
		</div>)
	}

	render() {
		return this.getRate()
	}
}

class BuyModalInfo extends Component {

	initList() {
		let {specs} = this.props.data.item;
		let specsKeys = Object.keys(specs);
		let ret = [];
		specsKeys.forEach((val, keys) => {
			ret.push(<Specs spec={specs[val]} {...this.props} key={keys}/>)
		});
		return ret
	}

	getLimit() {
		let {activity_type} = this.props.data;
		let {itemRules} = this.props
		if (activity_type == PromotionInfo.flashsale.name) {
			return (
				<span className="limit_buy">限购{itemRules.user_buy_limit}件
					{itemRules.user_buy_count ? `(已购${itemRules.user_buy_count}件)` : ""}
                </span>
			)
		}
		return null
	}


	render() {
		let {addMinNum, num} = this.props;

		return (
			<div className="attr-wrap">
				<div className="standard-area stable-standard cur">
					<div className="standard-info">
						{this.initList()}
					</div>
				</div>
				<div className="buy-amount">
					<span className="amount-tit">数量：</span>
					<span className="number-increase-decrease" style={{position: "relative"}}>
                        <a href="javascript:void(0);" className="btn action-decrease"
													 onTouchTap={() => addMinNum(-1)}>-</a>
                        <input type="number" readOnly className="action-quantity-input"
															 value={num}/>
                        <span className="input_bak"></span>
                        <a href="javascript:void(0);" className="btn action-increase"
													 onTouchTap={() => addMinNum(1)}>+</a>
                </span>
					{this.getLimit()}
					<div className="clearfix"></div>
				</div>
				<ExpectTax {...this.props} />
			</div>
		)
	}
}

class BuyModalButton extends Component {
	noop() {
	}

	render() {
		let {active, onClickCart, onClickBuy, getStore, purchaseLimit} = this.props;
		let isPurchaseLimit = purchaseLimit();

		return (
			<div className="buy-option-btn">
				{  getStore() ? active === "cart" ? <div className="btn-addcart" onTouchTap={onClickCart}>加入购物袋</div> :
					<div>
						{ isPurchaseLimit ? <span className="purchase-limit">抱歉，海外直邮类商品和跨境保税类商品总价超过限额￥2000，请分次购买。</span> : null}
						<div className={isPurchaseLimit ? "c-bgc9" : "" + " btn-tobuy "}
								 onTouchTap={isPurchaseLimit ? this.noop : onClickBuy}>立即购买
						</div>
					</div>
					:
					<div className="buy_fast_no has_sellout" style={{color: "#fff", zIndex: 15, background: "#FF8888"}}>已售罄</div>
				}
			</div>
		)
	}
}


export class BuyModal extends Component {

	componentWillMount() {
		this.state = this.initState();
	}

	isOn = (id, spec) => {
		return this.state.clickList[spec] == id ? "on" : ""
	}

	changeOn = (id, spec) => {
		if (this.state.clickList[spec] === id) {
			return
		}
		this.state.clickList[spec] = id;
		if (this.updateSpec())
			this.updateNum(this.state.num);
		this.setState(this.state);
	}

	updateNum(num) {
		let {store} = this.props.data.item;
		let {activity_type,promotion} = this.props.data
		let {nowSpec, nowPromotioinSpec} = this.state
		let snum, fn;
		if (num < 1) {
			return false
		}
		if (PromotionInfo[activity_type] && (fn = PromotionInfo[activity_type].getNum)) {
			snum = fn(this.props, this.state)
		} else {
			let limit = (promotion&&promotion.itemRules&&promotion.itemRules.user_buy_limit)?promotion.itemRules.user_buy_limit:0;
			let aNum = 0;
			if(nowPromotioinSpec && nowPromotioinSpec.real_store){
				aNum = nowPromotioinSpec.real_store>limit?limit:nowPromotioinSpec.real_store;
			}
			snum = aNum || (nowSpec ? nowSpec.store : store.total - store.freeze);
		}

		this.changeState({
			num: num > snum ? snum == 0 ? 1 : snum : num
		});

		return num > snum ? snum : true
	}

	changeState(obj) {
		this.setState(Object.assign(this.state, obj));
	}

	initState(num) {
		let ret = {
			isValid: this.state && this.state.isValid,
			nowSpec: null,
			clickList: {},
			nowSpecKey: null,
			nowPromotioinSpec: null,
			num: num || 1
		}

		let {specs} = this.props.data.item;
		this.specList = Object.keys(specs);
		if (!this.specList.length) {
			let nowSpec = ret.nowSpec = this.props.specs[0];
			ret.nowPromotioinSpec = this.props.itemRules[nowSpec.sku_id]
		}

		return ret
	}

	getSpec = (id, specId) => {
		let {specs} = this.props.data.item;

		return specs[id].values[specId];
	}

	addMinNum = (num) => {
		let cnum = this.state.num + num;
		let v = this.updateNum(cnum);

		if (v !== true) {
			Popup.MsgTip({
				msg: num < 0 ? createMSG("MINNUM") : createMSG("MAXNUM", v)
			})
		}
	}

	onClickCart = () => {
		let defaultSku = getDefaultSku(this.props.data.item);
		if (Object.prototype.toString.call(defaultSku) === "[object Object]") {
			this.state.clickList = defaultSku ? defaultSku : {};
			this.updateSpec();
		}
		if (!this.checkSpec()) {
			Popup.MsgTip({
				msg: createMSG("SELECTSPEC")
			});
			return
		}
		$.ajax(Action("toCart", {
			data: this.getActionData(),
			success: () => {
				this.props.toggleModal();
				this.props.addCartSuccess && this.props.addCartSuccess()
			}
		}))
	}
	getStore = () => {
		let {activity_type} = this.props.data;
		let fn;
		if (PromotionInfo[activity_type] && (fn = PromotionInfo[activity_type].getStore)) {
			return fn(this.props, this.state)
		} else if (this.state.nowPromotioinSpec && (this.state.nowPromotioinSpec.real_store || (this.state.nowPromotioinSpec.real_store===0))) {
			return this.state.nowPromotioinSpec.real_store > 0
		} else if (this.state.nowSpec) {
			return this.state.nowSpec.store > 0
		} else {
			return true
		}
	}

	purchaseLimit = () => {
		let {trade_type} = this.props.data.item;
		if (this.state.num > 1 && this.state.nowSpec && PurchaseLimit(trade_type)) {
			return this.state.num * this.state.nowSpec.price > 2000
		}
	}

	getActionData(flag) {
		let ret = {
			"item[item_id]": this.props.itemId,
			"item[quantity]": this.state.num,
			"item[sku_id]": this.state.nowSpec.sku_id,
		};
		// 添加分佣用户id
		/*if (user_id) {
		 ret.commission_user_id = user_id
		 }*/
		ret = urlParam(this.props, ret);
		flag && (ret.mode = "fast_buy");
		return ret
	}

	closeAndClear() {
		this.setState(this.initState());
		this.props.toggleModal();
	}

	onClickBuy = () => {
		let buy_type;
		let defaultSku = getDefaultSku(this.props.data.item);
		if (Object.prototype.toString.call(defaultSku) === "[object Object]") {
			this.state.clickList = defaultSku ? defaultSku : {};
			this.updateSpec();
		}
		let {marks} = this.props.data.item;
		let {promotion} = this.props;
		// let buy_type = judgeBunisess(marks, promotion);
		if (!this.checkSpec()) {
			Popup.MsgTip({
				msg: createMSG("SELECTSPEC")
			});
			return
		}
		$.ajax(Action("toCart", {
			data: this.getActionData(true),
			success: (result) => {
				buy_type = result.data.buy_type;
				this.props.toggleModal();
				if (!result.status) {
					return;
				}
				// browserHistory.push('/orderConfirm?mode=fast_buy&buy_type=' + buy_type);
				location.href = '/orderConfirm?mode=fast_buy&buy_type=' + buy_type;
			}
		}))
	}

	updateSpec() {
		if (!this.checkSpec()) {
			return false;
		}
		let key = this.specList.join("_").replace(/\d+/g, (key) => this.state.clickList[key]);
		let nowSpec
		if (key !== this.state.nowSpecKey) {
			nowSpec = this.props.specs[key];
			this.changeState({
				nowSpec,
				nowSpecKey: key,
				nowPromotioinSpec: this.props.itemRules[nowSpec.sku_id]
			});
		}

		return this.state.nowSpec;
	}

	checkSpec() {
		if (Object.keys(this.state.clickList).length === this.specList.length) {
			return true
		}
	}

	render() {
		let props = {
			addMinNum: this.addMinNum,
			isOn: this.isOn,
			getStore: this.getStore,
			changeOn: this.changeOn,
			getSpec: this.getSpec,
			onClickCart: this.onClickCart,
			onClickBuy: this.onClickBuy,
			purchaseLimit: this.purchaseLimit.bind(this),
			...this.state,
			...this.props
		};
		return (
			<Modal isOpen={this.props.modal} onClose={() => this.closeAndClear()} className="action-buy-modal">
				<div className="in-panel">
					<div className="in-panel">
						<div className="close-btn-wrap">
							<span className="close-btn"><i className="icon icon-close"></i></span>
						</div>
						<BuyModalTitle {...props} />
						<BuyModalInfo {...props} />

						<BuyModalButton {...props} />
					</div>
				</div>
			</Modal>
		)
	}
}

export class Buy extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			active: null,
		}
	}

	active(tab) {
		this.setState({
			modal: true,
			active: tab
		})
	}

	toggleModal = () => {
		this.setState(Object.assign(this.state, {
			modal: false
		}))
	}
	isShelves = () => {
		return this.props.data.item.status === "Shelves"
	}

	isSaleOut() {
		let {promotion} = this.props;
		let {item} = this.props.data;
		let realStore = promotion && promotion.itemRules && promotion.itemRules.real_store;
		if (realStore == null) {
			realStore = +item.realStore
		}
		return !!realStore
	}

	isCharge() {
		let {item} = this.props.data;
		return item.is_charge
	}

	render() {
		let props = {
			...this.props,
			...this.state,
			toggleModal: this.toggleModal
		};
		return (
			this.isCharge() ? null :
				this.isShelves() ?
					this.isSaleOut() ?
						<div className="action-btn-group c-fr">
							<BuyModal {...props} />
							<LinkChange className="ui-btn  action-addtocart c-fl" onTouchTap={() => {
								Modal.close();
								this.active("cart")
							}}>加入购物袋</LinkChange>
							<LinkChange className="ui-btn  action-buy-now c-fl" onTouchTap={() => {
								Modal.close();
								this.active("buy")
							}}>立即购买</LinkChange>
						</div>
						:
						<div className="action-btn-group c-fr">
							<LinkChange type="button" className="ui-btn action-notify">已售罄</LinkChange>
						</div> :
					<div className="action-btn-group c-fr">
						<LinkChange type="button" className="ui-btn action-notify">暂不销售</LinkChange>
					</div>

		)
	}
}


export let createBuyAction = function ({Buy}) {

	return class BuyAction extends Component {

		render() {
			let serveId = this.props.data.item.shop.customer_service_id;
			let config = {
				"goods_id": this.props.itemId,
				"pageURLString": location.href,
				"settingid": serveId ? serveId : "xt_1000_1498530991111",
				"pageTitle": "商品详情"
			}
			let params = base64encode(utf16to8(JSON.stringify(config)));
			return (
				<div className="buy-action">
					{/*  客服 */}
					<div className="collect serve_kf">
						<a href={'jsbridge://xnchat?params=' + params}>
							<span className="details_kf"><img src="/src/img/icon/serve-phone-icon.png"/></span><span
							className="icon-title">客服</span>
						</a>
					</div>
					{/* 收藏 */}
					<Collect {...this.props}/>
					{/* 购物袋 */}
					<ToCart {...this.props} />
					{/* 加入购物袋 立即购买*/}
					<Buy {...this.props} />
				</div>
			)
		}
	}
}

let BuyAction = createBuyAction({Buy})


// 促销
export class PromotionWrap extends Component {
	getList() {

	}

	getPromotion() {
		let {promotion} = this.props;
		return promotion[0] ? <Promotion {...this.props}/> : null
	}

	render() {
		return (
			this.getPromotion()
		)
	}
}

class Promotion extends Component {
	constructor(props) {
		super(props)
		this.state = {modal: false}
	}

	getList(flag) {
		let {promotion} = this.props;
		let i = 0, ret = [], item;
		while (item = promotion[i]) {
			ret.push(<PromotionDefault {...this.props} itemdata={item} key={i} hasLink={flag} flag={flag}/>)
			i++
		}
		return ret
	}

	toggle(flag) {
		this.state.modal = flag
		this.setState(this.state);
	}

	render() {
		return (
			<div>
				<div className="goods-promotion" onClick={() => this.toggle(!this.state.modal)}>
					<Modal isOpen={this.state.modal} title="促销活动" onClose={() => this.toggle(false)}
								 className="goods-promotion-modal">
						<section className="promotion-list">
							<div className="list-details">
								<ul className="promotion-ul">
									{this.getList(true)}
								</ul>
							</div>
						</section>
					</Modal>

					<div className="promotion_ti c-fl">促销：</div>
					<section className="promotion-list c-fl">
						<div className="list-details">
							<ul className="promotion-ul">
								{this.getList()}
							</ul>
						</div>
					</section>
					<i className="icon icon-forward vertical-middle"><img
						src="/src/img/icon/arrow/arrow-right-icon.png"/></i>
					<p className="clearfix"></p>
				</div>
				<div className="gap bgf4"></div>
			</div>
		)
	}
}


class PromotionDefault extends Component {
	linkTo() {
		let link = this.getLink();
		if (link) {
			if (link === "/flashsale") {
				window.location.href = link
			} else {
				browserHistory.push(link);
			}
		}
	}

	getLink() {
		let {itemdata} = this.props;
		let PInfo = PromotionInfo[itemdata.promotion_type];

		if (PInfo) {
			return typeof PInfo.link === "function" ? PInfo.link(itemdata) : PInfo.link
		}
	}

	render() {
		let {itemdata, hasLink} = this.props;
		let PInfo = PromotionInfo[itemdata.promotion_type];
		return (
			<li className="promotion-li" onClick={() => hasLink && this.linkTo()}>
				<div className="clearfix">
					<button type="button" className="c-fl">{itemdata.promotion_tag}</button>
					{
						PInfo ? <PInfo.getValue {...this.props} /> : <PromotionInfo.default {...this.props} />
					}
					{hasLink && this.getLink() ? <i className="icon icon-forward vertical-middle"><img
						src="/src/img/icon/arrow/arrow-right-icon.png"/></i> : null}
				</div>
			</li>
		)
	}
}


// 分期
class StageModalInfo extends Component {
	initList() {
		let {specs} = this.props.data.item;
		let specsKeys = Object.keys(specs);
		let ret = [];
		specsKeys.forEach((val, keys) => {
			ret.push(<Specs spec={specs[val]} {...this.props} key={keys}/>)
		});
		return ret
	}

	initStateList() {
		let keys = Object.keys(this.props.specs);
		return <StageList {...this.props} strategy={this.props.specs[keys[0]]["periods"]}/>
	}

	render() {
		return (
			<div className="attr-wrap">
				<div className="standard-area">
					<div className="standard-info">
						{this.initList()}
					</div>
				</div>

				<div className="standard-area installment-area">
					<div className="standard-info">
						{this.initStateList()}
					</div>
				</div>
			</div>
		)
	}
}

export class StageList extends Component {

	initList() {
		let {isStageOn, strategy, changeStage} = this.props;
		let ret = [];
		strategy.forEach((key, i) => {
			ret.push(
				<li key={i} className={isStageOn(key)} onTouchTap={ () => changeStage(key)}>
					<a href="javascript:;" dangerouslySetInnerHTML={this.getText(key)}></a>
				</li>)
		})

		return ret
	}

	getText(val) {
		let sell_price = getPrice(this.props);
		let numT = ((sell_price / val.number + sell_price * val.fee_rate).toFixed(2))
		// let rateT = val.fee_rate == 0 ? "无手续费" : "手续费率" + val.fee_rate * 100 + "%";
		let rateT = val.fee_rate == 0 ? "无手续费" : "含手续费";

		return ({__html: "￥" + numT + "&times;" + val.number + "期<br/>" + rateT})
	}

	render() {
		let {spec} = this.props;
		return (
			<div>
				<ExpectTax {...this.props} />
				<div className="color parameter">
					<span className="tit c-fs14">分期购买</span>
					<div style={{height: "60px", overflow: "hidden", marginBottom: "10px"}}>
						<ul className="stage_ul">
							{this.initList()}
						</ul>
					</div>
				</div>
			</div>

		)
	}
}


class StageModalButton extends Component {
	render() {
		let {getStore, onClickStage} = this.props;

		return (
			<div className="buy-option-btn">
				{  getStore() ?
					<div className="btn-addcart" onTouchTap={onClickStage}>分期购买</div>
					: <div className="buy_fast_no has_sellout"
								 style={{color: "#fff", zIndex: 15, background: "#FF8888"}}>已售罄</div>
				}
			</div>
		)
	}
}

class StageModal extends Component {
	componentWillMount() {
		this.state = this.initState();
	}

	isOn = (id, spec) => {
		return this.state.clickList[spec] == id ? "on" : ""
	}
	onClickStage = () => {
		let ret = {
			"item[item_id]": this.props.itemId,
			"item[quantity]": 1,
			"item[sku_id]": this.state.nowSpec.sku_id,
			"obj_type": "stage_buy",
			'params[strategy]': this.state.nowSpec.strategy,
			"params[period]": this.state.stage.number,
			"params[fee_rate]": this.state.stage.fee_rate,
			"mode": "fast_buy"
		};
		ret = urlParam(this.props, ret);
		let defaultSku = getDefaultSku(this.props.data.item);
		if (Object.prototype.toString.call(defaultSku) === "[object Object]") {
			this.state.clickList = defaultSku ? defaultSku : {};
			this.updateSpec();
		}
		if (!this.checkSpec()) {
			Popup.MsgTip({
				msg: createMSG("SELECTSPEC")
			});
			return
		} else if (!this.state.stage) {
			Popup.MsgTip({
				msg: createMSG("STRATEGY")
			});
			return
		}

		$.ajax(Action("toCart", {
			data: ret,
			success: (result) => {
				this.closeAndClear();
				if (!result.status) {
					return;
				}
				// browserHistory.push('/orderConfirm?mode=fast_buy');
				location.href = '/orderConfirm?mode=fast_buy';
			}
		}))
	}

	closeAndClear() {
		this.props.toggleModal();
		this.setState(this.initState());
	}

	getSpec = (id, specId) => {
		let {specs} = this.props.data.item;

		return specs[id].values[specId];
	}
	changeOn = (id, spec) => {
		if (this.state.clickList[spec] === id) {
			return
		}
		this.state.clickList[spec] = id;
		this.state.stage = null

		this.updateSpec()
		this.setState(this.state);
	}

	initState() {
		let ret = {
			nowSpec: null,
			clickList: {},
			nowSpecKey: null,
			stage: null
		}

		let {specs} = this.props.data.item;
		this.specList = Object.keys(specs);

		if (!this.specList.length) {
			let nowSpec = ret.nowSpec = this.props.specs[0];
			ret.nowPromotioinSpec = this.props.itemRules[nowSpec.sku_id]
		}

		return ret
	}

	getStore = () => {
		if (this.state.nowSpec) {
			return this.state.nowSpec.store > 0
		} else {
			return true
		}
	}
	isStageOn = (stage) => {
		return this.state.stage === stage ? "on" : ""
	}

	changeStage = (stage) => {
		if (this.state.stage !== stage) {
			this.state.stage = stage;
			this.setState(this.state)
		}
	}

	updateSpec() {
		if (!this.checkSpec()) {
			return false;
		}
		let key = this.specList.join("_").replace(/\d+/g, (key) => this.state.clickList[key]);
		let nowSpec
		if (key !== this.state.nowSpecKey) {
			nowSpec = this.props.specs[key];
			this.changeState({
				nowSpec,
				nowSpecKey: key,
				nowPromotioinSpec: this.props.itemRules[nowSpec.sku_id]
			});
		}

		return this.state.nowSpec;
	}

	changeState(obj) {
		this.setState(Object.assign(this.state, obj));
	}

	checkSpec() {
		if (Object.keys(this.state.clickList).length === this.specList.length) {
			return true
		}
	}

	render() {
		let props = {
			isStageOn: this.isStageOn,
			changeOn: this.changeOn,
			isOn: this.isOn,
			getSpec: this.getSpec,
			getStore: this.getStore,
			onClickStage: this.onClickStage,
			changeStage: this.changeStage,
			...this.state,
			...this.props
		};
		return (
			<Modal isOpen={this.props.modal} onClose={() => this.closeAndClear()} className="action-buy-modal">
				<div className="in-panel">
					<div className="in-panel">
						<div className="close-btn-wrap">
							<span className="close-btn"><i className="icon icon-close"></i></span>
						</div>
						<BuyModalTitle {...props} />
						<StageModalInfo {...props} />
						<StageModalButton {...props} />
					</div>
				</div>
			</Modal>
		)
	}
}


export class StageWrap extends Component {
	getStage() {
		if (this.props.data.installment) {
			return <Stage {...this.props} />
		}
		return null
	}

	render() {
		return this.getStage()
	}
}


class Stage extends Component {
	componentWillMount() {
		this.state = {
			modal: false
		};
	}

	render() {
		let {show_text} = this.props.data.item.marks.installment;
		return (
			<div>
				<div className="installment" id="installment_bar">
					<LinkChange onClick={() => this.setState({modal: true})}>
						<StageModal {...this.props} modal={this.state.modal}
												toggleModal={() => this.setState({modal: false})}/>
						<ul>
							<li className="c-fs12 c-cfff c-tc stage-sign">分期</li>
							<li className="stage-buy c-fs13">{show_text}</li>
						</ul>
						<i className="icon icon-forward vertical-middle"><img
							src="/src/img/icon/arrow/arrow-right-icon.png"/></i>
					</LinkChange>
				</div>
				<div className="gap bgf4"></div>
			</div>
		)
	}
}


// 优惠劵
export class CouponWrap extends Component {
	getCoupon() {
		let {promotion} = this.props;
		if (promotion.coupon) {
			return <Coupons {...this.props} />
		}
		return null
	}

	render() {
		return this.getCoupon()
	}
}

class Coupons extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	getCouponList() {
		let {coupon} = this.props.promotion
		let i = 0, ret = [], item;

		while (item = coupon[i]) {
			ret.push(<span key={i}>满{item.limit_money}减{item.deduct_money}</span>)
			i++
		}
		return ret
	}

	getModalCouponList() {
		let {coupon} = this.props.promotion
		let i = 0, ret = [], item;

		while (item = coupon[i]) {
			ret.push(<Coupon {...this.props} itemdata={item} key={i}/>)
			i++
		}
		return ret
	}

	onClose = () => {
		this.state.modal = false;
		this.setState(this.state)
	}

	render() {
		return (
			<div className="addr-ser">
				<Modal title="优惠劵" isOpen={this.state.modal} onClose={this.onClose} className="goods-coupon-modal">
					<div className="coupon-wrap">
						<h2>可领优惠劵</h2>
						<div className="coupone-list">

							{this.getModalCouponList()}

						</div>
					</div>
				</Modal>
				<div className="sever-addr">
					<LinkChange className="coupon-list" onClick={() => {
						this.setState({modal: true})
					}}>
						领券： {this.getCouponList()}
						<i className="icon icon-forward vertical-middle"><img
							src="/src/img/icon/arrow/arrow-right-icon.png"/></i>
					</LinkChange>
				</div>
			</div>)
	}
}

class Coupon extends Component {
	getUse() {
		let {used_platform} = this.props.itemdata;
		if (used_platform === "all") {
			return "";
		}
		return "(限" + used_platform.split(',').map((val) => {
				return val.toUpperCase() + "端"
			}).join("、") + "使用)"

	}

	getCoupon = () => {
		let {itemdata, data} = this.props;
		$.ajax(Action("GetCoupon", {
			data: {
				coupon_id: itemdata.coupon_id,
				shop_id: data.item.shop_id
			},
			success(data) {
				if (data.statusCode) {
					Popup.MsgTip({msg: "领取优惠劵成功"})
				}
			}
		}))
	}

	render() {
		let {itemdata} = this.props
		let i = itemdata.coupon_type;
		return (
			<div className={"coupon " + CouponClassFix(itemdata)} onClick={this.getCoupon}>
				<div className="coupon-li-wrap">
					<div className="c-fl coupon-left">
						<h3 className={String(itemdata.deduct_money).length < 4 ? "h3-a" : "h3-b"}>
							<span>¥</span>{itemdata.deduct_money}</h3>
						<p>满{itemdata.limit_money}使用</p>
					</div>
					<div className="c-fr coupon-right c-pr">
						<h3>{CouponType.title(itemdata)}<span>{this.getUse()}</span></h3>
						<p className="coupon-right-type">

							&bull;&nbsp;{CouponType.text(itemdata)}
						</p>
						<p className="coupon-right-use-date">{(dateUtil.format(itemdata.use_start_time * 1000, "Y/M/D H:F")).slice(2)}
							至 {(dateUtil.format(itemdata.use_end_time * 1000, "Y/M/D H:F")).slice(2)} <span>立即领取</span>
						</p>
					</div>
				</div>
			</div>
		)
	}
}


// 活动
export class ActiveArea extends Component {
	render() {
		return ( <div className="active-area">
			<StageWrap {...this.props} />
			<CouponWrap {...this.props} />
			<PromotionWrap {...this.props} />
		</div>)
	}
}
export function createShareData(data) {
	let ret = {
		title: data.item.title,
		content: "我在泰然城发现了一个不错的商品，赶快来看看吧。",
		// 如果是分佣商品，分享去掉user_id
		link: window.location.href.replace(/&?user_id\s*=\s*[^&]*/, ''),
		icon: data.item.images[0]
	}
	// 0元购商品在微信中不走微信商城
	if (data.item_type !== "invest") {
		ret.isRedirect = true;
		ret.rhost = RHOST
	}
	return ret
}


export default class detail extends Component {
	render() {
		let {data} = this.props;
		return (
			<div data-page="item-details" id="itemDetails">
				<ScrollImageState H5_pic={data.item.H5_pic} H5D_pic={data.item.H5D_pic} data={data.item.images}/>
				<PriceArea {...this.props} />
				<ActiveArea {...this.props} />
				<SeverArea data={data}/>
				<div className="gap bgf4"></div>
				<ShopArea {...this.props}/>
				<div className="gap bgf4"></div>
				<EvaluateArea {...this.props}/>
				<div className="gap bgf4"></div>
				<GoodsDetail data={data}/>
				<BuyAction {...this.props} />
				<ShareAndTotop config={createShareData(data)}/>
				<OpenInAppGuide />
			</div>
		)
	}
}