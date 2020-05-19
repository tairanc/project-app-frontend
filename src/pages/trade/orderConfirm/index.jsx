import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux'
import { Shady, LoadingRound, LoadingImg } from 'component/common';
import {dateUtil} from "js/util/index";
import { PopupTip, ModalAComp, ModalBComp } from 'component/modal';
import { HOCPopup } from 'component/HOC';
import { concatPageAndType,actionAxios } from 'js/actions/actions';
import { payType } from 'js/filters/orderStatus';
import Agreement from 'pages/agreement/agreement.jsx';
import axios from 'axios';
import { loadMask } from 'component/module/popup/mask/mask';
import "./index.scss";


const pageApi ={
	orderData:{ url:"/originapi/order/init", method:"get" },
	coupon:{ url:"/originapi/order/coupon/valid", method:"get" },
	applyCoupon:{url:"/originapi/order/coupon/apply",method:"post" },
	red:{ url:"/src/json/redPacket.json", method:"get"},
	applyRed: { url:"/originapi/order/redPacket/apply", method: "post" },
	address:{ url:"/originapi/order/total", method: "post" },
	submit:{ url:"/originapi/order/create", method: "post" },
	cashier:{ url:"/originapi/payment/prepare", method: "post" }
};


const createActions = concatPageAndType("orderConfirm");
const invoiceActions = concatPageAndType("invoiceSelect");


class OrderConfirm extends Component {
	constructor(props, context ){
		super(props);
		document.title="订单确认";
		if( context.isApp ) location.href = "jsbridge://set_title?title=订单确认";
	}
	static contextTypes = {
		isApp: React.PropTypes.bool
	};
	componentWillMount() {
		if( this.props.from && !this.props.load ){
			this.props.dispatch( createActions('setOrigin',{ origin:"" }) );
			if( this.props.from ==="address" ){
				this.props.changeAddress();
			}
		}else{
			this.props.initialData( this.props.initialCoupon );
		}
	}
	componentDidMount() {
		$(window).scrollTop(this.props.disTop );
	}
	componentWillUnmount(){
		this.props.saveDistanceTop();
		loadMask.destroy();
	}
	render() {
		let {  address, identify,shopIdArr, data,couponList, redPacketList, selectAddress, selectIdentify, changeAddress,addBuyMessage, buyMessage, onCouponPopup, onTotalPopup,couponSelect, onRedPacket, applyRed } = this.props;
		let obj_type;
		try {
			obj_type = data.order.cart[0].object[0].obj_type;
		}catch ( e ){}

		return (
			<div data-page="order-confirm" ref="orderPage" style={{minHeight: this.props.winHeight} }>
				{ this.props.load  ? <LoadingRound /> :
					<form id="orderConfirm" onSubmit={ (e) => e.preventDefault() }>
						{ this.props.data.over_buy_limit ? <LimitPrice /> : "" }

						<OrderHeader address={ address.data }
						             identify={ identify.data }
						             overSeas={ data.is_over_seas }
						             needId={ identify.needId }
						             hasId={ identify.has }
						             selectAddress= { selectAddress }
						             changeAddress={ changeAddress }
						             selectIdentify={ selectIdentify } />

						<OrderShop data={ data }
						           messageHandle={ addBuyMessage }
						           buyMessage={ buyMessage } />

						<OrderTotal data={ data.total }
						            onCoupon={ onCouponPopup }
						            onRedPacket={ onRedPacket }
						            onTotal={ onTotalPopup }
						            coupon={ couponSelect }
						            couponNum={ couponList.num }
						            redPacketList={ redPacketList }
						            invoice={ this.props.invoice }
						            showOffline={ this.props.showOffline }
						            onPayment={ this.props.onPayPopup }
						            payType = { this.props.payType.type }
						            toggleInvoice={ this.props.toggleInvoice }
						            popupItem={ this.props.popupItem.bind( null, true )}
						            invoiceItem={ this.props.invoiceItem && this.props.invoiceItem.length }
						            shopIdArr={ shopIdArr} />

						{  obj_type ==="stage_buy" && <Installment data={ data.order.cart[0].object[0].params }/> }

						{  (this.props.couponShow || this.props.totalShow || this.props.redPacketShow )  && <Shady /> }
						<PopupCoupon data={ couponList.list }
						             show={ this.props.couponShow }
						             onCoupon={ this.props.onCouponPopup }
						             couponSelect={ this.props.couponSelect }
						             onSelect={ this.props.onSelectCoupon } />
						
						<PopupRedPacket data={ redPacketList }
						                show={ this.props.redPacketShow }
						                applyRed={ this.props.applyRed }
						                onRedPacket={ this.props.onRedPacket }
						                applyDiscount={ this.props.applyDiscount }
						/>
						
						{ this.props.showOffline && <PopupPayment data={ this.props.payType }
						              paymentSelect={ this.props.paymentSelect }
						              modalCtrl={ this.props.onPayPopup }/> }
						

						<PopupTotal  data={ this.props.data.total }
						             show={ this.props.totalShow }
						             onPopup={ this.props.onTotalPopup }  />

						<UserAgreement agree={ this.props.agree }
						               agreeHandle={ this.props.agreeHandle } />

						<OrderForm data={ this.props.data } needId={ data.isNeedCard }
						           formSubmit={ this.props.formSubmit }
						           agree={ this.props.agree }
						           onTotal={ this.props.onTotalPopup }
						           totalShow={ this.props.totalShow } />
					</form>
				}
				<PopupItemCtrl active={ this.props.invoiceItemShow }
				               onClose={ this.props.popupItem.bind( null, false ) }
				               data={ this.props.invoiceItem } />

				<PopupTip  active={ this.props.prompt.show }
				           msg={ this.props.prompt.msg }
				           onClose={ this.props.promptClose } />


				<ModalAComp active={ this.props.errorPage }
				            msg={"商品数据异常，无法下单！"}
				            btns={[{text:"返回上一页",cb:()=>{  location.href="jsbridge://goBack"  } }] } />

				<ModalAComp active={ this.props.emptyAddress }
				            msg={"您还没有收货地址，快去添加吧！"}
				            btns={[
					            { text:"取消", cb:()=>{
						            this.props.dispatch( createActions( 'ctrlModal',{ modal:"emptyAddress",status:false } )  )
					            }},
					            { text:"确定", cb: ()=>{
						            this.props.dispatch( createActions( 'ctrlModal',{ modal:"emptyAddress",status:false } )  )
						            window.location="trmall://getAddressInfo"
					            }}
				            ]}
				/>
				<ModalAComp active={ this.props.alterationModal }
				            msg={"商品信息发生变动，是否要继续购买？"}
				            btns={[
					            { text:"取消", cb:()=>{  location.href="jsbridge://goBack" } },
					            { text:"继续", cb: ()=>{  window.location.reload(); } }
				            ]}
				/>
				
				<ModalAComp active={ this.props.invoiceModal }
				            msg={"赠送的活动e卡不支持开具发票，如需使用活动e卡请不要选择开具发票。"}
				            btns={[{text:"确定",cb:()=>{
				            	this.props.dispatch( createActions('invoiceModal'))
				            } }] } />
				
				<ModalAComp active={ this.props.redSelectModal.show }
				            msg={ this.props.redSelectModal.msg }
				            btns={[
					            { text:"取消", cb:()=>{
				            	    this.props.dispatch( createActions( 'redSelectModal',{ modal:{
				            	    	show:false,
						                msg:""
					                }}))
					            } },
					            { text:"确定", cb: ()=>{  window.location.reload(); } }
				            ]}
				/>
				
				<ModalBComp active={ this.props.diffNameModal }
				            msg={"点击确认修改，收货人姓名将变更为身份证 姓名，但不影响收货地址，是否修改？"}
				            title={"收货人姓名与身份证姓名不一致！"}
				            btns={[
					            { text:"返回编辑", cb:()=>{
						            this.props.dispatch( createActions( 'ctrlModal',{ modal:"diffNameModal",status:false } ));
					            }},
					            { text:"确定修改", cb: ()=>{
						            this.props.dispatch( createActions( 'equalName') );
						            setTimeout( ()=>{
							            this.props.formSubmit();
						            },0);
					            }}
				            ]}
				/>
			</div>

		)
	}
}

//订单头部地址
class OrderHeader extends Component {
	componentWillMount(){
		window.onAddressResult= (data) =>{
			this.props.selectAddress( JSON.parse(data) );
			this.props.changeAddress();
		};
		window.onIdCardResult = (data)=>{
			this.props.selectIdentify( JSON.parse( data ));
		};
	}
	componentWillUnmount(){
		window.onAddressResult = null;
		window.onIdCardResult = null;
	}
	render() {
		let { address, needId, identify, overSeas } =this.props;
		return (
			<div className="order-header">
				<a href="trmall://getAddressInfo" className="user-address g-row-flex g-col-mid g-col-ctr">
					<div className="left-icon">
						<i className="location-address-icon"> </i>
					</div>
					{address ?
						<div className="content-text g-col-1">
							<div className="text-top g-row-flex">
								<span className="g-col-1">收货人：{address.name}</span><span className="user-phone">{address.mobile}</span>
							</div>
							<div className="text-bottom">收货地址：{address.area_string} {address.addr}</div>
						</div> :
						<div className="g-col-1 c-fs15">
							请填写收货地址
						</div>
					}
					<div className="right-icon">
						<i className="arrow-right-icon"> </i>
					</div>
				</a>
				{ needId ?
					<a href={`trmall://getIdCardInfo?status=${ overSeas }` }
					      className="user-idtf g-row-flex g-col-ctr g-col-mid">
						<div className="left-icon">
							<i className="identify-card-icon"> </i>
						</div>
						<div className="idtf-center g-col-1">
							{ identify ?
								<span>身份证信息：{ identify.name } {identify.idnumber.slice(0, 3) + "*****" + identify.idnumber.substr(identify.idnumber.length - 3, 3) }</span> :
								<span>请选择身份证</span>    }
						</div>
						<div className="right-icon">
							<i className="arrow-right-icon"> </i>
						</div>
					</a> : ""}
				<div className="order-header-bottom"> </div>
			</div>
		)
	}
}

//订单商品列表
class OrderShop extends Component {
	render() {
		const {data} = this.props;
		const valHtml = data && data.cart && data.cart.map( (item, i) =>{
				return <ItemStore key={i} data={item} messageHandle={ this.props.messageHandle } buyMessage={ this.props.buyMessage } />
			});
		const invHtml = data && data.no_store && data.no_store.map( (item, i) =>{
				return <OneItem key={`item${i}`} data={item} val={false}/>
			});
		return (
			<div className="order-box">
				<div className="item-val">
					{valHtml}
				</div>
				<div className="item-inv">
					<div className="item-inv-grid">
						{ invHtml }
					</div>
				</div>
			</div>
		)
	}
}

//商品store
class ItemStore extends Component {
	render() {
		const {shop_alias_name, shop_name, object, total, shop_id, exchange } = this.props.data;
		const itemList = object && (object instanceof Array) && object.map(function (item, i) {
				return <OneItem key={i} data={item} val={true}/>;
			});
		const exchangeList =   exchange && (exchange instanceof Array) && exchange.map(function (item, i) {
				return <OneItem key={i}
				                data={item}
				                val={true}/>;
			});
		const showTax = object && (object instanceof Array) && object.reduce((prev, current) => {
				return prev || current.type !== "Domestic";
			}, false);
		return (
			<div className="item-store">
				<div className="store-header">
					<i className="store-icon"> </i><span>{ shop_alias_name || shop_name }</span>
				</div>
				<div className="store-body">
					<div className="common">
						{ itemList }
					</div>
					{ exchange && (exchange instanceof Array) &&
						<div className="store-middle">
							<h4>换购商品</h4>
							{ exchangeList }
						</div>
					}
					
				</div>
				<div className="list-total">
					<div className="list g-row-flex">
						<div className="list-left">配送方式</div>
						<div className="list-right">快递{total.total_dlyfee == 0 && " 包邮"}</div>
					</div>
					{showTax ?
						<div className="list g-row-flex">
							<div className="list-left">税费</div>
							<div className="list-right c-cfbb810">¥ {total.total_tax}</div>
						</div> : ""
					}
					<div className="list g-row-flex">
						<div className="list-left">买家留言：</div>
						<div className="list-input">
							<input type="text" defaultValue={ this.props.buyMessage[shop_id] } onBlur={ this.props.messageHandle.bind( this, shop_id )} placeholder="选填，可填写您对订单的要求"/>
						</div>
					</div>
					<div className="list store-price">
						共{total.total_quantity}件商品 小计：<span className="c-cdred">¥ <i>{total.total_price.toFixed(2) }</i></span>
					</div>
				</div>
			</div>
		)
	}
}

//一个商品
class OneItem extends Component {
	render() {
		const {data, val} = this.props;
		let buyLimit = data.promotion ? +data.promotion.real_store : +data.store.real;
		let lowStock = buyLimit < data.quantity;
		return (
			<div className="one-item-grid">
				<div className={`one-item g-row-flex ${!val ? "inval" : ""}`}>
					<div className="item-img">
						<img src={data.image_default_id } width="70" height="70"/>
						{ !val && lowStock && <span className="store-status">库存不足</span> }
					</div>
					<div className="item-info g-col-1">
						<div className="info-top g-row-flex">
							<div className="info-text g-col-1">
								<div className="info-title">
									{data.type === "Direct" && <span className="label yellow-label">海外直邮</span>}
									{data.type === "Bonded" && <span className="label blue-label">跨境保税</span>}
									{data.promotion && <span className="act-label  c-fb">{data.promotion.promotion_tag}</span> }
									{data.title}
								</div>
								<div className="info-props">
									{data.spec_info}
								</div>
							</div>
							<div className="info-price">
								¥{ data.promotion ? (+data.promotion.promotion_price).toFixed(2) : (+data.price).toFixed(2) }</div>
						</div>
						<div className="info-btm">
							×{data.quantity}
						</div>
					</div>
				</div>
				{ !this.props.invalid && data.gifts &&
				<div className="item-bottom">
					{data.gifts.map((item, i)=> {
						// let noGoods = item.item_status !== "Shelves" || item.store <= 0;
						return <div key={i} className={ !item.is_gray ? "item-give val" : "item-give"}>
							<div className="give-info">
								{ Boolean(item.is_gray) && <i>[无货]</i>}<span>【赠品】</span>{item.title}
							</div>
							<div className="give-num">×{item.gift_num}</div>
						</div>
					})
					}
				</div>
				}
			</div>
			
		)
	}
}

//订单总和
class OrderTotal extends Component {
	redDiscount=()=>{
		let { redPacketList } = this.props;
		return redPacketList.list.reduce( ( prev, next )=>{
			if( next.check ){
				return prev + next.deduct_money
			}else{
				return prev;
			}
		}, 0 )
	};
	render() {
		const { data, coupon, invoice, toggleInvoice, invoiceItem, redPacketList,couponNum } = this.props;
		return (
			<div className="order-total">
				<div className="list-total">
					<div className="list g-row-flex" onClick={ this.props.onCoupon.bind( this, true ) }>
						<div className="list-left">优惠券</div>
						<div className="list-right">
							{ coupon.code ? <span className="c-cdred">
								{`已减${data.total_discount_coupon_platform + data.total_discount_coupon_shop}元`}
								</span>:
								(  couponNum ? <span className="c-cdred">{couponNum} 个可用</span>:<span>未使用</span> ) }
						</div>
						<div className="list-icon">
							<i className="arrow-right-icon"> </i>
						</div>
					</div>
					<div className="list g-row-flex" onClick={ this.props.onRedPacket.bind( this, true ) }>
						<div className="list-left">红包</div>
						<div className="list-right">
							{redPacketList.num ? <span className="c-cdred">{ this.redDiscount() ? `已减${this.redDiscount()}元` :`${redPacketList.num}个可用`  }</span>:<span>未使用</span>}
						</div>
						<div className="list-icon">
						<i className="arrow-right-icon"> </i>
						</div>
					</div>
					{ this.props.showOffline &&
					<div className="list g-row-flex" onClick={ this.props.onPayment.bind( this, true ) }>
						<div className="list-left">支付方式</div>
						<div className="list-right">
							<span>{ payType[this.props.payType] }</span>
						</div>
						<div className="list-icon">
							<i className="arrow-right-icon"> </i>
						</div>
					</div>
					}
					<div className="list g-row-flex">
						<div className="list-left-spec">开具发票</div>
						<div className="list-middle-spec">
							{ invoiceItem ? <span> <span>{ invoice.enabled ? "部分商品不支持开发票":"订单中所有商品不支持开发票"}</span>{ invoice.enabled && <i onClick={ this.props.popupItem } className="question-symbol-icon"> </i>} </span>: "" }
						</div>
						{ invoice.enabled && <div className="list-right-spec">
							<div className={`switch-button ${ invoice.status ? "active" : "" }`} onClick={ toggleInvoice }>
								<div className="slide-ball"> </div>
							</div>
						</div>
						}
					</div>
					{ invoice.status && <Link className="list g-row-flex" to={`/invoiceSelect?shop_ids=${ this.props.shopIdArr.join(",")}&invoice=${ invoice.type }&action=${ invoice.action }`}>
						<div className="list-left">发票信息</div>
						<div className="list-right">
							<span>{invoice.text}</span>
						</div>
						<div className="list-icon">
							<i className="arrow-right-icon"> </i>
						</div>
					</Link>
					}
				</div>
			</div>
		)
	}
}

//订单提交
class OrderForm extends Component {
	render() {
		let { data,agree, totalShow } = this.props;
		let canSub = agree && data && !data.over_buy_limit;
		return (
			<div className="order-form g-row-flex">
				<div className="money-total g-col-1 g-row-flex">
					<div className="text c-fs15">合计：</div>
					<div className="money c-fs18 g-col-1">¥{data.total.payment}</div>
					<div className="click c-fs12" onClick={ this.props.onTotal.bind( null, !totalShow )} >查看明细<i className="direction-right-icon"> </i></div>
				</div>
				{ canSub ?
					<div className="form-btn c-bgdred" onClick={ this.props.formSubmit }>提交订单</div> :
					<div className="form-btn c-bgc9">提交订单</div>
				}
			</div>
		)
	}
}

//优惠劵窗口
class PopupCoupon extends Component {
	render() {
		const { data,show,couponSelect } = this.props;
		return (
			<div className={`popup-coupon ${show ? "active" : ""}`}>
				<div className="coupon-top  c-c999">
					优惠券
				</div>
				{data ?
					(data.length ?
							<div className="coupon-body">
								<CouponList type="val" data={ data } couponSelect={ couponSelect } onSelect={ this.props.onSelect } />
							</div> :
							<NoCoupon />
					) :
					<LoadingImg />
				}
				<div className="coupon-btm">
					<div className="close-btn" onClick={ this.props.onCoupon.bind(this, false ) }>
						关闭
					</div>
				</div>
			</div>
		)
	}
}

//支付方式
class PopupPayment extends Component{
	render(){
		return <div onClick={ this.props.modalCtrl.bind( null, false )}>
			{ this.props.data.show && <Shady /> }
			<div className={`payment-select ${ this.props.data.show ? "active":""}`} onClick={ e=>e.stopPropagation()}>
				<div className="title">支付方式</div>
				<div className="select-list">
					<div className="select-li g-row-flex" onClick={ this.props.paymentSelect.bind( null,"online" )} >
						<div className="left g-col-1">线上支付</div>
						<div className="right"><span className={`check-icon ${this.props.data.type === "online" ?"check":""}`}> </span></div>
					</div>
					<div className="select-li g-row-flex" onClick={ this.props.paymentSelect.bind( null,"offline" )} >
						<div className="left g-col-1">线下公司转账<span className="yellow">(线下转账不支持小泰e卡抵扣)</span></div>
						<div className="right"><span className={`check-icon ${this.props.data.type === "offline" ?"check":""}`}> </span></div>
					</div>
				</div>
				<div className="coupon-btm" onClick={ this.props.modalCtrl.bind( null, false ) } >
					<div className="close-btn">
						关闭
					</div>
				</div>
			</div>
		</div>
	}
}

//优惠券列表
class CouponList extends Component {
	//优惠券品台适用
	platformApply(str) {
		let arr = str.split(",");
		const strToText = {
			pc: "PC端",
			wap: "WAP端",
			all: "ALL端"
		};
		let strArr = arr.map((item, i) => {
			return strToText[item];
		});
		return strArr.join("、");
	}
	//优惠券适用范围
	couponApplyRange( data ) {
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
		} else if (data.coupon_type === 4) {
			txt = data.rules.coupon_alias;
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
		return txt;
	};
	getPrice=(num)=>{
		num = parseFloat(num);
		let a=num.toString().split(".");
		if(a.length==1){
			num=<span>{a[0]}<span className="c-fs14">.00</span></span>;
			return num;
		}
		if(a.length>1){
			if(a[1].length<2){
				num=<span>{a[0]}<span className="c-fs14">.{a[1]}0</span></span>;
			} else {
				num=<span>{a[0]}<span className="c-fs14">.{a[1]}</span></span>;
			}
			return num;
		}
	};
	render(){
		const self = this;
		const {type,data,couponSelect} = this.props;
		const list = data && data.length && data.map((item,i)=>{
				let colour = (type==="val"?( item.isset_limit_money ?"red":"yellow") :"grey");
				return (
					<div className={`one-coupon g-row-flex ${colour}`} key={`coupon${i}`}
					     onClick={ this.props.onSelect.bind(this,{ code:item.coupon_code, limit:+item.limit_money, desc: +item.deduct_money } ) }>
						<div className={`left ` + colour }>
							<p className="one">¥<b>{item.coupon_type === 4 ? this.getPrice(item.price) :parseInt(item.deduct_money)}</b></p>
							<p className="two">{item.coupon_type === 4 ?('原价'+parseFloat(item.market_price)):('满'+item.limit_money+'使用')}</p>
						</div>
						<div className="right g-col-1">
							<p><span className={ colour } >{item.coupon_type === 4 ? "免单券" : (item.coupon_type===0?"店铺券":(item.coupon_type===1?(item.used_shop_type === "self" ? "自营券" : "跨店券"):"平台券"))}</span>{item.used_platform!=="all"&&`（限${self.platformApply(item.used_platform)}使用）`}</p>
							<p className="two">{self.couponApplyRange( item ) }</p>
							<p>{(dateUtil.format( item.use_start_time * 1000, "Y/M/D H:F")).slice(2)}至{(dateUtil.format( item.use_end_time * 1000, "Y/M/D H:F")).slice(2)}</p>
						</div>
						<div className={`bg-text ${colour}`}>券</div>
						{ couponSelect.code === item.coupon_code && <i className="current-green-icon"> </i> }
					</div>
				);
			});
		return (
			<div className={`coupon-${type}`}>
				<h3>{type === "val" ? "可用优惠券" : "不可用优惠券"}( {data && data.length} )</h3>
				<div className="coupon-list">
					{list}
					{ type === "val" &&
					<div className="empty-coupon" onClick={ this.props.onSelect.bind( this,"" ) }>
						不使用优惠券
						{ !couponSelect.code && <i className="current-black-icon"> </i> }
					</div>
					}
				</div>
			</div>
		)
	}
}

//红包窗口
class PopupRedPacket extends Component{
	onSure=()=>{
		this.props.onRedPacket(false);
	};
	render(){
		const { data, show } = this.props;
		return <div className={`popup-red-packet ${show ? "active" : ""}`}>
			<div className="popup-top  c-c999">
				红包
				<div className="icon-grid">
					<i className="black-close-icon" onClick={ this.onSure }> </i>
				</div>
			</div>
			{ data.list ?
				( data.list.length ?
						<div className="popup-body">
							<RedPacketList data={ data }
							               applyRed={ this.props.applyRed }/>
							<div className="popup-btm">
								<div className="close-btn" onClick={ this.onSure }>
									确定
								</div>
							</div>
						</div> :
						<NoRedPacket />
				) :
				<LoadingImg />
			}
		</div>
	}
}

class RedPacketList extends Component{
	applyPlatform=( plat )=>{
		if( plat === "all" ){
			return ""
		}else{
			return "• " + plat.toUpperCase() + "端专用";
		}
	}
	itemType = {
		"Normal": "普通商品",
		"Virtual":"虚拟商品",
		"Internal": "内购商品",
	};
	applyItem=( typeStr ) =>{
		if( typeStr === "all"){
			return "";
		}
		return "• 仅限" + typeStr.split(",").map( ( type )=>{
			return this.itemType[type];
		}).join("、") + "使用";
	}
	getList(){
		let { data, applyRed } = this.props;
		/*let overLimit = ( data.list.length ? data.list.filter( ( item )=>{
			return item.check
		}).length :0 ) >= data.limit;*/
		
		return data.list && data.list.map(( item,index )=>{
				return <div className={`one-red-packet ${ item.disabled ?"inv":"" }`} key={ index } onClick={ !item.disabled && applyRed.bind( this, index ) }>
					<div className="red-main g-row-flex">
						<div className={`left ${item.deduct_money > 999.99 ? "small": ""}`}>
							¥<span>{ item.deduct_money }</span>
						</div>
						<div className="right g-col-1">
							<div className="top">{ item.coupon_name }</div>
							<div className="main">
								<p>{ this.applyItem( item.rules.used_item_type ) }</p>
								<p>{ this.applyPlatform( item.used_platform )}</p>
							</div>
						</div>
						{ item.check ? <i className="check-green-icon"> </i>:
							<i className="no-check-grey-icon"> </i> }
					</div>
					<div className="red-time">
						有效期：{ (dateUtil.format( item.use_start_time * 1000, "Y/M/D H:F")).slice(2) } 到 { (dateUtil.format( item.use_end_time * 1000, "Y/M/D H:F")).slice(2) }
					</div>
				</div>
			})
	}
	unRed(){
		let { data } = this.props;
		return data.list && data.list.every( (item,i)=>{
				return !item.check;
			})
	}
	render(){
		let { data } = this.props;
		return <div className="red-packet-list">
			<div className="list-top">{ data.num }个可用</div>
			<div className="list-body">
				{ this.getList()}
				<div className="empty-red" onClick={ ()=> this.props.applyRed(-1) }>
					不使用红包
					{ this.unRed()? <i className="check-green-icon"> </i>: <i className="no-check-grey-icon"> </i> }
				</div>
			</div>
		</div>
	}
}

//总额弹窗
class PopupTotal extends Component {
	render() {
		const {data, show} = this.props;
		return (
			<div className={`popup-total ${show ? "active" : ""}`} onTouchMove={ (e) => e.preventDefault() }>
				<div className="popup-top">
					<span>应付总额</span> <i className="close-nobg-icon" onClick={ (e) => {this.props.onPopup("")} }> </i>
				</div>
				<div className="list-grid">
					<div className="list g-row-flex">
						<div className="left">商品金额</div>
						<div className="right g-col-1">¥{data.total_price.toFixed(2)}</div>
					</div>
					<div className="list g-row-flex">
						<div className="left">活动优惠</div>
						<div className="right g-col-1">-¥{( data.total_discount_promotion + data.total_discount_coupon_shop + data.total_discount_coupon_platform + data.total_discount_red_packet ).toFixed(2)}</div>
					</div>
					<div className="list g-row-flex">
						<div className="left">运费</div>
						<div className="right g-col-1">¥{data.total_dlyfee.toFixed(2)}</div>
					</div>
					<div className="list g-row-flex">
						<div className="left">订单税费</div>
						<div className="right g-col-1">¥{data.total_tax.toFixed(2)}</div>
					</div>
					<div className="list g-row-flex">
						<div className="left">应付总额</div>
						<div className="right g-col-1 c-cdred">¥{data.payment.toFixed(2)}</div>
					</div>
				</div>

			</div>
		)
	}
}

//发票不支持商品
class PopupItem extends Component{
	componentDidMount() {
		$("html,body").css({ height:"100%",overflowY:"hidden" })
	}

	componentWillUnmount() {
		$("html,body").css({ height:"auto", overflowY:"auto" })
	}
	getList =()=>{
		return this.props.data && this.props.data.map( (data, i)=>{
			return 	<div className="one-list" key={i}>
				<div className="img">
					<img src={ data.image_default_id +"_t.jpg"} />
				</div>
				<div className="content">
					<div className="title">
						{data.type === "Direct" && <span className="label yellow-label">海外直邮</span>}
						{data.type === "Bonded" && <span className="label blue-label">跨境保税</span>}
						{ data.title }
					</div>
					<div className="props">{ data.spec_info }</div>
				</div>
			</div>
		})
	}
	render(){
		return <div data-page="order-confirm"  onClick={ this.props.onClose }>
			<Shady options={{zIndex:108}} />
			<div className="popup-item" >
				<div className="popup-body" onClick={ (e)=>{ e.stopPropagation() }}>
					<h3>不可开发票商品</h3>
					<div className="list">
						{ this.getList() }
					</div>
				</div>
				<div className="popup-bottom">
					<i className="close-l-x-icon" > </i>
				</div>
			</div>
		</div>
	}
}

const PopupItemCtrl = HOCPopup( PopupItem );

//200元限制
const LimitPrice = () => {
	return <div className="limit-price">
		<p><span>※</span>抱歉，海外直邮类和跨境保税类商品总价超过限额¥2000，请分多次购买。</p>
	</div>
};

//无优惠券样式
const NoCoupon = () => (
	<div className="c-tc" style={{padding: "30px 0 50px"}}>
		<img src="/src/img/orderConfirm/coupon-apply-bg.png" height="90" width="160"/>
		<p className="c-cc9 c-fs13 c-mt10">您没有相关优惠券哦~</p>
	</div>
);

const NoRedPacket = ()=>(
	<div className="c-tc" style={{padding: "57px 0 100px"}}>
		<img src={ require('../../../img/orderConfirm/red-packet.png')}  width="58" height="54" />
		<p className="c-cc9 c-fs12 c-mt15">您还没有红包哦</p>
	</div>
);

//分期税率小数点处理
const parseFloat = (number, n) => {
	var array = number.toString().split("."),
		length = array[1] ? array[1].length : 0;
	n = n || 0;
	return Math.floor(number * Math.pow(10, length)) / Math.pow(10, length - n);
};

//分期购样式
const Installment = ({data}) => (
	<div className="installment-tip" style={{display:"none"}}>
		<span>※ 分期购买：分{data.period}期，费率{parseFloat(+data.fee_rate, 2)}%，首期免息</span>
		<i className="triangle-top-wathet-icon"> </i>
	</div>
);

class UserAgreement extends Component{
	constructor(props){
		super(props);
		this.state ={
			agreement:""
		}
	}
	agreementHandle =( state )=>{
		this.setState({ agreement: state });
	};
	render(){
		return <div className="user-agreement">
			<span onClick={ this.props.agreeHandle }>{ this.props.agree?<i className="current-agree-icon"> </i>:<i className="current-no-agree-icon"> </i>}</span>
			<span onClick={ this.agreementHandle.bind(this,"agreement")}>我已同意并接受《泰然城用户协议》</span>
			{ this.state.agreement==="agreement" && <Agreement onClose={ this.agreementHandle.bind(this,"") }/> }
		</div>
	}
}


function orderConfirmState(state, props) {
	return {
		...state.orderConfirm,
		...state.global
	}
}

function orderConfirmDispatch( dispatch, props ) {
	let { mode, buy_type } =props.location.query;
	return {
		dispatch,
		//提示框关闭
		promptClose(){
			dispatch( createActions('ctrlPrompt',{ prompt:{ show:false, msg:"" } }) );
		},
		//初始化数据
		initialData( cb ){
			dispatch( createActions( 'resetState' ) );
			dispatch( invoiceActions('resetState'));
			axios.request({ ...pageApi.orderData, params:{ mode: mode,buy_type: buy_type  }  })
				.then( result =>{
					if( result.data.biz_code ==="10200" ){
						dispatch( createActions( 'ctrlModal', { modal:"errorPage",status:true  } ) );
						return;
					}
					if( !result.data.status ){
						dispatch( createActions('ctrlPrompt', { prompt:{ show:true, msg:result.data.msg }} ));
						return;
					}
					dispatch( createActions('initialData',{  result:result.data.data, mode: mode, buyType: buy_type } ) );
					let address = result.data.data.order.addressInfo;
					if( !address  ){
						dispatch( createActions( 'ctrlModal', { modal:"emptyAddress",status:true } ));
					}
					cb();
				}).catch( error =>{
				dispatch( createActions('ctrlPrompt', { prompt:{ show:true, msg:"小泰发生错误，请稍后再试" }} ));
				throw new Error( error );
			})
		},
		//初始化优惠券
		initialCoupon(){
			axios.request({ ...pageApi.coupon,  params:{ from:"wap",mode:mode } })
				.then( result =>{
					if( !result.data.status ){
						return;
					}
					dispatch( createActions('couponData',{ result: result.data } ));
				})
		},
		//优惠券弹窗
		onCouponPopup( status ){
			dispatch( createActions('couponPopup',{ status:status }) );
		},
		//支付方式弹窗
		onPayPopup( status ){
			dispatch( createActions('paymentPopup',{ status:status }) );
		},
		paymentSelect( type ){
			dispatch( createActions('paymentSelect',{ status:type }) );
		},
		
		//红包弹窗
		onRedPacket( status ){
			dispatch( createActions('redPacketPopup',{ status: status }));
		},
		//红包选择
		redSelect( arr ){
			dispatch( createActions('redSelect',{ selectArr: arr } ) );
		},
		//红包清空
		redClear(){
			dispatch( createActions('redClear'));
		},
		//商品总和弹窗
		onTotalPopup( status ){
			dispatch( createActions('totalPopup',{ status:status }) );
		},
		//添加留言
		addBuyMessage( id, e ){
			dispatch( createActions('addMessage', { id:id, value:e.target.value } ));
		},
		saveDistanceTop() {
			dispatch(createActions('saveTop', {value: $(window).scrollTop()}));
		},
		popupItem( status ){
			dispatch( createActions('ctrlModal',{ modal:"invoiceItemShow",status:status }));
		}
	}
}

function orderConfirmProps( stateProps, dispatchProps, props ) {
	let request = false;
	let { dispatch } = dispatchProps;
	return {
		...stateProps,
		...dispatchProps,
		...props,
		//选择优惠券
		onSelectCoupon(coupon) {
			if (!coupon) {
				coupon = {code: "", limit: "", desc: ""};
			}
			dispatch(createActions('selectCoupon', {coupon}));
			axios.request({
				...pageApi.applyCoupon, data: {
					mode: stateProps.mode,
					from: "wap",
					addr_id: stateProps.address.id,
					coupon_code: coupon.code,
					buy_type: stateProps.buyType
				}
			}).then(result => {
				if (!result.data.status) {
					dispatch(createActions('ctrlPrompt', {prompt: {show: true, msg: result.data.msg}}));
					return;
				}
				dispatch(createActions('initialData', {result: result.data.data, mode: stateProps.mode}));
				dispatch( createActions('resetRedPacket') );
			})
		},
		
		//应用优惠券或红包
		applyRed( index ){
			if( index === -1 ){
				let isEmpty =  stateProps.redPacketList.list.every( ( item,i)=> {
					return !item.check
				});
				if( isEmpty ) return;
				dispatchProps.redClear();
			}else{
				dispatchProps.redSelect( [index] );
			}
			dispatch( ( dispatch, getState )=>{
				let state = getState().orderConfirm;
				let useRed = [], unUseRed = [];
				state.redPacketList.list.forEach( ( list, i)=>{
					if( list.check ){
						useRed.push( list.coupon_code );
					}else{
						unUseRed.push( list.coupon_code );
					}
				});
				loadMask.show();
				axios.request({
					...pageApi.applyRed,
					data:{
						mode: state.mode,
						from: "wap",
						buy_type: state.buyType,
						usedCodes: useRed,
						unusedCodes: unUseRed
					}
				}).then( result =>{
					loadMask.destroy();
					if( !result.data.status ){
						if( index !== -1 && state.redPacketList.list[index].check ){
							dispatchProps.redSelect( [index] );
						}
						if( result.data.biz_code == 10010 ){
							dispatch(createActions('redSelectModal', {modal: {msg: result.data.msg, show: true }}));
							return;
						}
						dispatch( createActions('ctrlPrompt', { prompt:{ show:true, msg: result.data.msg }} ));
						return;
					}
					dispatch(createActions('initialData', {result: result.data.data }));
					dispatch( createActions('filterRed',{ data: result.data.data.redPacketCode } ));
				}).catch( error =>{
					console.log( error );
					dispatch( createActions('ctrlPrompt', { prompt:{ show:true, msg:"小泰发生错误，请稍后再试" }} ));
				})
			})
		},
		//切换地址
		selectAddress (data){
			dispatch(createActions('selectAddress', {data: data}));
		},
		//切换身份证
		selectIdentify(data) {
			dispatch(createActions('selectIdentify', {data: data}));
		},
		//切换地址刷新页面
		changeAddress() {
			axios.request({
				...pageApi.address, data: {
					from: "wap",
					addr_id: stateProps.address.id,
					mode: stateProps.mode,
					buy_type: stateProps.buyType
				}
			}).then(result => {
				if (!result.data.status) {
					dispatch(createActions('ctrlPrompt', {prompt: {show: true, msg: result.data.msg}}));
					return;
				}
				dispatch(createActions('initialData', {result: result.data.data}));
				// dispatch( createActions('resetCoupon'));
				dispatch( createActions('resetRedPacket') );
			})
		},
		//同意协议
		agreeHandle(){
			dispatch( createActions('agreeChange'));
		},
		//是否要发票
		toggleInvoice( ){
			dispatch( createActions('toggleInvoice'));
		},
		//表单提交
		formSubmit () {
			if( !stateProps.address.id ){
				dispatch(createActions('ctrlPrompt', {prompt: {show: true, msg: "请选择收货地址！"}}));
				return;
			}
			if (stateProps.identify.needId) {
				if (!stateProps.identify.id) {
					dispatch(createActions('ctrlPrompt', {prompt: {show: true, msg: "缺少身份证信息！"}}));
					return;
				}
				if (stateProps.address.name !== stateProps.identify.name) {
					dispatch(createActions('ctrlModal', {modal: "diffNameModal", status: true}));
					return;
				}
			}
			if (request) return;
			request = true;
			axios.request({
				...pageApi.submit, data: {
					addr_id: stateProps.address.id,
					card_id: stateProps.identify.id,
					need_invoice: stateProps.invoice.status ? 1:0,
					invoice_type:stateProps.invoice.type,
					action: stateProps.invoice.action,
					invoice_name: stateProps.invoice.name,
					mode: stateProps.mode,
					md5_cart_info: stateProps.md5,
					buy_type: stateProps.buyType,
					payment_type: stateProps.payType.type,
					from: "wap",
					buyer_message: stateProps.buyMessage,
				}
			}).then(result => {
				request = false;
				if (result.data.biz_code === "10000") {
					dispatch(createActions('ctrlModal', {modal: "alterationModal", status: true}));
					return;
				}
				if (result.data.biz_code === '10200') {
					dispatch(createActions('ctrlModal', {modal: "errorPage", status: true}));
					return;
				}
				if (result.data.biz_code == '10010') {
					dispatch(createActions('redSelectModal', {modal: {msg: result.data.msg, show: true }}));
					return;
				}
				dispatch(createActions('ctrlPrompt', {prompt: {show: true, msg: result.data.msg}}));
				if (!result.data.status) {
					return;
				}
				setTimeout(() => {
					browserHistory.replace(`/cashier?oid=${ result.data.data }`);
				}, 1000);
			})

		}
	};
}

export default connect( orderConfirmState, orderConfirmDispatch,orderConfirmProps )(OrderConfirm);