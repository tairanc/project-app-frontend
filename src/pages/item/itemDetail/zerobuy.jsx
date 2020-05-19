import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Link} from 'react-router';
import 'src/scss/item.scss';
import {FilterTrade, FilterTradeType, createMSG, createAction} from 'filters/index'
import {dateUtil, base64encode, utf16to8} from "../../../js/util/index"
import {LoadingRound, EmptyPage, ShareAndTotop, LinkChange, OpenInAppGuide} from 'component/common';
import {browserHistory} from 'react-router';
import {onAreaResultJSBrige} from "../../../js/jsbrige/index"
import Popup, {Modal, Fix, PopupTip} from 'component/modal';
import {connect} from 'react-redux';

import {
	SeverArea, // 配送区域
	ScrollImageState, // 滚动图片
	PriceArea,
	createShareData,
	CouponWrap,
	EvaluateArea,
	ShopArea
} from "./detail.jsx"

let Action = createAction({
	toCart: {
		url: "/originapi/cart/add",
		type: "post"
	},

	Fav: {
		url: "/originapi/user/collection/add",
		type: "post"
	},
	GetCoupon: {
		url: "/originapi/user/coupon/code/get",
		type: "post"
	}
}, true);


export class GoodsDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: 0
		}
	}

	componentDidMount() {
		let height = $(window).height();
		$(this.refs.detail).css('min-height', height - 40)
	}

	changeTag(active) {
		if (active != this.state.active) {

			this.setState({
				active
			})
		}
	}

	checkTag(active) {

		return this.state.active === active ? "active" : "";
	}

	getList() {
		let {properties} = this.props.data.item;
		let ret = [];
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
			<div className="pic-area detail goods-detail">
				<Fix>
					<div className="tab-ti-wrap">
						<div className="tab-ti">
							<ul>
								<li className={this.checkTag(0)} onClick={() => this.changeTag(0)} style={{width: '33%'}}>
									<span>图文详情</span>
								</li>
								<li className={this.checkTag(1)} onClick={() => this.changeTag(1)} style={{width: '33%'}}>
									<span>商品参数</span>
								</li>
								<li className={this.checkTag(2)} onClick={() => this.changeTag(2)} style={{width: '33%'}}>
									<span>理财乐享</span>
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
							: ''
						}
						<div className="goods-pic"
								 dangerouslySetInnerHTML={{__html: data.item.desc && data.item.desc.handset}}>
						</div>
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
					<div className={"lc-con zerobuy_intro  img-w " + this.checkTag(2)}>
						<img className="zerobuy_icons" src="/src/img/pintuan/icons_zerobuy.png"/>
						<div className="commen_problem wrap">
							<ul>
								<li>
									<div className="pro_tit">
										1.什么是“乐享”？
									</div>
									<div className="pro_li_con">
										乐享是泰然金融为您提供的本金自动循环出借及到期自动转让的投标工具，投资乐享可免费获得对应的商品，还可以赚取理财收益，尽享“先消费，再拿收益”的优质服务。
									</div>
								</li>

								<li>
									<div className="pro_tit">
										2.如何计算“乐享”的产品收益？
									</div>
									<div className="pro_li_con">
										您购买的乐享产品为乐享专属项目，支付成功后，当日计息；具体收益与您选择的理财期限有关。
									</div>
								</li>

								<li>
									<div className="pro_tit">
										3.购买“乐享”后，钱存到了哪里？
									</div>
									<div className="pro_li_con">
										购买“乐享”后，您的资金将存入乐享专属项目。
										<a
											href={"trmall://to_invest_detail?type=5&term=" + this.props.nowInvest.period + "&trcProductUrl=" + base64encode(utf16to8(location.href))}
											className="item_intro action-update-link_h5">点击查看该商品对应的项目介绍</a>
									</div>
								</li>

								<li>
									<div className="pro_tit">
										4.“乐享”产品到期后，如何回款？
									</div>
									<div className="pro_li_con">
										到期当日，系统将自动回款到您的泰然金融账户中。
									</div>
								</li>

								<li>
									<div className="pro_tit">
										5.“乐享”商品如何发放？
									</div>
									<div className="pro_li_con">
										投资“乐享”后获得的商品将会按照商城正常发货方式进行发送。
									</div>
								</li>

								<li>
									<div className="pro_tit">
										6.“乐享”商品如何进行换货？
									</div>
									<div className="pro_li_con">
										投资“乐享”后获得的商品如因质量问题需要换货，请联系在线客服进行换货。
									</div>
								</li>

								<li>
									<div className="pro_tit">
										7.“乐享”商品售后保障如何？
									</div>
									<div className="pro_li_con">
										乐享商品不提供发票。凡购买乐享实物类商品，若有质量问题，可联系客服进行调换，官方确定有质量问题后可为您安排换货；若非质量问题，确定购买后，不可进行退换。
									</div>
								</li>
							</ul>
						</div>

					</div>
				</div>
			</div>
		)
	}
}

let GoodsDetailWrap = connect((state, ownProps) => state.zeroBuy)(GoodsDetail);

export class Specs extends Component {

	initList() {
		let {isOn, spec, changeOn} = this.props;
		let values = spec.values;
		let ret = [];
		let keys = Object.keys(values);
		keys.forEach((i, keys) => {
			let specValue = values[i];
			ret.push(
				<li key={keys} className={isOn(specValue.spec_value_id, spec.spec_id)}
						onTouchTap={ () => changeOn(specValue.spec_value_id, spec.spec_id)}>
					<a href="javascript:;" title={specValue.text}>
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

export class ZeroBuy extends Component {
	componentWillMount() {
		let {initData} = this.props;
		initData();

		this.isOn = this.isOn.bind(this)
		this.isZeroOn = this.isZeroOn.bind(this)
	}

	isOn = (id, spec) => {
		return this.props.clickList[spec] == id ? "on" : ""
	}

	componentWillUnmount() {
		this.props.unMout()
	}

	isZeroOn = (val) => {
		return this.props.nowInvest == val ? "on" : ""
	}

	initList() {
		let {specs} = this.props.data.item;
		let specsKeys = Object.keys(specs);
		let ret = [];
		specsKeys.forEach((val, keys) => {
			ret.push(<Specs spec={specs[val]} {...this.props} isOn={this.isOn} key={keys}/>)
		});
		return (ret.length ?
			<div className="standard-area stable-standard cur">
				<div className="standard-info">
					{ret}
				</div>
				<div className="gap bgf4"></div>
			</div> : null)
	}

	initZeroList() {
		let {invest} = this.props.nowSpec;

		return <ZeroList {...this.props} invest={invest} isZeroOn={this.isZeroOn} changeZero={this.props.changeZero}/>
	}

	render() {
		return (
			this.props.update ?
				<div className="zero-buy-wrap">
					{this.initList()}
					<div className="standard-area stable-standard cur">
						<div className="standard-info">
							{this.initZeroList()}
						</div>
					</div>
					<ZeroMoney {...this.props} />
				</div> : null)
	}
}

export class ZeroList extends Component {

	initList() {
		let {invest, isZeroOn, changeZero} = this.props;
		let keys = Object.keys(invest);
		let len = keys.length;
		let ret = [], key;
		for (; key = keys[--len];) {
			let val = invest[key];
			ret.push(
				<li key={len} className={isZeroOn(val)} onClick={ () => changeZero(val)}>
					<a href="javascript:;">{val.period}天</a>
				</li>)
		}
		return ret
	}

	render() {
		let {spec} = this.props;
		return (
			<div className="color parameter">
				<span className="tit">持有期限</span>
				<ul className="size_ul">
					{this.initList()}
				</ul>
			</div>
		)
	}
}

export class ZeroMoney extends Component {
	render() {
		let {invest, profit} = this.props;
		return (<div>
			<div className="store_money">
				<ul className="c-cb">
					<li>
						<div className="hd">存入金额</div>
						<div className="s_li_con"><span>￥</span><span className="action-update-invest_money">{invest}</span></div>
					</li>
					<li>
						<div className="hd">预计收益</div>
						<div className="s_li_con"><span>￥</span><span
							className="action-update-expect_profit">{profit.toFixed(2)}</span></div>
					</li>
				</ul>
			</div>
			<div className="gap bgf4"></div>
		</div>)
	}
}


let zeroStateToProps = function (state, ownProps) {
	return state.zeroBuy
}

let zeroActionToProps = (dispatch, ownprops) => {
	return {
		changeOn: (id, spec) => {
			dispatch({
				type: "ZEROBUY_CHANGE_SPEC",
				id,
				spec
			})
		},

		changeZero: (val) => {
			dispatch({
				type: "ZEROBUY_CHANGE_DATA",
				nowInvest: val
			})
		},
		unMout: () => {
			dispatch({type: "ZEROBUY_WILL_UNMOUNT"})
		},
		initData() {
			let {specs, data} = ownprops;
			dispatch({
				type: "ZEROBUY_INIT_DATA",
				nowSpec: null,
				nowInvest: null,
				clickList: {},
				nowSpecKey: null,
				nowPromotioinSpec: null,
				num: 1,
				specs,
				data
			})
		}
	}
}

let ZeroBuyWrap = connect(zeroStateToProps, zeroActionToProps)(ZeroBuy);


class ZeroBtn extends Component {
	componentWillMount() {
		this.state = {
			modal: false
		}
	}

	getStore = () => {
		if (this.props.nowSpec) {
			return this.props.nowSpec.store > 0
		} else {
			return true
		}
	}

	toggleModel(flag) {
		this.setState({
			modal: flag
		})
	}

	clickBuy() {
		$.ajax(Action("toCart", {
				data: {
					"item[item_id]": this.props.itemId,
					"item[quantity]": this.props.num,
					"item[sku_id]": this.props.nowSpec.sku_id,
					"params[period]": this.props.nowInvest.period,
					"params[invest]": this.props.invest,
					"params[profit]": (this.props.profit).toFixed(2),
					"obj_type": "zero_buy",
					"mode": "fast_buy"
				},
				parseData: (r) => {
					if (!r.status && r.biz_code === "10002") {
						r.msg = "";
					}
				},
				success: (result) => {
					if (!result.status) {
						switch (result.biz_code) {
							case "10001":
								setTimeout(() => {
									location.href = "https://jrpay.trc.com/trc_app/transfercorel/realname"
								});
								break;
							case "10002":
								this.toggleModel(true);
								break
						}
						return;
					}
					browserHistory.push('/zeroBuyConfirm?mode=fast_buy');
				}
			}
		))
	}

	render() {
		let {addMinNum, num, popup} = this.props;
		return (
			<div className="buy-amount" id="buy-amount">
				<Modal onClose={() => this.toggleModel(false)} isOpen={this.state.modal} className="code10002-tip-modal">
					<div class="differ_window">
						<h3>您选择的理财产品可售金额不足</h3>
						<p class="differ_window_btn">
							<span class="btn_cancel" onClick={() => this.toggleModel(false)}>请尝试选择其他期限</span>
						</p>
						<span class="clearfix"></span>
					</div>
				</Modal>
				<span className="span_num c-fl">数量：</span>
				<span className="number-increase-decrease c-fl">
                    <a href="javascript:void(0);" className="btn action-decrease" onClick={() => addMinNum(-1)}>-</a>
                    <input type="number" readOnly className="action-quantity-input" value={num}/>
                    <span className="input_bak"></span>
                    <a href="javascript:void(0);" className="btn action-increase" onClick={() => addMinNum(1)}>+</a>
                </span>
				<div className="action-btn-group c-fr">
					{this.getStore() ?
						<LinkChange className="ui-btn buy_fast buy-now  ui-btn-warning action-fastbuy_btn"
												onClick={() => this.clickBuy()}>免费拿</LinkChange>
						: <LinkChange href="javascript:void(0);" className="zbxs ui-btn  ui-btn-warning  has_sellout">
							已售罄
						</LinkChange>
					}
				</div>
			</div>
		)
	}
}

let zeroBtnStateToProps = function (state, ownProps) {
	return state.zeroBuy
}
let zeroBtnActionToProps = (dispatch, ownprops) => {
	return {
		addMinNum(num) {
			dispatch({
				type: "ZEROBUY_CHANGE_NUM",
				num
			})
		},
		closePopup() {
			dispatch({
				type: "ZEROBUY_POP"
			})
		}
	}
}


let BuyActionWrap = connect(zeroBtnStateToProps, zeroBtnActionToProps)(ZeroBtn);

class BuyAction extends Component {

	render() {
		return (
			<div className="buy-action zero-buy-buy-action">
				{/*  客服 */}
				<div className="collect serve_kf">
					<a href="trmall://custom_service" className="save">
						<span className="details_kf"><img src="/src/img/icon/serve-phone-icon.png"/></span><span
						className="icon-title">客服</span>
					</a>
				</div>
				{/* 加入购物袋 立即购买*/}
				<BuyActionWrap {...this.props} />
			</div>
		)
	}
}

class PopupWrap extends Component {
	render() {
		let {popup, onClose} = this.props;

		return ( popup ?
			<PopupTip active={true} msg={createMSG(popup.messageType, popup.messageArg)} onClose={onClose}/> : null )
	}
}

let popupActionToProps = {
	onClose: () => ({
		type: "ZEROBUY_POP_CLOSE",
		popup: null
	})
}

let PopupWrapCtrl = connect(zeroBtnStateToProps, popupActionToProps)(PopupWrap);
let PriceAreaWrapCtrl = connect(zeroBtnStateToProps)(PriceArea);

export default class detail extends Component {

	render() {
		let {data} = this.props;
		return (
			<div data-page="item-details" id="itemDetails">
				<ScrollImageState data={data.item.images}/>
				<PriceAreaWrapCtrl {...this.props} />
				<div className="gap bgf4"></div>
				<ZeroBuyWrap {...this.props}/>
				<SeverArea data={data} noRetruen={true}/>
				<div className="gap bgf4"></div>
				<ShopArea {...this.props}/>
				<div className="gap bgf4"></div>
				<GoodsDetailWrap {...this.props} />
				<BuyAction {...this.props} />
				<ShareAndTotop config={createShareData(data)}/>
				<PopupWrapCtrl />
				<OpenInAppGuide />
			</div>
		)
	}
}