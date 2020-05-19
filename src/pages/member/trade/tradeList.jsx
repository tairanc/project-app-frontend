import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router';
import {NoMore,LoadingRound,NoMoreOrder } from 'component/common';
import Popup from 'component/modal';
import { orderStatusMap,cancelOrderMap } from 'js/filters/orderStatus';
import { ownAjax } from 'js/common/ajax.js';
import { DropDownLoad } from 'component/HOC.jsx';
import 'src/scss/tradeAll.scss';

let navData =[
	{text:"全部", status:0 , url:"/tradeList/0"},
	{text:"待付款", status:1, url:"/tradeList/1"},
	{text:"待发货", status:2, url:"/tradeList/2"},
	{text:"待收货", status:3, url:"/tradeList/3"},
	{text:"待评价", status:4, url:"/tradeList/4"}
];
let orderStatus =["all","pay","send", "receive", "evaluate"];

const listAPI ={
	init:{ url:"/originapi/user/orders",type:"get"},
	del:{ url:'/originapi/user/order/remove',type:"get"},
	conf:{ url:"/originapi/user/order/confirm",type:"get" },
	cashier:{ url:"/originapi/payment/prepare", type:"post"}
};

//swiper 的tab切换
let tradeListSwiper ={};
//订单列表
export default class TradeList extends Component {
	constructor(props) {
		super(props);
		document.title= '我的订单';
		window.location.href = "jsbridge://set_title?title=我的订单";
		let self = this;
	};
	static contextTypes = {
		store:React.PropTypes.object,
		router:React.PropTypes.object
	};
	componentDidMount(){
		let self =this;
		let { store } = this.context;
		//设置高
		//绑定整个滑块
		let defaultStatus = this.props.params.status;
		let navList =$(".trade-list-nav .nav-list");
		let listSwiper = new Swiper(this.refs.list,{
			initialSlide :defaultStatus,
			autoHeight: true,
			onSlideChangeStart:function(swiper){
				self.context.router.replace( navData[swiper.activeIndex].url );
				let action ={type:"TRADE_LIST",listNum:swiper.activeIndex };
				store.dispatch( action );
			},
			onTouchStart: function(swiper,even){
				if( swiper.activeIndex == 0 ){
					swiper.lockSwipeToPrev();
				}else{
					swiper.unlockSwipeToPrev();
				}
				if( swiper.activeIndex ==swiper.slides.length-1 ){
					swiper.lockSwipeToNext();
				}else{
					swiper.unlockSwipeToNext();
				}
			}
		});
		if( listSwiper.activeIndex == 0){
			let action ={type:"TRADE_LIST",listNum:0 };
			store.dispatch( action );
		}
		tradeListSwiper = listSwiper;
		navList.each(function(i,item){
			$(item).on("click",function(e){
				listSwiper.slideTo( i,300,true );
			});
		});
	};
	componentWillUnmount(){
		const modal =document.querySelector("#modal");
		modal && modal.parentNode && modal.parentNode.removeChild(modal);
		const msgTip =document.querySelector("#msgTip");
		msgTip && msgTip.parentNode && msgTip.parentNode.removeChild(msgTip);
	}
	render(){
		return (
			<div data-plugin="swiper" data-page="trade-list" style={{height:$(window).height(),overflow:"hidden" }}>
				<section id="tradeList" ref="list" className="swiper-container trade-list" >
					<ListNav data={navData} status={this.props.params.status}/>
					<ListInfo listLength="5" status={this.props.params.status}/>
				</section>
			</div>
		);
	}
}
//导航栏
export class ListNav extends Component{
	static contextTypes = {
		store:React.PropTypes.object,
		router:React.PropTypes.object
	};
	render(){
		let {data,status} = this.props;
		let self = this;
		let html = data.map(function( item, i ){
			return(
				<Link to={item.url} className="nav-list" key={i} activeClassName="active" onClick={ (e)=>{ e.preventDefault(); self.context.router.replace( item.url ) } }>
					<span>{item.text}</span>
				</Link>
			);
		});
		return(
			<nav className="trade-list-nav" id="trade-list-nav">
				{html}
			</nav>
		);
	}
}
//内容列表栏
export class ListInfo extends Component{
	static contextTypes = {
		store:React.PropTypes.object
	};
	constructor(props){
		super(props);
		this.state ={};
	}
	render(){
		let html=[];
		let l = this.props.listLength;
		for( let i=0;i<l ;i++ ){
			html.push( <OneListInfoCtrl  status={orderStatus[i]} key={i}/> )
		}
		return(
			<div className="swiper-wrapper list-main">
				{ html }
			</div>
		)
	}
}

//列表内容控制
export class OneListInfoCtrl extends Component{
	constructor(props) {
		super(props);
		this.init = true;
		this.totalPage =10000;
		this.sendData ={
			status:this.props.status,
			pageNum:10,
			page:1
		};
		this.state = {
			dataList:[],
			update:false,
			refresh:false
		};
	};
	static contextTypes = {
		store:React.PropTypes.object
	};

	delOrderHandle=( tid )=>{
		let list =this.state.dataList;
		for( let i= 0,arr; arr=list[i];i++){
			if( arr.id ==tid ){
				list.splice(i,1);
			}
		}
		this.setState({
			dataList:list
		})
	};
	loadDownHandle =( me )=>{
		const self  =this;
		if(this.sendData.page >= this.totalPage ){
			me.lock();
			me.noData();
			me.resetload();
			return;
		}
		this.sendData.page++;
		ownAjax( listAPI.init,self.sendData)
			.then( result=>{
				let {dataList} = this.state;
				dataList = dataList.concat( result.trades);
				self.setState({
					dataList:dataList
				});
				me.resetload();
			})
			.catch( xhr=>{
				me.resetload();
			})
	};
	updateSwiper=()=>{
		tradeListSwiper.update();
	};
	componentDidMount() {
		const self = this;
		let { status } = self.props;
		let {store} = self.context;
		this.unSubscribe = store.subscribe(()=>{
			let state = store.getState().initial;
			if( state.type == "TRADE_LIST"&& orderStatus[state.listNum]==status ){
				self.sendData.page = 1;
				self.setState({ update:false });
				ownAjax(listAPI.init,self.sendData)
					.then( result =>{
						self.sendData.page = result.pagers.current;
						self.totalPage = result.pagers.total;
						self.setState({
							dataList: result.trades,
							update:true
						});
					});
			}
		});
	}
	componentDidUpdate() {
		tradeListSwiper.update();
		if( !this.state.refresh ){
			this.setState( { refresh:true } );
		}
	}
	componentWillUnmount() {
		this.unSubscribe();
	}
	render(){
		const {update,dataList } = this.state;
		return (
			<div className="swiper-slide" ref="oneList" style={{overflow:'auto',height:document.body.clientHeight -40 }}>
				{update?
				(dataList && dataList.length)?
					<DropDownList data={dataList} dropDown={this.loadDownHandle} scrollArea={$(this.refs.oneList)} didMount={ this.updateSwiper } onDelete={this.delOrderHandle }/>:
					<NoMoreOrder />:
					<LoadingRound />
				}
			</div>
		)
	}
}

//列表内容
export class OneListInfo extends Component{
	render(){
		let  {data} = this.props;
		const listCtt = data.map((item,i)=>{
			let showCtrl = true;
			if( orderStatusMap[item.status] =="待发货" ){
				showCtrl = false;
			}
			if(item.good_orders.length ==1){
				return <OneOrder key={i} data={item} showCtrl={showCtrl} onDelete={this.props.onDelete }/>
			}else{
				return <MultiOrder key={i} data={item} showCtrl={showCtrl}  onDelete={this.props.onDelete } />;
			}
		});
		return(
			<div className="list-data">
				{listCtt}
			</div>
		)
	}
}

const DropDownList = DropDownLoad(OneListInfo);
//一件商品订单
export class OneOrder extends Component{
	render(){
		const {data} = this.props;
		return(
			<li className="one-order">
				<OneOrderInfo data={data} />
				{this.props.showCtrl && <OrderCtrl type={data.type}
												   buyType={ data.pay_type }
												   data={data}
												   onDelete={this.props.onDelete }
												   groupStatus={ data.group_buy_status }
												   status={data.status}
												   tid={data.id}
												   virtual={data.is_virtual}
												   platform={data.platform}
					
				/>}
			</li>
		)
	}
}
//一件商品订单信息
export class OneOrderInfo extends Component{
	render(){
		const {data}= this.props;
		const order = data.good_orders[0];
		let status = orderStatusMap[data.status];
		if( data.type ==3 ){
			data.group_buy_status==="IN_PROCESS" ? status="拼团中":"";
			( data.group_buy_status==="FAILED" && status !=="已关闭" ) ? status = "拼团失败" :"";
		}
		return(
			<div className="order-info">
				<div className="list-body">
					<div className="list-img">
						<Link to={`/tradeDetail?tid=${data.id}`} >
							<img src={order.pic_path} />
						</Link>
					</div>
					<div className="list-body-ctt">
						<div className="order-info-detail">
							<div className="order-info-top">
								<Link to={`/tradeDetail?tid=${data.id}`} className="order-info-title">{order.title}</Link>
								<div className="order-info-type">{order.spec_nature_info}</div>
							</div>
							<div className="order-status-wrap">
								<div className="cancel-status">{cancelOrderMap[data.cancel_status]}</div>
								<div className="order-status">{ status }</div>
							</div>
						</div>
						<div className="order-total">
							<span className="order-number">共{data.item_num}件商品</span>  实付款：<span className="order-total-pay">{(+data.payment).toFixed(2)}</span>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
//多件商品订单
export class MultiOrder extends  Component{
	render(){
		const {data} = this.props;
		return(
			<li className="multi-order">
				<MultiOrderInfo data={data} />
				{this.props.showCtrl && <OrderCtrl type={data.type}
				                                   buyType={ data.pay_type }
				                                   data = {data}
				                                   onDelete={this.props.onDelete }
				                                   status={data.status}
				                                   tid={data.id}
				                                   virtual={data.is_virtual}
												   platform={data.platform} />
				}
			</li>
		);
	}
}
//多件商品订单信息
class MultiOrderInfo extends  Component{
	componentDidMount() {
		const multiSwiper = new Swiper( this.refs.list,{
			slidesPerView: 'auto',
			freeMode:true
		});
	}
	render(){
		const { data } = this.props;
		return(
			<div className="order-info">
				<div className="list-body">
					<div className="body-top c-tr">
						<span className="c-clblue c-mr5">{cancelOrderMap[data.cancel_status]}</span><span className="c-cf55">{orderStatusMap[data.status]}</span>
					</div>
					<div className="body-middle swiper-container" ref="list">
						<Link to={`/tradeDetail?tid=${data.id}`} className="swiper-wrapper">
							{ data.good_orders && data.good_orders.map((item,i)=>{
									return <img key={i} src={item.pic_path} className="swiper-slide"/>
								})
							}
						</Link>
					</div>
					<div className="body-btm c-tr">
						共{data.item_num}件商品  实付款：¥{(+data.payment).toFixed(2)}
					</div>
				</div>
			</div>
		)
	}
}

let isReq = false;
//订单控制
export class OrderCtrl extends Component{
	showModal=()=>{
		const self = this;
		const {tid} = this.props;
		Popup.Modal({
			isOpen:true,
			msg:"是否要删除订单？"
		},()=>{
			if( isReq ){
				return;
			}
			isReq = true;
			$.ajax({
				url:listAPI.del.url,
				type:listAPI.del.type,
				data:{tid:tid},
				success:function( result ){
					isReq = false;
					Popup.MsgTip({ msg:result.msg });
					if( !result.status ){
						return;
					}
					window.setTimeout(()=>{
						self.props.onDelete(tid);
					},2000);
				},
				error( xhr ){
					isReq = false;
					Popup.MsgTip({ msg:"网络错误，删除失败" });

				}
			});
		});
	};
	confirmRece=()=>{
		const self = this;
		const {tid} = this.props;
		Popup.Modal({
			isOpen:true,
			msg:"是否要确认收货？"
		},()=>{
			if( isReq ){
				return;
			}
			isReq = true;
			$.ajax({
				url:listAPI.conf.url,
				type:listAPI.conf.type,
				data:{tid:tid},
				success:function( result ){
					isReq = false;
					Popup.MsgTip({ msg:result.msg });
					if( !result.status ){
						return;
					}
					window.setTimeout(()=>{
						tradeListSwiper.slideTo(4,300,true );
					},1000);
				},
				error( xhr ){
					isReq = false;
					Popup.MsgTip({ msg:"网络错误，删除失败" });
				}
			});
		});
	};
	showAfterSale = ()=>{
		let { data,type, virtual,groupStatus, status } = this.props;
		status = orderStatusMap[status];
		let showAfterSale = type !=1 && !virtual &&
			( groupStatus !== "SUCCESS" || (orderStatusMap[status]==="待评价"||orderStatusMap[status]==="已完成" ) ) &&
			!data.is_time_out && data.good_orders.some( ( item, i)=>{
				return !item.after_sales_num || item.after_sales_num <=2 ;
			});
		return Boolean(showAfterSale)
	};
	render(){
		let {status,tid,virtual,type, buyType, platform } = this.props;
        let unWrd = platform !== "tairango";  //是否为无人店订单
		let btnGroup ="";
		 status = orderStatusMap[status];
		switch (status){
			case "待付款":
				btnGroup = [
					type!==1 && <a className="ctrl-block cancel-order" key="1" href={`/orderCancel?tid=${tid}`}>取消订单</a> ,
					<a className="ctrl-red pay-order" key="3"  href={`/cashier?oid=${tid}&from=list${type==1?"&zeroBuy=1":""}`}>
						{ buyType==="offline"?"线下支付": "立即支付"}
					</a>
					];
				break;
			case "待收货":
				btnGroup = [
                    unWrd && this.showAfterSale() && <Link className="ctrl-block" key="1" to={`/tradeDetail?tid=${tid}`}>申请售后</Link>,
                    unWrd && !virtual && <Link className="ctrl-red pay-order" key="2" to={`/logistics?tid=${tid}`}>查看物流</Link>,
					<a className="ctrl-red pay-order" key="3" onTouchTap={ this.confirmRece } href="javascript:;" >确认收货</a>
				];
				break;
			case "待评价":
				btnGroup = [
                    unWrd && this.showAfterSale() && <Link className="ctrl-block" key="1" to={`/tradeDetail?tid=${tid}`}>申请售后</Link>,
                    unWrd && !virtual && <Link className="ctrl-red pay-order" key="2" to={`/logistics?tid=${tid}`}>查看物流</Link>,
					<Link className="ctrl-red pay-order" key="3" to={`/evaluateInput?tid=${tid}`} >评价晒单</Link>
				];
				break;
			case '已完成':
				btnGroup = [
                    unWrd && this.showAfterSale() && <Link className="ctrl-block" key="1" to={`/tradeDetail?tid=${tid}`}>申请售后</Link>,
                    unWrd && !virtual && <Link className="ctrl-red pay-order" key="2" to={`/logistics?tid=${tid}`}>查看物流</Link>,
					<a className="ctrl-block" key="3" onTouchTap={ this.showModal } >删除订单</a>
				];
				break;
			case '已关闭':
				btnGroup = 	<a className="ctrl-block" onTouchTap={ this.showModal } >删除订单</a>;
				break;
			case "拼团中":
				btnGroup = [<a className="ctrl-red cancel-order" key="1" href="javascript:;">邀请好友参团</a>];
				break;
			default:break;
		}
		return(
			<div className="order-ctrl c-tr">
				{btnGroup}
			</div>
		)
	}
}


