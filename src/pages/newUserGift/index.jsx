import React, { Component } from 'react';
import ReactDOM,{ render } from 'react-dom';
import { Link } from 'react-router';
import { LoadingRound } from 'component/common';
import Popup from 'component/modal';

import 'src/scss/newUserGift.scss';
//礼包正在打包中，请您耐心等待！
export default class NewUserGift extends Component{
	componentWillMount(){
		this.setState({
			showRule: false,
			update: false,
			data: ''
		});
		document.title = '新人专享大礼包';
		window.location.href = 'jsbridge://set_title?title=新人专享大礼包';
		let self = this;
		$.ajax({
			url: `/newapi/gift/freshGift?t=${+(new Date())}`,
			type: 'get',
			success: function(data){
				if(!data.coupon.length){
					location.href = "https://www.tairanmall.com/wap/404.html";
					return
				}
				self.setState({
					update: true,
					data: data
				});
			},
			error: function(err){
				Popup.MsgTip({msg: err.msg?err.msg:'服务器繁忙'});
			}
		})
	};
	changeShow=()=>{
		this.setState({
			showRule: !this.state.showRule
		})
	}
	render(){
		let {showRule,update,data} = this.state;
	    return(
	    	update?
	        <section data-page="new-gift" >
		        <div id="new-gift">
					<div className="banner">
						<a href={data.deploy.head_link?data.deploy.head_link:'javascript:void(0);'}><img src={data.deploy.head_image?data.deploy.head_image:'./src/img/newUserGift/banner.png'} /></a>
						{data.deploy.fresh_rule?<button onClick={this.changeShow}>活动规则</button>:''}
					</div>
					<ShoppingGift image={data.deploy.promotion_image} data={data} />
					<FinanceGift data={data.deploy} />
					<div className="c-tc">
						<ul className="entrance">
							<li><a href='trmall://main?page=home'><img src="./src/img/newUserGift/shopping.png" /></a></li>
							<li><a href='trmall://to_home'><img src="./src/img/newUserGift/investment.png" /></a></li>
						</ul>
					</div>
					<Banner data={data.deploy.banner} />
					<div className="join">到底啦，快加入我们吧</div>
					{showRule?<Rule fn={this.changeShow} data={data.deploy.fresh_rule} />:''}
				</div>
			</section>
			:<LoadingRound />
	    )
	}
}

//活动规则
class Rule extends Component{
	render(){
		return(
			<div className="rule-box">
				<div className="rule">
					<h2 className="c-fs18 c-tc">活 动 规 则</h2>
					<p className="c-fs10">
						{/*1.2017年5月30日起，泰然城新注册用户可在活动页面领取新人专享礼包（888元+1000T币）；<br />
						2.新人专享礼包包含泰然金融588元返现礼包+1000T币和电商300元组合优惠券礼包两部分；<br />
						3.泰然金融新手福利具体可“金融—新人福利”中查看；<br />
						4.电商300元组合优惠券请在领取后7日内使用，其中包含：10元无门槛1张、满199元减20元2张、满499元减50元1张、满999元减100元2张；<br />
						5.新人专享礼包仅限在泰然城APP领取，电商优惠券在“我的——优惠券”中查看；<br />
						6.单个用户限领1次新人礼包（单个用户指：同一手机号、同一身份证、同一设备、同一IP地址、同一收货人等满足任意条件或其他可视为同一用户的情形），活动过程中凡以恶意手段（作弊、虚假交易、攻击系统、恶意套现等）参与该活动的用户，泰然城有权终止其参与活动并取消其领券资格；<br />
						7.如有疑问请联系在线客服或者拨打400-669-6610。*/}
						{this.props.data}
					</p>
					<button className="btn c-fs18" onClick={this.props.fn}>知道了</button>
					<div className="line"><div className="close" onClick={this.props.fn}></div></div>
				</div>
			</div>
		)
	}
}

//购物礼包
class ShoppingGift extends Component{
	componentWillMount(){
		this.setState({
			sending: false
		})
	};
	getCoupon=()=>{
		let {data} = this.props;
		if(!data.isLogin){
			location.href = 'trmall://to_login';
		}
		if(!this.state.sending){
			this.setState({
				sending: true
			});
			let self = this;
			$.ajax({
				url: '/newapi/gift/drawCoupon',
				type: 'POST',
				success: function(data){
					Popup.MsgTip({msg: data.data.msg});
					self.setState({
						sending: false
					});
				},
				error: function(err){
					Popup.MsgTip({msg: '服务器繁忙'});
					self.setState({
						sending: false
					});
				}
			});
		}
	}
	render(){
		let {data,image} = this.props;
		let coupons = data.coupon.map(function (item,i) {
			return <Coupon key={i} data={item} image={image} />
		})
		return(
			<div className="shopping">
				<div className="title c-pr">
					<img src="./src/img/newUserGift/hbg.png" />
					<p>新人优惠券礼包等你来领！</p>
				</div>
				<div className="coupon-box c-mb20">
					<ul className="coupon">
						{coupons}
					</ul>
				</div>
				<div className="get-coupon">
					<div className={'btn '+(data.isNew?'':'btn2')}>
						<button className="c-fs20 c-cfff" onClick={data.isNew?this.getCoupon:''}>一键领取</button>
					</div>
				</div>
			</div>
		)
	}
}

//优惠券
class Coupon extends Component{
	render(){
		let {data,image} = this.props;
		let styles = image?{
			backgroundImage: 'url('+image+')'
		}:{};
		return(
			<li className="each-coupon c-tc c-pr" style={styles}>
				<p className="c-fs13" style={{color:'#dc4316'}}>¥ <span className="c-fs35 c-fb">{data.deduct_money}</span></p>
				<p className="c-fs10 c-c666 require">指定商品{data.limit_money?('满'+data.limit_money+'元可用'):'无门槛'}</p>
			</li>
		)
	}
}

//金融礼包
class FinanceGift extends Component{
	render(){
		let {data} = this.props;
		return(
			<div className="finance" >
				<div className="fTitle">
					<img src="./src/img/newUserGift/hbg2.png" />
				</div>
				<div className="coupon-box c-mb10">
					<img style={{width:'100%'}} src={data.financial_image?data.financial_image:"./src/img/newUserGift/gift-bg.png"} />
				</div>
				<div className="get-coupon">
					<div className="btn">
						<a href={data.financial_link}><button className="c-fs20 c-cfff">立即查看</button></a>
					</div>
				</div>
			</div>
		)
	}
}

//底部banner
class Banner extends Component{
	componentDidMount(){
		let {data} = this.props;
		if(data.length>1){
			let mySwiper = new Swiper('.swiper-container',{
		    	autoplay: 2000,
				autoplayDisableOnInteraction: false,
				loop: true,
			});
		}
	};
	render(){
		let {data} = this.props;
		let banners = data.map(function (item,i) {
			return <li key={i} className='swiper-slide'><a href={item.banner_link?item.banner_link:'javascript:void(0);'}><img src={item.banner_image} /></a></li>
		})
		return(
			<div className="banner" data-plugin="swiper">
				<div className="swiper-container" style={{width:'100%'}}>
					<ul className="swiper-wrapper">
						{banners}
					</ul>
				</div>
			</div>
		)
	}
}