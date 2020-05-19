import React, { Component } from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import { ownAjax } from 'js/common/ajax';
import { concatPageAndType } from 'js/actions/actions';

import 'src/scss/personCenter.scss';

const ctrlAPI ={
	user:{ url:"/user/user/profile", type:"get" },
	orderNum:{ url:"/newapi/user/order/count", type:"get" },
	couponNum:{ url:"/originapi/wapapi/coupon.api?count_no_use=1",type:"get"}
};
const createActions = concatPageAndType("personCenter");

//订单状态列表
const 	orderStatusArr = [
	{
		iconClass:"status-wait-pay-icon",
		text:"待付款",
		numberType:"pay_count",
		url:"/tradeList/1"
	},
	{
		iconClass:"status-wait-send-icon",
		text:"待发货",
		numberType:"send_count",
		url:"/tradeList/2"
	},
	{
		iconClass:"status-wait-receive-icon",
		text:"待收货",
		numberType:"confirm_count",
		url:"/tradeList/3"
	},
	{
		iconClass:"status-wait-evaluate-icon",
		numberType:"evaluate_count",
		text:"待评价",
		url:"/tradeList/4"
	},
	{
		iconClass:"after-sale-icon",
		text:"退款/售后",
		url:"/afterSale/list"
	}
];

//九宫格
const greyViewList1=[
	{
		imgClass:"shop-collection",
		url:"/collect",
		name:"商品收藏",
		describe:"",
		imgUrl:'/src/img/personCenter/shop-collection.png',
		linkType:"link",
		login:true
	},
	{
		imgClass:"grid-coupon",
		url:"/couponList",
		name:"优惠券",
		describe:"0张",
		imgUrl:'/src/img/personCenter/grid-coupon.png',
		linkType:"link",
		login:true
	},
	{
		imgClass:"receive-addr",
		url:"trmall://manageAddressInfo",
		name:"收货信息",
		describe:"收货地址 身份证",
		imgUrl:'/src/img/personCenter/receive-addr.png',
		linkType:"a",
		login:false
	},
	{
		imgClass:"financial-assets",
		url:"trmall://to_user",
		name:"金融资产",
		describe:"",
		imgUrl:'/src/img/personCenter/financial-assets.png',
		linkType:"a",
		login:false
	},
	{
		imgClass:"shop-group-purchase",
		url:"/myGroupList/0",
		name:"我的拼团",
		describe:"",
		imgUrl:'/src/img/personCenter/group-purchase.png',
		linkType:"link",
		login:true
	},
	{
		imgClass:"voucher-center",
		url:"/rechargeCenter",
		name:"充值中心",
		describe:"",
		imgUrl:'/src/img/personCenter/voucher-center.png',
		linkType:"link",
		login:true
	},
	{
		imgClass:"xt-e-card",
		url:"trmall://wallet_center",
		name:"我的支付",
		describe:"e卡管理",
		imgUrl:'/src/img/personCenter/xt-e-card.png',
		linkType:"a",
		login:true
	},
	{
		imgClass:"my-qr-code",
		url:"trmall://to_invite",
		name:"我的二维码",
		describe:"邀请好友",
		imgUrl:'/src/img/personCenter/my-qr-code.png',
		linkType:"a",
		login:true
	},
	{
		imgClass:"xt-community",
		url:"https://bbs.trc.com",
		name:"小泰社区",
		describe:"",
		imgUrl:'/src/img/personCenter/xt-community.png',
		login:false
	}
];
const greyViewList2 =[
	{
		imgClass:"pocket-wallet",
		name:"口袋钱包",
		describe:"",
		imgUrl:'/src/img/personCenter/pocket-wallet.png',
		login:false
	},
	{
		imgClass:"xt-happy-life",
		url:"http://t.cn/RtXJEPU",
		name:"小泰乐活",
		describe:"",
		imgUrl:'/src/img/personCenter/xt-happy-life.png',
		login:false
	},
	{
		imgClass:"public-welfare",
		url:"https://lovem.trc.com",
		name:"小泰公益",
		describe:"",
		imgUrl:'/src/img/personCenter/public-welfare.png',
		login:false
	},
	{
		imgClass:"yhby-hospital",
		url:"javascript:;",
		name:"一乎百医",
		describe:"敬请期待",
		imgUrl:'/src/img/personCenter/yhby-hospital.png',
		login:false
	},
	{
		imgClass:"credit-score",
		url:"https://credit.trc.com/m",
		name:"小泰信用",
		describe:"",
		imgUrl:'/src/img/personCenter/credit-score.png',
		login:false
	},
	{
		imgClass:"contact-service",
		url:"trmall://custom_service",
		name:"联系客服",
		describe:"",
		imgUrl:'/src/img/personCenter/contact-service.png',
		login:true
	}
];
/*function newWindow( url ){
	return window.location.protocol+"//"+window.location.host+url;
}*/
//个人中心
export default class PersonCenter extends Component {
	 constructor(props) {
		 super(props);
		 this.state = {};
	 };
	static contextTypes ={
		router:React.PropTypes.object,
		store:React.PropTypes.object,
		isLogin:React.PropTypes.bool
	};
	/*componentWillMount(){
		this.context.router.setRouteLeaveHook(
			this.props.route,
			this.routerWillLeave
		)
	}
	routerWillLeave(){
		 return window.confirm("是否离开页面？")
	}*/
	componentWillMount() {
		document.title ="泰然城";
		window.location.href = "jsbridge://set_title?title=泰然城";
	}
	render() {
		return (
			<div data-page="person-center">
				<div id="personCenter">
					<UserInfoHeadConnect  isLogin={ this.context.isLogin }/>
					<UserOrder />
					<UserOrderStatusConnect  isLogin={ this.context.isLogin } orderStatus={orderStatusArr} />
					<NineGridViewConnect  isLogin={ this.context.isLogin } />
				</div>
			</div>
		);
	}
}

//头部
class UserInfoHead extends React.Component{
  constructor(props) {
    super(props);
  };
	componentDidMount() {
		this.props.getData();
	}
	render(){
		const { isLogin,userInfo } = this.props;
		return(
			<section className="person-center-header" >
				<a href="trmall://setting" className="setting-btn" > </a>
				<a className="user-header c-tc" href={isLogin?"trmall://userinfo":"trmall://to_login"}>
					<div className="header-img"><img src={userInfo.avatar?userInfo.avatar:"/src/img/icon/avatar/default-avatar.png"} /></div>
					<i className="c-fs16 c-cfff">{ isLogin?(userInfo.nickName?userInfo.nickName:userInfo.phone):"点击登录/注册" }</i>
				</a>
			</section>
		)
	}
}

function infoHeadState( state,props ){
	let newState = state.personCenter;
	return {
		userInfo:newState.userInfo
	}
}
function infoHeadDispatch( dispatch, props ){
	return {
		getData:function(){
			if( props.isLogin ){
				ownAjax( ctrlAPI.user ).then( result =>{
					dispatch( createActions("getUserInfo",{ data:result } ))
				})
			}
		}
	}
}
const UserInfoHeadConnect = connect(infoHeadState,infoHeadDispatch )(UserInfoHead);

//判断是Link还是A标签
class LinkOrA extends Component{
	render(){
		const { type,className,link } = this.props;
		if( type==="link"){
			return <a href={link} className={className}>{this.props.children}</a>
		}else{
			return <a href={link}  className={className}>{this.props.children}</a>
		}
	}
}

//我的订单
export  class UserOrder extends Component{
	static contextTypes ={
		isLogin:React.PropTypes.bool
	};
	render(){
		const {isLogin} = this.context;
		return(
			<div>
				<LinkOrA className="user-order c-clrfix"  link={isLogin?"/tradeList/0":"trmall://to_login"} type={isLogin?"link":"a" }>
					<div className="c-fl">
						<i className="menu-icon"> </i><span>我的订单</span>
					</div>
					<div className="c-fr">
						<span>查看全部</span><i className="arrow-right-icon"> </i>
					</div>
				</LinkOrA>
			</div>

		)
	}
}

//订单状态
export class UserOrderStatus extends  Component{
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.props.getData();
	}
	render(){
		const { orderNum,isLogin } = this.props;
		let userOrderStatusText=this.props.orderStatus.map((item,i)=>{
			return <OrderStatus key={i}  item={item} num={ orderNum[item.numberType]} login={isLogin} />
		});
		return(
			<div className="order-status-list">
				{userOrderStatusText}
			</div>
		)
	}
}
function orderStatusState( state,props ){
	let newState = state.personCenter;
	return {
		orderNum:newState.orderNum
	}
}
function orderStateDispatch( dispatch, props ){
	return {
		getData:function(){
			if( props.isLogin ){
				ownAjax( ctrlAPI.orderNum).then( result =>{
					dispatch( createActions("getOrderNum", {data:result} ));
				})
			}
		}
	}
}
const UserOrderStatusConnect = connect( orderStatusState, orderStateDispatch )(UserOrderStatus);

//单个订单状态
class OrderStatus extends Component{
	render(){
	const { num, item,login } = this.props;
		return(
			<div className="order-icon c-tc">
				<LinkOrA link={login?item.url:"trmall://to_login"} type={login?"link":"a" } >
					<i className={`icon-img ${item.iconClass}`}>
						{ num?<i className="order-status-number c-cf55">{num}</i>:""}
					</i>
					<span>{item.text}</span>
				</LinkOrA>
			</div>
		)
	}
}

class NineGridViewCtrl extends Component{
  constructor(props) {
    super(props);
  }
	componentDidMount() {
		this.props.getCouponNum();
	}
	render(){
		return(
			<div>
				<NineGridView data={this.props.list1} />
				<NineGridView data={this.props.list2}/>
			</div>
		)
	}
}
function nineGridState( state, props ){
	let newState = state.personCenter;
	greyViewList1[1].describe = newState.couponNum +"张";
	return {
		list1:greyViewList1,
		list2:greyViewList2,
		couponUpdate:newState.couponUpdate
	}
}
function nineGridDispatch( dispatch, props ){
	return {
		getCouponNum:function(){
			if( props.isLogin ){
				ownAjax( ctrlAPI.couponNum).then( result=>{
					dispatch( createActions("getCouponNum",{ num:result }) );
				});
			}
		}
	}
}

const NineGridViewConnect = connect( nineGridState, nineGridDispatch )(NineGridViewCtrl);
//九宫格
class NineGridView extends Component{
	static contextTypes={
		isLogin:React.PropTypes.bool
	};
	render() {
		const { isLogin } = this.context;
		let gridViewData = this.props.data.map(( item,i)=>{
			return(
				<LinkOrA key={i} className={item.imgClass}
				         link={isLogin?item.url:"trmall://to_login"}
				         type={ item.linkType=="link" && isLogin ?"link":"a"} >
					<img src={item.imgUrl}/>
					<span>{item.name}</span>
					<i>{item.describe}</i>
				</LinkOrA>
			)
		});
		return (
			<div className="nine-grid-view c-clrfix">
				{gridViewData}
			</div>
		)
	}
}