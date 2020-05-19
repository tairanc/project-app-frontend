import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Link} from 'react-router';
import {LoadingRound} from 'component/common';
import Popup from 'component/modal';
import {dateUtil} from "js/util/index";
import {RNDomain} from 'src/config/index'

import 'src/scss/coupon.scss';

class LinkOrA extends Component {
	render() {
		const {type, className, link} = this.props;
		if (type === "link") {
			return <Link to={link} className={className}>{this.props.children}</Link>
		} else {
			return <a href={link} className={className}>{this.props.children}</a>
		}
	}
}

export default class CouponList extends Component {
	constructor(props) {
		super(props);
		let self = this;
		this.state = {
			countData: [],
			couponData: [],
			update: false,
			listUpdate: false,
			type: 1,
			hasMore: true,
			sending: false,
			page: 2
		}
	};

	static contextTypes = {
		store: React.PropTypes.object,
		router: React.PropTypes.object
	};

	componentDidMount() {
		let self = this;
		this.getMsg(1);
	};

	getMsg = (status) => {
		let self = this;
		self.setState({
			listUpdate: false
		})
		$.ajax({
			url: "/originapi/user/coupon/list/get",
			type: "get",
			data: {
				is_valid: status,
				page_size: 10,
				pages: 1
			},
			success: function (data) {
				if (data.code === 200 && data.status === true) {
					self.setState({
						countData: data.data.couponList.count,
						couponData: data.data.couponList.data,
						update: true,
						listUpdate: true,
						type: status,
						hasMore: (parseInt(data.data.pagers.current) < data.data.pagers.total) ? true : false
					});
					$('#coupon-list').css({height: $(window).height()});
				}
			},
			error: function (err) {
				Popup.MsgTip({msg: "服务器繁忙"});
			}
		});
	};
	addMsg = (status) => {
		let self = this;
		let {page} = self.state;
		self.setState({sending: true});
		$.ajax({
			url: "/originapi/user/coupon/list/get",
			type: "get",
			data: {
				is_valid: status,
				page_size: 10,
				pages: page
			},
			success: function (data) {
				if (data.code === 200 && data.status === true) {
					self.setState({
						couponData: self.state.couponData.concat(data.data.couponList.data),
						type: status,
						hasMore: (data.data.pagers.current < data.data.pagers.total) ? true : false,
						sending: false,
						page: page + 1
					});
				} else {
					Popup.MsgTip({msg: "服务器繁忙"});
					self.setState({sending: false})
				}
			},
			error: function (err) {
				Popup.MsgTip({msg: "服务器繁忙"});
				self.setState({sending: false})
			}
		});
	};

	componentWillMount() {
		document.title = '优惠券';
		window.location.href = 'jsbridge://set_title?title=优惠券';
	};

	changePage = () => {
		this.setState({page: 2})
	};

	render() {
		let {countData, type, couponData, hasMore, sending} = this.state;
		return (
			this.state.update ?
				<div data-page="coupon-list">
					<section id="coupon-list" ref="coupon">
						<CouponNav data={countData} fn={this.getMsg} changePage={this.changePage}/>
						{this.state.listUpdate ?
							<List fn={this.addMsg} data={couponData} type={type} hasMore={hasMore} sending={sending}/> :
							<LoadingRound />}
					</section>
				</div>
				: <LoadingRound />
		)
	}
}

//nav
class CouponNav extends Component {
	componentDidMount() {
		let {fn, changePage} = this.props;
		$('.coupon-nav li').click(function (e) {
			if ($(this).attr('class') === "active-one") {
				//..
			} else {
				$(this).addClass('active-one').siblings().removeClass('active-one');
				let status = parseInt($('.active-one').attr('id'));
				fn(status);
				changePage();
			}

		});
	};

	render() {
		let {data} = this.props;
		return (
			<ul className="coupon-nav c-c35 c-tc c-fs14">
				<li className="active-one" id="1">未使用({data.no_use > 99 ? '99+' : data.no_use})</li>
				<li id="0">已使用({data.used > 99 ? '99+' : data.used})</li>
				<li id="2">已过期({data.expired > 99 ? '99+' : data.expired})</li>
			</ul>
		)
	}
}

//兑换
class Exchange extends Component {
	componentWillMount() {
		this.setState({
			canExchange: true
		})
	};

	componentDidMount() {
		$('.exchange input').on('input change', function (e) {
			if ($(this).val()) {
				$(this).next().css({'background-color': '#e60a30'});
			} else {
				$(this).next().css({'background-color': '#c9c9c9'});
			}
		});
		let self = this;
		$('.exchange button').click(function (e) {
			let txt = $('.exchange input').val();
			if (txt != '') {
				if (self.state.canExchange) {
					self.setState({
						canExchange: false
					});
					$.ajax({
						url: '/originapi/user/coupon/code/get',
						type: 'get',
						data: {
							exchange_code: txt
						},
						success: function (data) {
							self.setState({
								canExchange: true
							})
							Popup.MsgTip({msg: data.msg});
							$('.exchange input').val('');
							$('.exchange button').css({'background-color': '#c9c9c9'});
							if (data.status === true) {
								setTimeout(function () {
									history.go(0);
								}, 500);
							}
						},
						error: function (err) {
							Popup.MsgTip({msg: "服务器繁忙"});
							$('.exchange input').val('');
						}
					});
				}
				;
			}
		});
	};

	render() {
		return (
			<div className="exchange">
				<input type="text" placeholder="请输入兑换码"/>
				<button>兑换</button>
			</div>
		)
	}
}

//购物券列表
class List extends Component {
	componentWillUnmount() {
		$(window).unbind('scroll.get')
	}

	componentWillMount() {
		$("html,body").css({overflowY: "visible"})
	}

	componentDidMount() {
		let type = parseInt($('.active-one').attr('id'));
		let self = this;
		self.setState({
			type: type
		});
		$(window).bind('scroll.get', function () {
			let scrollH = $(window).scrollTop();
			let scrollHeight = $(".list-contrl").height() - $(window).height();
			if (scrollH >= scrollHeight) {
				if ($('.more').html() === "下拉加载更多") {
					self.props.fn(type);
				}
			}
		})
	};

	render() {
		let {data, type, hasMore, sending} = this.props;
		let coupons = data.map(function (item, i) {
			return <EachCoupon data={item} type={type} key={i}/>
		})
		return (
			<div className="list-contrl">
				{(type == 1) ? <Exchange /> : ''}
				<div className="each-list">
					{data.length ? coupons : <NoCoupon />}
				</div>
				{data.length ? <div className="more">{hasMore ? (sending ?
					<span className="loading">加载中...</span> : '下拉加载更多') : ((type == 2) ?'仅保留90天内的记录':'别拉了，我是有底线的~')}</div> : ""}
			</div>
		)
	}
}

//无购物券
class NoCoupon extends Component {
	render() {
		return (
			<div className="no-coupon">
				<img src="./src/img/evaluate/no-coupon.png"/>
			</div>
		)
	}
}

//列表内单个购物券
class EachCoupon extends Component {
	getDate = (tm) => {
		let tt = new Date(parseInt(tm) * 1000);
		let ttyear = tt.getFullYear(),
			ttmonth = parseInt(tt.getMonth()) + 1,
			ttday = tt.getDate();
		let couponTime = ttyear + "." + ttmonth + "." + ttday;
		return couponTime;
	};
	noUse = () => {
		Popup.MsgTip({msg: "还未到使用时间哦"});
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
	render() {
		let {data, type} = this.props;
		let startTime = (dateUtil.format( data.use_start_time * 1000, "Y/M/D H:F")).slice(2),
			endTime = (dateUtil.format(data.use_end_time * 1000, "Y/M/D H:F")).slice(2);
		let txt = '';
		/*if (data.coupon_type) {//平台券、自营券
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
		 } else {//平台券
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
		 } else {//店铺券
		 txt = '指定商品适用';
		 }
		 if (data.rules && data.rules.limit_item_ids) {
		 txt += "，特殊商品除外";
		 }*/
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
		return (
			<div className="each-coupon c-pr">
				<div
					className={(type === 1) ? (data.isset_limit_money ? "coupon-bg" : "coupon-bg coupon-bg2") : "coupon-bg coupon-bg3"}>
					<div className="coupon-left c-fl">
						<h2 className={(type === 1) ? (data.isset_limit_money ? "c-cdred" : "c-cdyellow") : "c-c999"}>
							¥ <span className={String(parseInt(data.deduct_money)).length < 4 ? " price-a " : " price-b "} style={{lineHeight: '46px'}}>
								{data.coupon_type === 4 ? this.getPrice(data.price) :parseInt(data.deduct_money)}
							</span>
						</h2>
						<p className="c-c999">
							{data.coupon_type === 4 ?('原价'+data.market_price):('满'+(data.limit_money ? parseFloat(data.limit_money) : '')+'使用')}
						</p>
					</div>
					<div className={data.isset_limit_money ? "coupon-right c-fl" : "coupon-right c-fl coupon-right2"}>
						<p className="c-c999">
							<span className="c-fs16 c-c35">
								{data.coupon_type === 4 ? "免单券" : (data.coupon_type === 0 ? "店铺券" : (data.coupon_type === 1 ? (data.used_shop_type === "self" ? "自营券" : "跨店券") : "平台券"))}
							</span>
							{data.used_platform === "all" ? '' : (' (限' + data.used_platform + '端使用)')}
						</p>
						<li className="c-c999 c-pr title-txt">
							{txt}
							<span className="c-pa disc-dot"></span>
						</li>
						<p className="c-fs10 c-c999 c-fs10" style={{
							lineHeight: '14px',
							display: 'block',
							paddingTop: '12px'
						}}>{startTime}至{endTime}</p>
						
					</div>
				</div>
				{(type === 1) ?
					(data.time_status ?
						<button onClick={this.noUse}
										className={(type === 1) ? (data.isset_limit_money ? "use-coupon" : "use-coupon use-coupon2") : "use-coupon use-coupon3"}>
							</button>
						: <LinkOrA
							link={data.coupon_type === 4 ? (RNDomain + '/item?item_id='+data.item_id) : (data.coupon_type === 1 ? '/searchResult?coupon_id=' + data.coupon_id : (data.shop_attr === "biz" ? '/searchResult?coupon_id=' + data.coupon_id + '&type=biz' : '/searchResult?coupon_id=' + data.coupon_id)) }
							type="link">
							<button
								className={(type === 1) ? (data.isset_limit_money ? "use-coupon" : "use-coupon use-coupon2") : "use-coupon use-coupon3"}>
								
							</button>
						</LinkOrA>)
					: ''}
			</div>
		)
	}
}