import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Link} from 'react-router';
import 'src/scss/item.scss';
import 'src/scss/item_fight.scss';
import 'src/scss/modal.scss';
import {FilterTrade, FilterTradeType, createMSG, createAction, FilterTradeClass, PurchaseLimit} from 'filters/index'
import {LoadingRound, EmptyPage, ShareAndTotop, LinkChange, OpenInAppGuide} from 'component/common';
import {browserHistory} from 'react-router';
import {onAreaResultJSBrige} from "../../../js/jsbrige/index"
import Popup, {Modal, Fix} from 'component/modal';


import {
	SeverArea, // 配送区域
	ScrollImageState, // 滚动图片
	GoodsTit,
	Price,
	Tag,
	Collect,
	ToCart,
	Specs,
	FreePostage,
	createShareData,
	CouponWrap,
	StageWrap,
	GoodsDetail,
	EvaluateArea,
	createBuyAction,
	ExpectTax,
	getDefaultSku,
	ShopArea,
	judgeBunisess,
	getBunisessRet,
	EnterprisePurchase
} from "./detail.jsx"


let Action = createAction({
	toCart: {
		url: "/originapi/cart/add",
		type: "post"
	},
	Spec: {
		url: "/originapi/item/specs",
		type: "get"
	},
	Fav: {
		url: "/originapi/user/collection/add",
		type: "post"
	}
}, true);

let timeCtrl = {
	formatTime: function (time) {
		var hour = timeCtrl.formatOneNum(parseInt(time / 3600));
		var minute = timeCtrl.formatOneNum(parseInt((time - 3600 * hour) / 60));
		var second = timeCtrl.formatOneNum(time % 60);
		return hour + ":" + minute + ":" + second;
	},
	formatOneNum: function (num) {
		return num < 10 ? "0" + num : num;
	},
	formatTextTime: function (time) {
		var day = parseInt(time / 3600 / 24);
		var hour = timeCtrl.formatOneNum(parseInt(time / 3600 % 24));
		var minute = timeCtrl.formatOneNum(parseInt(time / 60 % 60));
		var second = timeCtrl.formatOneNum(time % 60);
		return day + "天" + hour + "时" + minute + "分" + second + "秒";
	}
}

function getPrice(props) {
	let {nowSpec} = props;
	let ret;
	let type = judgeBunisess(props.data.item.marks, props.promotion);
	if (props.active === "cart") {
		if (type) {
			let retRules = getBunisessRet(props);
			if (retRules["number"] === "1" && !nowSpec) {
				ret = retRules["price"]
			} else {
				if (props.num >= retRules["number"]) {
					ret = retRules["price"]
				} else {
					ret = nowSpec && nowSpec.price || props.data.item.sell_price
				}
			}
		} else {
			ret = nowSpec && nowSpec.price || props.data.item.sell_price
		}
	} else {
		ret = props.promotion[0].item_rules.promotion_price
	}
	return parseFloat(ret).toFixed(2)
}


class DeadLine extends Component {
	constructor(props) {
		super(props);
		this.state = {time: 0}
	}

	componentWillMount() {
		//  let {now_time, start_time, end_time} = this.props
		let {start_time, end_time} = this.props
		let now_time = (+new Date() + "").substr(0, 10)

		if (now_time < start_time || now_time > end_time) {
			this.unUpdate = true
		}
	}

	componentDidMount() {
		//  let {now_time, end_time} = this.props;
		let {end_time} = this.props;
		let now_time = (+new Date() + "").substr(0, 10)

		if (!this.unUpdate) {
			this.state.time = end_time - now_time
			this.intervalTime()
		}
	}

	intervalTime() {
		this.timer = setTimeout(() => {
			let t = --this.state.time;
			if (t < 0) {
				location.reload()
			} else {
				this.state.time = t;
				this.setState(this.state);
				this.intervalTime()
			}
		}, 1000)
	}

	componentWillUnmount() {
		window.clearTimeout(this.timer)
		this.timer = null
	}

	render() {
		return (
			!this.unUpdate ?
				<div className="group-purchase-deadLine" id="group-purchase-deadLine">
					距结束仅剩 {timeCtrl.formatTextTime(this.state.time)}
				</div> : null
		)
	}
}

class PriceArea extends Component {
	getPrice() {

		let ret = this.props.promotion[0].item_rules.promotion_price
		return parseFloat(ret).toFixed(2)
	}

	render() {
		return (
			<div className="price-area">
				<Price item={this.props.data.item} dlytmplInfo={this.props.data.dlytmplInfo} {...this.props}
							 price={this.getPrice()}/>
				<DeadLine {...this.props.promotion[0]} />
				<GoodsTit {...this.props} item={this.props.data.item}/>
				<Tag item={this.props.data.item}/>
			</div>
		)
	}
}

class FightGroupDetailList extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentWillMount() {
		let {expire_time} = this.props.data;
		let {at_time} = this.props.groupData;
		if (at_time > expire_time) {
			this.state.unUpdate = true
		}
	}

	componentDidMount() {
		let {expire_time} = this.props.data;
		let {at_time} = this.props.groupData;

		if (!this.unUpdate) {
			this.state.time = expire_time - at_time;
			this.intervalTime()
		}
	}

	intervalTime() {
		this.timer = setTimeout(() => {
			let t = --this.state.time;
			if (t < 0) {
				this.state.unUpdate = true
			} else {
				this.state.time = t;
				this.intervalTime()
			}
			this.setState(this.state);
		}, 1000)
	}

	componentWillUnmount() {
		window.clearTimeout(this.timer)
		this.timer = null
	}

	getTime() {
		if (this.state.unUpdate) {
			return "团已过期"
		} else {
			return timeCtrl.formatTime(this.state.time)
		}
	}

	getName(name) {
		return name && name.replace(/(\d{3})\d{5}(\d{3})/, '$1*****$2')
	}

	render() {
		let {data} = this.props
		return (
			<li>
				<ul className="list-detail-f">
					<li className="list-left-f">{this.getName(data.group_sponsor_name)}</li>
					<li className="list-right-f"><LinkChange className="link" to={`/groupDetail?object_id=${data.object_id}`}>
						去参团<img src="/src/img/pintuan/group-direction-right.png" alt="头像"/>
					</LinkChange></li>
					<li className="group-info">
						<div className="group-info-residue">
							还差{data.required_person - data.current_person}人成团
						</div>
						<div className="group-info-time">{this.getTime()}</div>
					</li>
				</ul>
				<img className="participants-avatar" src="/src/img/icon/avatar/default-avatar.png" alt="头像"/>
			</li>
		)
	}
}


class FightGroupDetail extends Component {
	getDetailList() {
		let {group_info, group_data} = this.props.promotion.groupBuy;
		let ret = []
		group_info && group_info.forEach((val, key) => {
			ret.push(<FightGroupDetailList key={key} data={val} groupData={group_data}/>)
		});
		return ret
	}

	render() {
		let {group_info} = this.props.promotion.groupBuy
		return (
			group_info ?
				<div className="fight-group-detail">
					{
						group_info.length ? <h3>
							<i className="current-icon"><img src="src/img/pintuan/red-current-icon.png" alt=""/></i>以下小伙伴正在发起团购，您可以直接参与
						</h3> : null
					}
					<ul className="participants">
						{this.getDetailList()}
					</ul>
				</div> : null
		)
	}
}

class FightGroupActive extends Component {
	render() {
		let {promotion} = this.props;
		let {group_data} = this.props.promotion.groupBuy;
		return (
			<div className="fight-group-active">
				{group_data && group_data.group_type === "ROOKIE_GROUP" ?
					<div style={{margin: "10px 4% -5px 4%", fontSize: "13px", color: "#e60a30"}}>所有用户均可开团，仅限泰然城购物新用户参团</div> : ""}
				<div className="fight-group-top">支付开团并邀请<span>{promotion[0].rules.group_persons - 1}</span>人参团，人数不足退款</div>
				<Link to="/pintuan-rules" className="fight-group-rules">
					<h3>拼团玩法</h3>
					<div className="rules-detail">
						<i>1</i> <span>支付开团/参团</span><i>2</i> <span>邀请参团</span><i>3</i> <span>人满成团</span>
					</div>
					<i className="direction-right-icon"><img src="src/img/pintuan/black-direction-right.png" alt="向右图标"/></i>
				</Link>
				<FightGroupDetail promotion={promotion}/>
			</div>)
	}
}


class BuyModalTitle extends Component {

	initList() {
		let {clickList, data, getSpec} = this.props;
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
		let {nowSpec} = this.props;
		let strfilterTrade = FilterTrade(item.trade_type);
		let tradeClass = FilterTradeClass(item.trade_type);
		let type = judgeBunisess(item.marks, this.props.promotion);
		return (
			<ul className="ui-table-view">
				<li className="ui-table-view-cell">
					<span className="posit-img"><img className="ui-media-object ui-pull-left" src={this.getImg()} width="80"
																					 height="80"/></span>
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
						{type && this.props.active === "cart" ?
							<EnterprisePurchase item={item} modalFlag={true}{...this.props}/> : this.initList()}
					</div>
				</li>
			</ul>
		)
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

	notGroup() {
		return this.props.active === "cart"
	}

	getAmount() {
		let isGroup = !this.notGroup();
		let {addMinNum, num} = this.props;
		return (
			<div className="buy-amount grounp-buy-amount">
				<span className="amount-tit">数量：</span>
				{
					isGroup ?
						<span className="number-increase-decrease" style={{position: "relative"}}>
                            <input type="number" readOnly className="action-quantity-input" value={num}/>
                        </span>
						:
						<span className="number-increase-decrease" style={{position: "relative"}}>
                            <a href="javascript:void(0);" className="btn action-decrease"
															 onTouchTap={() => addMinNum(-1)}>-</a>
                            <input type="number" readOnly className="action-quantity-input" value={num}/>
                            <span className="input_bak"></span>
                            <a href="javascript:void(0);" className="btn action-increase"
															 onTouchTap={() => addMinNum(1)}>+</a>
                        </span>
				}
				<div className="clearfix"></div>
			</div>
		)
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
				{this.getAmount()}
				<ExpectTax {...this.props} showPrice={getPrice(this.props)}/>
			</div>
		)
	}
}

class BuyModalButton extends Component {
	static clickFnMap = {
		cart: "onClickCart",
		groupBuy: "onClickGroup",
		joinGroup: "onClickJoinGroup"

	};

	noop() {
	}

	render() {
		let {active, getStore, purchaseLimit} = this.props;
		let isPurchaseLimit = purchaseLimit()
		return (
			<div className="buy-option-btn">
				{  getStore() ?
					<div>
						{ isPurchaseLimit ? <span className="purchase-limit">抱歉，海外直邮类商品和跨境保税类商品总价超过限额￥2000，请分次购买。</span> : null}
						<div className={isPurchaseLimit ? "c-bgc9" : "" + " btn-tobuy "}
								 onTouchTap={isPurchaseLimit ? this.noop : this.props[BuyModalButton.clickFnMap[active]] }>确定
						</div>
					</div>
					:
					<div className="buy_fast_no has_sellout" styleName={{color: "#fff", zIndex: 15, background: "#FF8888"}}>
						已售罄</div>
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
		let snum;

		if (num < 1) {
			return false
		}
		snum = this.state.nowSpec ? this.state.nowSpec.store : store.total - store.freeze;

		this.changeState({
			num: num > snum ? snum == 0 ? 1 : snum : num
		});

		return num > snum ? snum : true
	}

	clearState() {
		this.setState(this.initState())
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
			num: num || 1
		}

		let {specs} = this.props.data.item;
		this.specList = Object.keys(specs);

		if (!this.specList.length) {
			let nowSpec = ret.nowSpec = this.props.specs[0];
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
			success: (result) => {
				this.closeAndClear();
				let buy_type = result.data.buy_type;
				if (!result.status) {
					return;
				}
				// browserHistory.push('/orderConfirm?mode=fast_buy');
				location.href = '/orderConfirm?mode=fast_buy&buy_type=' + buy_type;
			}
		}))
	}

	getStore = () => {
		if (this.state.nowSpec) {
			return this.state.nowSpec.store > 0
		} else {
			return true
		}
	}

	getActionData(flag) {
		let ret = {
			"item[item_id]": this.props.itemId,
			"item[quantity]": this.state.num,
			"item[sku_id]": this.state.nowSpec.sku_id,
			"mode": "fast_buy",
			"params[group_type]": (this.props.promotion.groupBuy && this.props.promotion.groupBuy.group_data.group_type) || this.props.data.group.group_type
		}, {user_id} = this.props.location.query;

		// 添加分佣用户id
		if (user_id) {
			ret.commission_user_id = user_id
		}

		flag && (ret.obj_type = "groupbuy")
		return ret
	}

	purchaseLimit = () => {

		let {trade_type} = this.props.data.item;
		if (this.state.num > 1 && this.state.nowSpec && PurchaseLimit(trade_type)) {
			return this.state.num * this.state.nowSpec.price > 2000
		}
	}

	closeAndClear() {
		this.props.toggleModal();
		this.setState(this.initState());
	}

	onClickJoinGroup = () => {
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
		let data = this.getActionData(true);

		data["params[object_id]"] = this.props.data.group.object_id;

		$.ajax(Action("toCart", {
			data,
			success: (result) => {
				this.closeAndClear();
				let buy_type = result.data.buy_type;
				if (!result.status) {
					return;
				}
				// browserHistory.push('/orderConfirm?mode=fast_buy');
				location.href = '/orderConfirm?mode=fast_buy&buy_type=' + buy_type;
			}
		}))
	}

	onClickGroup = () => {
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
			data: this.getActionData(true),
			success: (result) => {
				this.closeAndClear();
				let buy_type = result.data.buy_type;
				if (!result.status) {
					return;
				}
				// browserHistory.push('/orderConfirm?mode=fast_buy');
				location.href = '/orderConfirm?mode=fast_buy&buy_type=' + buy_type;
			}
		}))
	}

	updateSpec() {
		if (!this.checkSpec()) {
			return false;
		}
		let key = this.specList.join("_").replace(/\d+/g, (key) => this.state.clickList[key]);
		if (key !== this.state.nowSpecKey) {

			this.changeState({
				nowSpec: this.props.specs[key],
				nowSpecKey: key
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
			changeOn: this.changeOn,
			getSpec: this.getSpec,
			getStore: this.getStore,
			onClickCart: this.onClickCart,
			onClickGroup: this.onClickGroup,
			onClickJoinGroup: this.onClickJoinGroup,
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
			active: null
		}
	}

	active(tab) {
		this.setState({
			modal: true,
			active: tab
		})
	}

	componentWillMount() {
		let {promotion} = this.props;
		let {now_time, start_time} = promotion[0];
		if (start_time - now_time > 0) {
			this.state.time = (start_time - now_time);
			this.intervalTime()
		}
	}

	componentWillUnmount() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null
		}
	}

	intervalTime() {
		this.timer = setTimeout(() => {
			let t = --this.state.time;
			if (t < 0) {
				location.reload()
			} else {
				this.state.time = t;
				this.setState(this.state);
				this.intervalTime()
			}
		}, 1000)
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
		let realStore = +item.realStore;

		return !!realStore
	}

	render() {
		let props = {
			...this.props,
			...this.state,
			toggleModal: this.toggleModal
		}
		let {promotion, data} = this.props;
		let num = promotion[0].rules.group_persons;
		let {promotion_price} = promotion[0].item_rules;
		let {group_data} = promotion.groupBuy;
		//let {buy_count, open_count, open_group_number, user_buy_limit} = group_data;
		let {open_group_number, user_buy_limit} = group_data;
		promotion_price = parseFloat(promotion_price).toFixed(2);

		let type = judgeBunisess(data.item.marks, promotion);
		let rules = type && getBunisessRet(this.props);
		let price = type && rules.number === "1" ? parseFloat(rules.price).toFixed(2) : parseFloat(data.item.price).toFixed(2);
		return (
			this.isShelves() ?
				this.isSaleOut() ?
					<div className="pintuan-btn-group">
						<BuyModal {...props} />
						{
							this.state.time ?
								<LinkChange className="fight-group-purchase">
									<div id="group-price">距开始仅剩</div>
									<div>{timeCtrl.formatTime(this.state.time)}</div>
								</LinkChange>
								:
								<LinkChange className="fight-group-purchase" onTouchTap={() => this.active("groupBuy")}>
									<div id="group-price">￥{promotion_price}</div>
									<div>{num}人团</div>
								</LinkChange>
						}
						<LinkChange className="buy-separately-btn" onTouchTap={() => this.active("cart")}>
							<div id="person-price">￥{price}</div>
							<div>单独购买</div>
						</LinkChange>
					</div>
					:
					<div className="pintuan-btn-group action-btn-group">
						<LinkChange type="button" className="ui-btn action-notify" style={{width: "100%"}}>
							已售罄
						</LinkChange>
					</div> :
				<div className="pintuan-btn-group action-btn-group">
					<LinkChange type="button" className="ui-btn action-notify" style={{width: "100%"}}>
						暂不销售
					</LinkChange>
				</div>
		)
	}
}

let BuyAction = createBuyAction({Buy})

// 活动
export class ActiveArea extends Component {
	render() {
		return ( <div className="active-area">
			<StageWrap {...this.props} />
		</div>)
	}
}

export default class groupBuy extends Component {
	render() {
		let {data} = this.props;
		let {group_data} = this.props.promotion.groupBuy;
		return (
			<div data-page="item-details fightGroup" id="itemDetails">
				<ScrollImageState H5_pic={data.item.H5_pic} H5D_pic={data.item.H5D_pic} data={data.item.images}
													group_data={group_data}/>
				<PriceArea {...this.props} />
				<ActiveArea {...this.props} />
				<FightGroupActive {...this.props} />
				<div className="gap bgf4"></div>
				<SeverArea data={data}/>
				<div className="gap bgf4"></div>
				<ShopArea {...this.props}/>
				<div className="gap bgf4"></div>
				<EvaluateArea {...this.props} />
				<div className="gap bgf4"></div>
				<GoodsDetail data={data}/>
				<BuyAction {...this.props} />
				<ShareAndTotop config={createShareData(data)}/>
				<OpenInAppGuide />
			</div>
		)
	}
}