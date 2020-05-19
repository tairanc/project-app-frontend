import React, { Component } from 'react';
import { Link,browserHistory } from 'react-router';
import { connect } from 'react-redux'
import { Shady,LoadingRound,LoadingImg } from 'component/common';
import Popup,{ ModalAComp,ModalBComp } from 'component/modal';
import { ownAjax } from 'js/common/ajax.js';
import Agreement from 'src/pages/agreement/agreement.jsx';


const ctrlAPI ={
	orderData:{ url:"/originapi/trade-init.html", type:"get" },
	coupon:{ url:"/originapi/trade-avail-coupon.html", type:"get" },
	applyCoupon:{url:"/originapi/trade-apply-coupon.html",type:"post"},
	address:{ url:"/originapi/trade-order-total.html", type:"post"},
	submit:{ url:"/originapi/trade-order-create.html", type:"post"},
	cashier:{ url:"/originapi/api/payment/getPayOptions", type:"post"}
};
function createDataCreate(){
	return {
		addr_id:"",
		card_id:"",
		mode:"",
		md5_cart_info:"",
		from:"wap",
		buyer_message:{}
	}
}
function createUserName() {
	return {
		address:"",
		id:""
	}
}
let createData= null;
let userName = null;

export default class OrderConfirm extends Component {
  constructor(props) {
    super(props);
	  document.title="订单确认";
	  window.location.href = "jsbridge://set_title?title=订单确认";
	  createData = createDataCreate();
	  userName = createUserName();
	  createData.mode = props.location.query.mode;
    this.state = {
	    popup:"",
	    data:"",
	    coupon:"",
	    address:false,
	    alteration:false,
	    alterationMsg:"",
	    equalName:false,
	    invalid:false
    };
  }
	popupHandle=( type )=>{
		this.setState({ popup:type });
	};
	static contextTypes = {
		store:React.PropTypes.object
	};
	toggleAddress=()=>{
		this.setState({ address: !this.state.address });
	};
	toggleEqualName =()=>{
		this.setState({ equalName: ! this.state.equalName });
	};
	toggleAlteration=( msg )=>{
		this.setState({ alteration: !this.state.alteration ,alterationMsg: msg ? msg:"" });
	};
	toggleInvalid =()=>{
		this.setState({ invalid: !this.state.invalid });
	};
	componentDidMount() {
		$(this.refs.orderPage).css({minHeight:$(window).height()} );
		const 	{ store } = this.context,
			self = this;
		// 请求页面数据
		this.unSubscribe = store.subscribe(()=>{
			const state = store.getState().initial;
			if( state.type==="ORDER_CONFIRM" && state.ctrl==="data"){
				$.ajax({
					url:ctrlAPI[state.api].url,
					type:ctrlAPI[state.api].type,
					data:state.data,
					success:function( result ){
						if( result.code ==="10200" ){
							self.toggleInvalid();
							return;
						}
						if( !result.status ){
							Popup.MsgTip({msg:result.msg});
							return;
						}
						self.setState({
							data:result.data
						});
						state.cb && state.cb();
					},
					error(){
						Popup.MsgTip({msg:"网络错误，请稍后再试"});
					}
				});
			}
		});
		this.initialPage();
	}
	initialPage = ()=>{
		const 	{ store } = this.context;
		store.dispatch({type:"ORDER_CONFIRM",ctrl:"data",api:"orderData",data:createData.mode?{mode:createData.mode}:""});
	}
	componentWillUnmount(){
		this.unSubscribe();
		const modal =document.querySelector("#modal");
		modal && modal.parentNode && modal.parentNode.removeChild(modal);
		const msgTip =document.querySelector("#msgTip");
		msgTip && msgTip.parentNode && msgTip.parentNode.removeChild(msgTip);
	}
	render() {
		const { popup,data,coupon,address,alteration,alterationMsg,equalName,invalid } = this.state;
		const obj_type = data && data.order && data.order.cart && data.order.cart[0] && data.order.cart[0].object &&  data.order.cart[0].object[0] && data.order.cart[0].object[0].obj_type;
		return (
			<div data-page="order-confirm" ref="orderPage">
				{data?
					<div>
						<form id="orderConfirm" onSubmit={ (e)=> e.preventDefault() }>
							{data.order.over_buy_limit?<LimitPrice />:"" }
							<OrderHeader data={data} idNeed={ data.order && data.order.isNeedCard } onAddress={ this.toggleAddress } addressShow={ address } />
							<OrderShop data={data.order} />
							<OrderTotalCtrl data={data.order.total} onPopup={this.popupHandle} />
							{  obj_type ==="stage_buy" && <Installment data={ data.order.cart[0].object[0].params }/> }
							{popup && <Shady />}
							<PopupCoupon data={coupon} show={popup==="coupon"} onPopup={this.popupHandle} />
							<PopupTotalPrice show={popup==="total"} data={data.order.total} onPopup={this.popupHandle} />
						</form>
						<OrderForm data={data.order} idNeed={ data.order && data.order.isNeedCard } alteration={ this.toggleAlteration } equalName={ this.toggleEqualName } invalidHandle={ this.toggleInvalid } ref="orderFrom" />
					</div>
					:
					<LoadingRound />
				}
				<ModalAComp active={ data && data.order && data.order.cart && !data.order.cart.length } msg={"无有效商品可以提交订单"} btns={[{text:"返回",cb:()=>{ browserHistory.replace('/shopCart') } }] }/>
				<ModalAComp active={invalid} msg={"商品数据异常，无法下单！"}  btns={[{text:"返回上一页",cb:()=>{  browserHistory.replace('/shopCart')  } }] } />
				<ModalAComp active={address} msg={"您还没有收货地址，快去添加吧！"}
				            btns={[
				            	{ text:"取消", cb:()=>{ this.toggleAddress() } },
					            { text:"确定", cb: ()=>{  window.location="trmall://getAddressInfo" } }
				            ]}
				/>
				<ModalAComp active={ alteration } msg={ alterationMsg }
				            btns={[
					            { text:"取消", cb:()=>{  browserHistory.replace('/shopCart'); } },
					            { text:"继续", cb: ()=>{  this.initialPage(); this.toggleAlteration("");  } }
				            ]}
				/>
				<ModalBComp active={ equalName }
				            msg={"点击确认修改，收货人姓名将变更为身份证 姓名，但不影响收货地址，是否修改？"}
				            title={"收货人姓名与身份证姓名不一致！"}
				            btns={[
					            { text:"返回编辑", cb:()=>{ this.toggleEqualName(); } },
					            { text:"确定修改", cb: ()=>{  userName.address = userName.id;  this.refs.orderFrom.submitHandle();  this.toggleEqualName(); } }
				            ]}
				/>
				
			</div>

		)
	}
}

const LimitPrice =({data})=>{
	return <div className="limit-price">
			<p><span>※</span>抱歉，海外直邮类和跨境保税类商品总价超过限额¥2000，请分多次购买。</p>
		</div>
};
//订单头部地址
class OrderHeader extends Component{
	constructor(props){
		super(props);
		const {data} = props;
		const address =data && data.addrList && data.addrList.reduce( (prev,current)=>{
				if( current.def_addr==1 ){
					return current;
				}else{
					return prev;
				}
		},"");
		const idCard = "";
		createData.addr_id = address.addr_id;
		createData.md5_cart_info = data.md5CartInfo;
		!address ?  props.onAddress() : userName.address = address.name;
		this.state={
			address,
			idCard
		}
	}
	static contextTypes ={
		store:React.PropTypes.object
	};
	componentWillMount() {
		const self = this;
		const { store } = self.context;
		window.onAddressResult= function(data) {
			if( self.props.addressShow ){
				self.props.onAddress();
			}
			data = JSON.parse(data);
			userName.address = data.name;
			createData.addr_id = data.addressId;
			data.mobile = data.phone;
			data.addr = data.address;
			data.area_string = data.provinceName+ data.cityName + data.districtName;
			self.setState({ address:data });
			store.dispatch({ type:"ORDER_CONFIRM",ctrl:"data", api:"address",data:{
				mode:createData.mode,
				from:"wap",
				addr_id:createData.addr_id
			} })
		};
		window.onIdCardResult = function( data ){
			data = JSON.parse(data);
			createData.card_id = data.cardId;
			data.idnumber = data.idNumber;
			userName.id = data.name;
			self.setState({idCard:data})
		}
	}
	componentWillUnmount(){
		window.onIdCardResult = null;
		window.onIdCardResult = null;
	}
	componentWillReceiveProps( newProps ){
		newProps.data.md5CartInfo?createData.md5_cart_info = newProps.data.md5CartInfo:"";
	}
	render(){
		const {address,idCard} = this.state;
		const { idNeed,data } = this.props;
		return(
		<div className="order-header">
			<a href="trmall://getAddressInfo" className="user-address g-row-flex g-col-mid g-col-ctr">
				<div className="left-icon">
					<i className="location-address-icon"> </i>
				</div>
				{address?
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
			{idNeed ?
				<a href={`trmall://getIdCardInfo?status=${data.order && data.order.is_over_seas}`} className="user-idtf g-row-flex g-col-ctr g-col-mid">
					<div className="left-icon">
						<i className="identify-card-icon"> </i>
					</div>
					<div className="idtf-center g-col-1">
						{idCard?<span>身份证信息：{idCard.name} {idCard.idnumber.slice(0,3)+"*****"+idCard.idnumber.substr(idCard.idnumber.length-3,3 ) }</span>:<span>请选择身份证</span>    }
					</div>
					<div className="right-icon">
						<i className="arrow-right-icon"> </i>
					</div>
				</a>:""}
			<div className="order-header-bottom"></div>
		</div>
		)
	}
}

//订单商品列表
export class OrderShop extends Component{
	render() {
		const {data} = this.props;
		const valHtml = data && data.cart && data.cart.map(function(item,i){
				return 	<ItemStore key={i} data={item} />
			});
		const invHtml = data && data.no_store  && data.no_store.map(function(item,i){
				return <OneItem key={`item${i}`} data={item} val={false} />
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
class ItemStore extends Component{
	render(){
		const {shop_alias_name,shop_name,object,total,shop_id } = this.props.data;
		const itemList = object && (object instanceof Array) && object.map(function(item,i){
				return <OneItem key={i} data={item} val={true}/>;
			});
		const showTax = object && (object instanceof Array) && object.reduce( (prev,current)=>{
				return prev || current.type !=="Domestic";
			},false );
		return(
			<div className="item-store">
				<div className="store-header">
					<i className="store-icon"> </i><span>{ shop_alias_name||shop_name }</span>
				</div>
				<div className="store-body">
					{ itemList }
				</div>
				<div className="list-total">
					<div className="list g-row-flex">
						<div className="list-left">配送方式</div>
						<div className="list-right">快递{total.total_dlyfee==0 &&" 包邮"}</div>
					</div>
					{showTax ?
						<div className="list g-row-flex">
							<div className="list-left">税费</div>
							<div className="list-right c-cfbb810">¥ {total.total_tax}</div>
						</div>:""
					}
					<div className="list g-row-flex">
						<div className="list-left">买家留言：</div>
						<div className="list-input">
							<input type="text" name={shop_id} placeholder="选填，可填写您对订单的要求"/>
						</div>
					</div>
					<div className="list store-price">
						共{total.total_quantity}件商品   小计：<span className="c-cdred">¥ <i>{total.total_price.toFixed(2) }</i></span>
					</div>
				</div>
			</div>
		)
	}
}

//一个商品
class OneItem extends Component{
	render(){
		const {data,val} = this.props;
		let buyLimit = data.promotion ? +data.promotion.real_store : +data.store.real;
		let lowStock = buyLimit < data.quantity;
		return(
			<div className={`one-item g-row-flex ${!val?"inval":""}`}>
				<div className="item-img">
					<img src={data.image_default_id} width="70" height="70"/>
					{ !val && lowStock && <span className="store-status">库存不足</span> }
				</div>
				<div className="item-info g-col-1">
					<div className="info-top g-row-flex">
						<div className="info-text g-col-1">
							<div className="info-title">
								{data.type==="Direct" && <span className="label yellow-label">海外直邮</span>}
								{data.type==="Bonded" && <span className="label blue-label">跨境保税</span>}
								{data.promotion && <span className="act-label  c-fb">{data.promotion.promotion_tag}</span> }
								{data.title}
							</div>
							<div className="info-props">
								{data.spec_info}
							</div>
						</div>
						<div className="info-price">¥{ data.promotion ?(+data.promotion.promotion_price).toFixed(2):(+data.price).toFixed(2) }</div>
					</div>
					<div className="info-btm">
						×{data.quantity}
					</div>
				</div>
			</div>
		)
	}
}

//订单总和
class OrderTotal extends Component{
	render(){
		const {data,coupon} =this.props;
		return(
			<div className="order-total">
				<div className="list-total">
					<div className="list g-row-flex"  onClick={ (e)=>{ this.props.onPopup("coupon"); } } >
						<div className="list-left">优惠券</div>
						<div className="list-right">
							<span>{coupon}</span>
						</div>
						<div className="list-icon">
							<i className="arrow-right-icon"> </i>
						</div>
					</div>
					<div className="list  g-row-flex" onClick={ ()=>{ this.props.onPopup("total")} }>
						<div className="list-left">应付总额</div>
						<div className="list-right">
							<div className="order-price">
								<p className="c-c999 c-fs12"><span className="c-cdred">¥<i className="c-fs20">{data.payment.toFixed(2)}</i></span> (含运费¥ {data.total_dlyfee.toFixed(2)})</p>
								<p className="look-detail"><i className="point-notice-icon"> </i>点击查看价格明细</p>
							</div>
						</div>
						<div className="list-icon">
							<i className="arrow-right-icon"> </i>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const TotalWrap =( WrapComponent )=>
	class extends Component{
	  constructor(props) {
	    super(props);
	    // 初始状态
	    this.state = {
		    coupon:"未使用"
	    };
	  }
		static contextTypes ={
			store:React.PropTypes.object
		};
		componentDidMount() {
			const { store } = this.context;
			const self = this;
			this.unSubscribe = store.subscribe(()=>{
				const state = store.getState().initial;
				if( state.type==="ORDER_CONFIRM" && state.ctrl ==="coupon" ){
					self.setState({
						coupon:state.data
					})
				}
			});
		}
		componentWillUnmount(){
			this.unSubscribe();
		}
		render(){
			return <WrapComponent {...this.props} coupon={this.state.coupon} />;
		}
	};
const OrderTotalCtrl = TotalWrap( OrderTotal );

let req = false;
//订单提交
export class OrderForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
	    agree:true,
	    agreement:""
    };
  }
	agreeHandle=()=>{
		this.setState({
			agree: !this.state.agree
		})
	};
	componentWillUnmount() {
		req = false;
	}
	submitHandle=()=>{
		const self = this;
		if( this.props.idNeed ){
			if( !userName.id ){
				Popup.MsgTip({msg:"缺少身份证信息！"});
				return;
			}
			if( userName.id != userName.address ){
				self.props.equalName();
				return;
			}
		}
		if( req ) return;
		req = true;
	 let useMsg = $("#orderConfirm").serialize().split("&");
		useMsg.forEach((item,i)=>{
			 let obj =item.split("=");
			createData.buyer_message[obj[0]] = obj[1];
		});
		ownAjax( ctrlAPI.submit,createData).then( result =>{
			req = false;
			if( result.code === "10000" ){
				self.props.alteration( result.msg );
				return;
			}
			if( result.code ==="10200"){
				self.props.invalidHandle();
				return;
			}
			Popup.MsgTip({msg:result.msg});
			if( !result.status ){
				return;
			}
			setTimeout( ()=>{
				browserHistory.replace(`/cashier?oid=${result.data}`);
			},1000);
		}).catch( xhr =>{
			req = false;
			Popup.MsgTip({msg:"提交订单失败"});
		});
	};
	agreementHandle=( type )=>{
		this.setState({ agreement:type });
	};
	render(){
		const {agree,agreement} = this.state;
		const {data} = this.props;
		const canSub = agree && data && !data.over_buy_limit;
		return(
			<div className="order-form" >
				<div className="agree">
					<span onTouchTap={ this.agreeHandle }>{agree?<i className="current-agree-icon"> </i>:<i className="current-no-agree-icon"> </i>}</span>
					<span onClick={ this.agreementHandle.bind(this,"agreement")}>本人同意并接受以下用户协议</span>
				</div>
				{agreement==="agreement" && <Agreement onClose={ this.agreementHandle.bind(this,"") }/> }
				{canSub?
					<div className="form-btn c-bgdred" onClick={ this.submitHandle } >提交订单</div>:
					<div className="form-btn c-bgc9">提交订单</div>
				}
			</div>
		)
	}
}

//优惠劵窗口
export class PopupCoupon extends Component{
	constructor(props){
		super(props);
		this.state ={
			data:"",
			coupon:""
		}
	}
	static contextTypes = {
		store:React.PropTypes.object
	};
	//选取优惠券
	pickCouponHandle=( coupon,limit,desc )=>{
		const { store } = this.context;
		this.setState({
			coupon:coupon
		});
		this.props.onPopup("");
		store.dispatch({
			type:"ORDER_CONFIRM",
			ctrl:"data",
			api:"applyCoupon",
			data:{ addr_id:createData.addr_id, mode:createData.mode,coupon_code:coupon,from:"wap" },
			cb:function(){
				store.dispatch({
					type:"ORDER_CONFIRM",
					ctrl:"coupon",
					data:coupon?`满${limit}减${desc}元`:"未使用"
				});
			}
		});
	};
	componentDidMount() {
		//请求优惠券
		const { coupon } = ctrlAPI,
			self = this;
		$.ajax({
			url:coupon.url,
			type:coupon.type,
			contentType:"application/json",
			data:{mode:createData.mode,from:"wap"},
			success:function( result ){
				if( !result.status ){
					Popup.MsgTip({msg:result.msg });
					return;
				}
				let { coupon_list } = result && result.data && result.data;
				self.setState({data:coupon_list });
			},
			error:function( xhr ){
				Popup.MsgTip({msg:"优惠券获取失败，请稍后再试" });
			}
		});
	}
	render(){
		const { data,coupon } = this.state;
		const { show } = this.props;
		return(
			<div className={`popup-coupon ${show?"active":""}`} >
				<div className="coupon-top  c-c999">
					优惠券
				</div>
				{data?
					(data.length ?
						<div className="coupon-body">
							<CouponList type="val" data={data} coupon={coupon} onCoupon={ this.pickCouponHandle }/>
							{/*<CouponList type="inv" />*/}
						</div>:
						<NoCoupon />
					):
					<LoadingImg />
				}
				<div className="coupon-btm">
					<div className="close-btn" onClick={ (e)=>{this.props.onPopup("")} }>关闭</div>
				</div>
			</div>
			)
	}
}

const timeUtils = {
	//时间格式化
	timeFormat( time ){
		time = new Date( time*1000 );
		let year = time.getFullYear(),
			month = this.toTwoDigit(time.getMonth()+1 ),
			date = this.toTwoDigit(time.getDate());
		return year+"."+month+"."+date;
	},
	toTwoDigit( num ){
		return num<10? "0"+num:num;
	}
};

//优惠券列表
export class CouponList extends Component{
	constructor(props){
		super(props);
		this.state={};
	}
	//优惠券品台适用
	platformApply( str ){
		let arr = str.split(",");
		const strToText ={
			pc:"PC端",
			wap:"WAP端",
			all:"ALL端"
		};
		let strArr = arr.map((item,i)=>{
			return strToText[item];
		});
		return strArr.join("、");
	}
	//优惠券适用范围
	couponApplyRange( coupon,shop,category,brand, rules ) {
		if( !coupon ){
			return "指定商品适用";
		}
		let text = "";
		if( shop ==="self" ){
			if( category!=="all" ){
				if( brand !== "all"){ text= "自营商品指定分类、品牌适用";}
				else{ text= "自营商品指定分类适用"; }
			}else{
				if( brand !== "all"){ text= "自营商品指定品牌适用";}
				else{ text=  "指定自营商品适用";}
			}
		}else{
			if( category!=="all" ){
				if( brand !== "all"){ text=  "指定分类、品牌适用";}
				else{ text=  "指定分类适用"; }
			}else{
				if( brand !== "all"){return "指定品牌适用";}
				else{ text=  "指定商品适用";}
			}
		}
		if( rules &&  rules.limit_item_ids ){
			text +="，特殊商品除外";
		}
		return text;
	};
	render(){
		const self = this;
		const {type,data,coupon} = this.props;
		const list = data && data.length && data.map((item,i)=>{
				let colour = (type==="val"?( item.isset_limit_money ?"red":"yellow") :"grey");
				return (
					<div className={`one-coupon g-row-flex ${colour}`} key={`coupon${i}`} onClick={ ()=> { self.props.onCoupon( item.coupon_code,+item.limit_money,+item.deduct_money );} } >
						<div className={`left `+colour }>
							<p className="one">¥<b>{+item.deduct_money}</b></p>
							<p className="two">满{+item.limit_money}使用</p>
						</div>
						<div className="right g-col-1">
							<p><span className={ colour } >{item.coupon_type?(item.used_shop_type==="self"?"自营券":"平台券"):"店铺券"}</span>{item.used_platform!=="all"&&`（限${self.platformApply(item.used_platform)}使用）`}</p>
							<p className="two">{self.couponApplyRange( item.coupon_type, item.used_shop_type, item.used_category, item.used_brand,item.rules ) }</p>
							<p>{timeUtils.timeFormat( item.use_start_time)}至{timeUtils.timeFormat( item.use_end_time)}</p>
						</div>
						<div className={`bg-text ${colour}`}>券</div>
						{coupon==item.coupon_code && <i className="current-black-icon"> </i>}
					</div>
				);
			});
		return(
		<div className={`coupon-${type}`}>
			<h3>{type==="val"?"可用优惠券":"不可用优惠券"}( {data && data.length} )</h3>
			<div className="coupon-list">
				{list}
				{type==="val" &&
					<div className="empty-coupon" onClick={ ()=> {self.props.onCoupon("");} } >
						不使用优惠券
						{coupon=="" && <i className="current-black-icon"> </i> }
					</div>
				}
			</div>
		</div>
		)
	}
}

//总额弹窗
class PopupTotalPrice extends Component{
	render() {
		const {data,show} = this.props;
		return (
			<div className={`popup-total ${show?"active":""}`} onTouchMove={ (e)=> e.preventDefault() } >
				<div className="popup-top">
					<span>应付总额</span> <i className="close-nobg-icon" onClick={ (e)=>{this.props.onPopup("") } }> </i>
				</div>
				<div className="list-grid">
					<div className="list g-row-flex">
						<div className="left">商品金额</div>
						<div className="right g-col-1">¥{data.total_price.toFixed(2)}</div>
					</div>
					<div className="list g-row-flex">
						<div className="left">活动优惠</div>
						<div className="right g-col-1">-¥{(data.total_discount_promotion+data.total_discount_coupon_shop).toFixed(2)}</div>
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

//无优惠券样式
let NoCoupon =()=>(
	<div className="c-tc" style={{padding:"30px 0 50px"}}>
		<img src="/src/img/orderConfirm/coupon-apply-bg.png" height="90" width="160"/>
		<p className="c-cc9 c-fs13 c-mt10">您没有相关优惠券哦~</p>
	</div>
);

//分期购样式
const Installment =({data})=>(
	<div className="installment-tip">
		<span>※ 分期购买：分{data.period}期，费率{(+data.fee_rate*100).toFixed(2)}%，首期免息</span>
		<i className="triangle-top-wathet-icon"> </i>
	</div>
);