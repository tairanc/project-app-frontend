import React, { Component } from 'react';
import { Link,browserHistory } from 'react-router';
import { Shady,LoadingRound,LoadingImg } from 'component/common';
import Popup,{ ModalAComp } from 'component/modal';
import { ownAjax } from 'js/common/ajax.js';
import Agreement from 'src/pages/agreement/agreement.jsx';
import './index.scss';

const ctrlAPI ={
	init:{url:"/originapi/order/init",type:"get"},
	submit:{ url:"/originapi/order/create", type:"post"},
	address:{ url:"/originapi/order/total", type:"post"},
	cashier:{ url:"/originapi/payment/prepare", type:"post"}
};

function createDataCreate(){
	return {
		addr_id:"",
		mode:"",
		md5_cart_info:"",
		from:"wap",
		payment_type:"finance"
	}
}

let createData= null;

export default class ZeroBuyConfrim extends Component{
  constructor(props) {
    super(props);
	  document.title="订单确认";
	  window.location.href = "jsbridge://set_title?title=订单确认";
	  createData = createDataCreate();
	  createData.mode = props.location.query.mode;
    this.state = {
	    data:"",
	    update:false,
	    address:false,
	    alteration:false,
	    alterationMsg:""
    };
  }
	iniData=()=>{
		ownAjax(ctrlAPI.init,{ mode:this.props.location.query.mode})
			.then( result =>{
				this.setState({data:result.data,update:true});
			})
			.catch(error=>{
				Popup.MsgTip({msg:"网络错误，请稍后再试"});
			});
	};
	updateData =( data )=>{
		this.setState({data:data});
	};
	toggleAddress=()=>{
		this.setState({ address: !this.state.address });
	};
	toggleAlteration=( msg )=>{
		this.setState({ alteration: !this.state.alteration ,alterationMsg: msg ? msg:"" });
	};
	componentDidMount() {
		$(this.refs.page).css({ minHeight:$(window).height() });
		this.iniData();
	}
	render(){
		const {update,data,address,alteration,alterationMsg } = this.state;
		return(
			<div data-page="zero-buy-confirm" ref="page">
				{ update && data ?
					<div>
						<PageTop data={data.order.cart[0].object[0] } rest={data.payment_info} />
						<PageMid />
						<UserAddress data={data.addrList} md5={data.md5CartInfo} update={ this.updateData } onAddress={ this.toggleAddress } addressShow={ address } />
						<OrderForm  data={data.order.cart[0].object[0].params } rest={data.payment_info} alteration={ this.toggleAlteration } />
						<ModalAComp active={address} msg={"您还没有收货地址，快去添加吧！"}
						            btns={[{ text:"取消", cb:()=>{ this.toggleAddress() } },
							            { text:"确定", cb: ()=>{  window.location="trmall://getAddressInfo" } }]}
						/>
						<ModalAComp active={ alteration } msg={ alterationMsg }
						            btns={[{ text:"取消", cb:()=>{  browserHistory.goBack(); } },
							            { text:"继续", cb: ()=>{  this.initialPage(); this.toggleAlteration("");  } }]}
						/>
					</div>:
					<LoadingRound />
				}
			</div>
		)
	}
}

const PageTop=({data,rest})=>{
	return(
		<div className="confirm-top">
			<OneItem data={ data }/>
			<InvestList data={ data.params } rest={rest}/>
		</div>
	)
};

const OneItem =({data})=>{
	return(
		<div className="one-item c-mb10">
			<div className="item-info g-row-flex">
				<Link to={`/item?item_id=${data.item_id}`} className="item-img c-dpb">
					<img src={data.image_default_id}  width="75" height="75"/>
				</Link>
				<div className="item-detail g-col-1">
					<Link to={`/item?item_id=${data.item_id}`} className="item-title">
						{data.type==="Direct"&& <span className="label yellow-label">海外直邮</span>}
						{data.type==="Bonded"&& <span className="label blue-label">跨境保税</span>}
						{data.promotion && <span className="act-label  c-fb">{data.promotion.promotion_tag}</span> }
						{data.title}
					</Link>
					<div className="item-props">{data.spec_info}</div>
					<div className="item-price c-clrfix">
						<span className="price c-fl">¥{ data.promotion ?(+data.promotion.promotion_price).toFixed(2):data.price.toFixed(2) }</span> <span className="num c-fr">×{data.quantity}</span>
					</div>
				</div>
			</div>
		</div>
	)
};

class InvestList extends Component{
	render(){
		const { data,rest } = this.props;
		return(
			<div className="invest-list">
				<div className="list">
					<div className="left">存入期限: {data.period}天</div>
				</div>
				<div className="list" style={{lineHeight:"26px"}}>
					<div className="left">投资金额: <span className="c-cf55">¥<b>{+data.invest}</b></span></div>
					<div className="right c-c80">*预计收益:¥{+data.profit}</div>
				</div>
				<div className="list">
					<div className="left">账户余额: ¥{rest.balance}</div>
					{ +data.invest > rest.balance && <div className="right c-cf55">余额不足</div>}
				</div>
			</div>
		)
	}
}

const PageMid =({data})=>{
	return(
		<div className="confirm-mid">
			<div className="list g-row-flex">
				<div className="left g-col-1">支付方式</div>
				<div className="right c-tr">理财支付</div>
			</div>
			<div className="list g-row-flex">
				<div className="left g-col-1">配送方式</div>
				<div className="right c-tr">快递配送</div>
			</div>
		</div>
	)
};

class UserAddress extends Component{
  constructor(props) {
    super(props);
	  let address = props.data && props.data.reduce((prev,cur)=>{
			  if( cur.def_addr==1 ) return cur;
			  else return prev;
		  },"");
	  createData.addr_id = address && address.addr_id;
	  createData.md5_cart_info = props.md5;
	  if( !address ){
	  	this.props.onAddress();
	  }
    this.state = {
	    address
    };
  }
	componentWillMount() {
		const self = this;
		window.onAddressResult = function (data) {
			if( self.props.addressShow ){
				self.props.onAddress();
			}
			data = JSON.parse(data);
			createData.addr_id = data.addressId;
			data.mobile = data.phone;
			data.addr = data.address;
			data.area_string = data.provinceName+ data.cityName + data.districtName;
			self.setState({address: data});
			ownAjax( ctrlAPI.address,{mode:createData.mode, from:"wap",addr_id:createData.addr_id}).then( result =>{
				self.props.update( result.data );
			})
		};
	}
	componentWillReceiveProps( newProps ){
		createData.md5_cart_info = newProps.md5;
	}
	componentWillUnmount(){
		window.onAddressResult = null;
	}
	render(){
		const {address} = this.state;
		return(
			<div className="user-address-grid">
				<a href="trmall://getAddressInfo" className="user-address g-row-flex g-col-mid g-col-ctr">
					<i className="location-address-icon"> </i>
					{address?
					<div className="content-text g-col-1">
						<div className="text-top g-row-flex">
							<span className="g-col-1">收货人：{address.name}</span><span className="user-phone">{address.mobile}</span>
						</div>
						<div className="text-bottom">
							收货地址：{address.area_string}{address.addr}
						</div>
					</div>:
					<div className="g-col-1 c-fs15">
						请填写收货地址
					</div>
					}

					<i className="arrow-right-icon"> </i>
				</a>
			</div>
		)
	}
}
let req = null;

//订单提交
export class OrderForm extends Component{
	constructor(props) {
		super(props);
		this.state = {
			agree:true,
			agreement:""
		};
		req = false;
	}
	agreeHandle=()=>{
		this.setState({
			agree: !this.state.agree
		})
	};
	submitHandle=()=>{
		if( req ) return;
		req = true;
		ownAjax( ctrlAPI.submit ,createData).then( result =>{
			if( result.biz_code === "10000" ){
				self.props.alteration( result.msg );
				req = false;
				return;
			}
			Popup.MsgTip({msg:result.msg});
			if( !result.status ){
				req = false;
				return;
			}
			setTimeout( ()=>{
				browserHistory.replace(`/cashier?oid=${result.data}&zeroBuy=1`);
				req = false;
			},1000);
			}).catch( xhr =>{
			req = false;
			Popup.MsgTip({msg:"提交订单失败"});
		})
	};
	agreementHandle=( type )=>{
		this.setState({ agreement:type });
	};
	render(){
		const {agree,agreement} = this.state;
		const {data,rest} = this.props;
		return(
			<div className="order-form">
				<div className="agree">
					<span onTouchTap={ this.agreeHandle }>{agree?<i className="current-agree-icon"> </i>:<i className="current-no-agree-icon"> </i>}</span>
					<span onClick={ this.agreementHandle.bind(this,"agreement")}>我已同意并接受《泰然城用户协议》</span>
				</div>
				{ agreement==="agreement" && <Agreement onClose={ this.agreementHandle.bind(this,"") }/> }
				{agree?
					( +data.invest > rest.balance?
							<a className="form-btn c-bgdred" href={`trmall://to_recharge?amount=${+data.invest-rest.balance}`} >充值{(+data.invest-rest.balance).toFixed(2)}元购买</a>:
							<div className="form-btn c-bgdred" onTouchTap={ this.submitHandle } >提交订单</div>
					):
					( +data.invest > rest.balance?
							<div className="form-btn c-bgc9" >充值{(+data.invest-rest.balance).toFixed(2)}元购买</div>:
							<div className="form-btn c-bgc9" >提交订单</div>
					)
				}
			</div>
		)
	}
}