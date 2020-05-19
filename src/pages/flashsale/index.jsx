import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Link} from 'react-router';
import 'src/scss/flashsale.scss';
import {createAction} from 'filters/index';
import {LoadingRound, ShareAndTotop, ReactIscroll, Scroll} from 'component/common';

let Action = createAction({
	//特卖首页
	flashSale: {
		url: "/newapi/promotion/flash_sale",
		type: "get"
	},
	banner: {
		url: "/newapi/promotion/flash_sale/banner",
		type: "get",
	},
	//特卖商品接口
	itemList: {
		url: "/newapi/promotion/flash_sale/item",
		type: "get"
	},
	DelFav: {
		url: "/newapi/user/collection/remove",
		type: "get"
	},
	//收藏
	Fav: {
		url: "/newapi/user/collection/add",
		type: "post"
	}
}, true);

let Type = {
	"past": {navText: "已结束", timeText: "已结束", countDown: false},
	"present": {navText: "抢购中", timeText: "离本场结束", countDown: true, countField: "end_time"},
	"future": {navText: "即将开始", timeText: "离本场开始", countDown: true, countField: "start_time"}
}

let _localTime;

function parse(n) {
	n = n | 0;
	return n >= 10 ? n : "0" + n
}

export default class Flashsale extends Component {

	constructor(props) {
		super(props);
		this.state = {
			update: false,
			data: null,
			banner: []
		}
	}

	static contextTypes = {
		isApp: React.PropTypes.bool
	}

	componentWillMount() {
		document.title = '限时特卖';
		this.context.isApp && (location.href = "jsbridge://set_title?title=限时特卖");
		function pajax(option) {
			let promise = new Promise((resolve) => {
				option.success = (res) => {
					resolve(res)
				};
				$.ajax(option)
			});
			return promise
		}

		Promise.all([
			pajax(Action("flashSale")),
			pajax(Action("banner"))
		]).then((res) => {
			_localTime = +new Date();
			this.setState({
				update: true,
				data: res[0].data,
				banner: res[1].data
			});
		});
		const {store} = this.context;
	}

	componentDidMount() {
		let self = this;
		$(window).bind('scroll.fixed', function () {
			let $this = $(this);
			let scrollH = $(this).scrollTop();
			let bannerH = $(".flash-banner").height();
			if (scrollH >= bannerH) {
				$(".nav-container").addClass("nav-fixed");
				$(".sale_ul").css({paddingTop: "70px"})
			} else {
				$(".nav-container").removeClass("nav-fixed");
				$(".sale_ul").css({paddingTop: 0})
			}
		})
	}

	componentWillUnmount() {
		$(window).unbind('scroll.fixed')
	}

	render() {
		return (
			this.state.update ?
				this.state.data ?
					<FlashSaleContent data={this.state.data} banner={this.state.banner}/> : <EmptyPage /> : <LoadingRound />
		)
	}
}

class EmptyPage extends Component {
	render() {
		return (
			<div data-page="flashsale-page">
				<div className="nopublish-body c-tc">
					<img className="main-img" src="/src/img/flashsale/sale-nopublish1-icon.png"/>
					<div className="no-pub-h">
						敬请期待
					</div>
					<img className="img-icon" src="/src/img/flashsale/sale-nopublish2-icon.png"/>
					<div className="no-pub-con">
						特卖商品正在发布中
					</div>
				</div>
			</div>
		)
	}
}

class FlashSaleContent extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentWillMount() {
		this.onChangeActive();
	}

	onChangeActive = (obj) => {
		let data = this.props.data,
			len;

		if (!obj) {
			if (data.present && (len = data.present.length)) { //正在进行的特卖活动数组
				obj = data.present[len - 1];  //取最后一个
			} else if (data.future && data.future.length) { //即将开始的特卖活动数组
				obj = data.future[0];  //obj = data.present[0];   //取第一个
			} else if (data.past && (len = data.past.length)) {
				obj = data.past[len - 1]
			}
		}
		if (obj !== this.state.active) {
			this.setState({
				active: obj   //active:被激活的活动时间列表
			})
		}
	}

	render() {
		let {data} = this.props;
		return (
			<div data-page="flashsale-page">
				{this.props.banner ? <BannerSlide data={ this.props.banner }/> : ""}
				<FlashNavs data={this.props.data} active={this.state.active} onChangeActive={this.onChangeActive}
									 nowTime={this.props.data.now}/>
				<FlashContents initData={data.items} active={this.state.active} nowTime={data.now}/>
			</div>
		)
	}
}

//banner
class BannerSlide extends Component {
	componentDidMount() {
		let self = this;
		let {data} = this.props;
		if (data.length > 1) {
			this.swiper = new Swiper(this.refs.swiperBanner, {
				autoplay: 3000,
				autoplayDisableOnInteraction: false,
				pagination: '.swiper-pagination',
				paginationType: 'fraction',
				loop: true,
			});
		}

	}

	getHtml() {
		return this.props.data && this.props.data.map((item, i) => {
				return <a className="swiper-slide" href={item.wap.link_target || "javascript:void(0)"} key={i}>
					<img src={item.wap.img_link}/>
				</a>
			});
	}

	render() {
		let {data} = this.props, style;
		data.length > 1 ? style = {display: "block"} : style = {display: "none"};
		return (
			<div data-plugin="swiper" className="flash-banner">
				<div className="swiper-container" ref="swiperBanner">
					<div className="swiper-wrapper">
						{this.getHtml()}
					</div>
					<div className="swiper-pagination" style={style}></div>
				</div>
			</div>
		)
	}
}

class FlashNavs extends Component {
	constructor(props) {
		super(props);
		this.initData()
	}

	//初始化时间列表数据,添加type属性(past、present、future)
	initData() {
		let {data} = this.props;
		let keys = Object.keys(Type);
		this._data = [];

		keys.forEach((val, i) => {
			if (data[val]) {
				data[val].forEach((vals, key) => vals.type = val);  //每一条数据添加type属性
				this._data.push(...data[val]); //_data只包含present,past,future数据
			}
		})
	}

	componentDidMount() {
		let aIn = $(".active").prop("className").split(" ");
		let mySwiperNav = new Swiper(this.refs.navCon, {
			slidesPerView: 'auto',
			initialSlide: aIn[aIn.length - 1],
			onTap: function () {
				if (mySwiperNav.clickedIndex >= 1) {
					mySwiperNav.slideTo(mySwiperNav.clickedIndex - 1);
				}
			}
		});
		/*let myScroll = new IScroll(this.refs.nav, {scrollX: true, scrollY: false, mouseWheel: true});
		 let windowWidth = $(window).width(),
		 $navWrap = $(this.refs.nav),
		 lenLi = $navWrap.find("li").length,
		 liW = $navWrap.find("li").width(),
		 $activeLi = $navWrap.find("li.active"),
		 activeLioffsetLeft = $activeLi.offset().left;
		 if (windowWidth - liW < activeLioffsetLeft) {
		 myScroll.scrollTo(-(activeLioffsetLeft + ( liW - windowWidth ) / 2), 0, 800);
		 }*/
	}

	initList() {
		let ret = [];
		this._data.forEach((val, i) => {
			ret.push(
				<FlashNav data={val} key={i} className={val == this.props.active ? `active ${i}` : ""}
									onChangeActive={() => this.props.onChangeActive(val)}/>
			);
		});
		return ret;
	}

	render() {
		return (
			<div data-plugin="swiper" className="nav-container">
				<FlashTimeInfo active={this.props.active} nowTime={this.props.nowTime}/>
				<div className="nav_bar" ref="nav">
					<div id="nav-con" className="swiper-container" ref="navCon">
						<ul className="nav_bar_ul swiper-wrapper">
							{this.initList()}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

//已结束、抢购中，即将开始一栏
class FlashNav extends Component {
	getTime() {
		let d = new Date(this.props.data.start_time * 1000);
		return parse(d.getHours()) + ":" + parse(d.getMinutes());
	}

	getType() {
		let {type} = this.props.data;
		return Type[type].navText
	}

	render() {
		return (
			<li className={`swiper-slide ${this.props.className}`} onClick={() => this.props.onChangeActive()}>
				<div className="start-time">{this.getTime()}</div>
				<div className="text_tip">{this.getType()}</div>
			</li>)
	}
}

//倒计时
class FlashTimeInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillReceiveProps(nextProps) {
		this.initState(nextProps)
	}

	componentDidMount() {
		this.initState()
	}

	componentWillUnmount() {
		window.clearTimeout(this.timer);
		this.timer = null
	}

	initState(nextProps) {
		let {active} = nextProps || this.props;
		let count = null;
		let intervalTime = Math.floor((new Date() - _localTime) / 1000);
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		if (Type[active.type].countDown) {
			count = active[Type[active.type].countField] - this.props.nowTime - intervalTime;
			this.timeHandler();
		}
		this.setState({
			count: count
		});
	}

	getTimeInfo() {
		let {active} = this.props;
		return Type[active.type].timeText;
	}

	timeHandler() { //倒计时器
		this.timer = setTimeout(() => {
			let count = this.state.count - 1;
			if (count == 0) {
				location.reload()
			} else {
				this.setState({
					count
				});
				this.timeHandler();
			}
		}, 1000)
	}

	getTimeCount() {
		let count = this.state.count > 0 ? this.state.count : 0;

		if (count) {
			let t = parse(count / 3600);
			let s = parse(count / 60 % 60);
			let m = parse(count % 60);
			return t + " : " + s + " : " + m;
		}
		return null;
	}

	render() {
		let timeInfo = this.getTimeInfo(),
			futureItems = (timeInfo === "离本场结束");
		return (
			<div className={`c-tc timelast ${ futureItems ? 'timeEndLast' : 'timeStartLast'}`}>
				{this.getTimeInfo()}
				<span className="time">
                    {this.getTimeCount()}
                </span>
			</div>
		);
	}
}

class FlashContents extends Component {
	constructor(props) {
		super(props);
		this.getData = this.getData.bind(this);
	}

	initState() {
		this.state = {
			data: [], //打开专场的默认页面不需要再次用getData请求数据
			update: true,
			nowState: "INIT"
		}
		this._page = 1;
		this.setState(this.state);
	}

	getData = (scroll) => {
		let self = this;
		let totalPageNum = 0;
		delete this.state.nowState;
		self.ajax && self.ajax.abort()
		self.ajax = $.ajax(Action('itemList', {
			data: {
				promotion_id: this.props.active["promotion_id"],
				page: this._page++     //pageSize默认10个一页
			},
			success: (res) => {
				self.state.update = false;
				if (res.data) {
					let {total_count} = res.data;
					totalPageNum = total_count % 10 ? Math.floor(total_count / 10) + 1 : total_count / 10;
					self.state.data.push(...res.data.items);
					self.setState(self.state);
				}
				if (!res.data || this._page - 1 >= totalPageNum) {
					scroll.stateNodata();
				} else {
					scroll.stateRefresh();
				}
				scroll.unLocked();
			},
			error: () => {
			}
		}));

	}

	componentWillMount() {
		this.initState();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.active !== this.props.active) {
			this.initState();
		}
	}

	render() {
		return (
			this.state.data ?
				<div className="tab_wrap">
					<Scroll getData={this.getData} onRefresh={this.onRefresh} nowState={this.state.nowState}>
						<FlashContentLists data={this.state.data} nowTime={this.props.nowTime}/>
					</Scroll>
				</div>
				:
				<NoCommodity />
		);
	}
}

//没有特卖单品
class NoCommodity extends Component {
	render() {
		return (
			<img className="no_commodity" src="/src/img/specialFlashsale/noCommodity.png"/>
		);
	}
}

class FlashContentLists extends Component {
	getListHtml() {
		let ret = [];
		this.props.data && this.props.data.forEach((val, i) => {
			ret.push(<FlashContentList data={val} key={i} nowTime={this.props.nowTime}/>);
		});
		return ret;
	}

	render() {
		return (
			<div className="sale_ul floor-bd">
				<ul>
					{this.getListHtml()}
				</ul>
			</div>
		);
	}
}

function getURLParameter(name) {
	let parameterStr = window.location.search.replace(/^\?/, ''),
		reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
		value = parameterStr.match(reg);
	return value ? value[2] : null;
}

//判断是Link还是A标签
class AppOrPc extends Component {
	render() {
		const {to, type, className} = this.props;

		if (type === "pc") {
			return <Link to={to} className={className}>{this.props.children}</Link>
		} else {
			return <a href={to} className={className}>{this.props.children}</a>
		}
	}
}

class FlashContentList extends Component {
	constructor(props) {
		super(props);
		this.channel = getURLParameter("channel");
	}

	getStatus() {
		let {data} = this.props;
		let intervalTime = Math.floor((new Date() - _localTime) / 1000);
		let now = this.props.nowTime + intervalTime;
		let ret;
		if (now > data.end_time) {
			ret = 0;  //past
		} else if (now > data.start_time) {
			ret = 1;  //present
		} else {
			ret = 2;  //future
		}
		return ret;
	}

	static contextTypes = {
		isApp: React.PropTypes.bool,
		isLogin: React.PropTypes.bool
	};

	urlHandle = (url, type) => {
		if (this.channel) {
			let reg_schem = /^t/;
			let reg_channel = /channel/;
			if (url && !reg_schem.test(url) && !reg_channel.test(url)) {
				let reg_requrey = /\?/;
				url = url + (reg_requrey.test(url) ? "&" : "?" ) + "channel=" + this.channel;
			}
		}
		if (type === "app") {
			return "jsbridge://open_link_in_new_window?url=" + window.btoa(window.location.protocol + "//" + window.location.host + url);
		} else {
			return url;
		}
	}

	componentWillMount() {
		this.state = {
			collect: this.props.data.is_faved
		}
	}

	onCollect() {
		let self = this;

		if (!this.context.isLogin && this.context.isApp) {
			location.href = "trmall://to_login";
			return
		}
		let action = Action(this.state.collect ? "DelFav" : "Fav", {
			data: {
				item_id: this.props.data.item_id
			},
			success(data) {
				if (data.success) {
					self.setState({
						collect: !self.state.collect
					})
				}
			}
		});
		$.ajax(action);
	}

	//价格是否为整数
	priceIsInt(price) {
		if (Math.floor(price) === price) {
			return true;
		} else {
			return false;
		}
	}

	//获取小数
	decimalPrice(price) {
		return price.toString().split(".")[1];
	}

	render() {
		let {collect} = this.state;
		let {data} = this.props;
		let {real_store, promotion_price, market_price, show_type} = data;
		let status = this.getStatus();
		let type = this.context.isApp ? "app" : "pc";
		let tags = data.promotion_tags && data.promotion_tags.map(function (item, i) {
				return <span key={i} className={`full_discount ${item.promotion_tag ? '' : 'c-dpno'}`}>
                            {item.promotion_tag} {/*满减标志*/}
                        </span>
			});
		return (
			<li>
				{ //判断是单品特卖还是专场特卖
					show_type == "flashsale" ?
						<div className="infor_wrap">
							<div className="infor_l c-fl">
								<AppOrPc to={this.urlHandle("/item?item_id=" + data.item_id, type)} type={type}>
									<img src={data.primary_image}/>
									{ (!real_store && status == 1) ? <div className="sale_statue c-tc">还有机会</div> : null }
								</AppOrPc>
							</div>
							<div className="infor_r">
								<AppOrPc to={this.urlHandle("/item?item_id=" + data.item_id, type)} className="infor_tit" type={type}>
									{data.title}
								</AppOrPc>

								<div className="favour">
									{tags}
									{  status < 2 ?
										(status ?
												<div className={`last_num c-tc ${(real_store > 0 && real_store < 11) ? '' : 'c-dpno'}`}>
													仅剩{data.real_store}件
												</div>
												:
												<span className="prompt">仍有优惠~</span>
										)
										:
										<span className="prompt">限量{data.promotion_store}件</span>
									}
								</div>

								<div className="detail_footer c-pr">
									<div className="price_area c-fl c-pr">
                                <span className={`promotion_price c-dpb ${market_price ? '' : 'c-pt10'}`}>
                                    <span className="money_icon">¥</span>{/*促销价.toFixed(2)*/}
																	{this.priceIsInt(promotion_price) ?
																		<span>
                                            {promotion_price}
                                        </span>
																		:
																		<span>
                                            {Math.floor(promotion_price)}
																			<span className="price_decimal">
                                                .{this.decimalPrice(promotion_price)}
                                            </span>
                                        </span>
																	}
                                </span>
										<span className="market_price c-dpb c-cc9" style={market_price ? {} : {display: "none"}}>
                                    ¥ {market_price} {/*市场价*/}
                                </span>
									</div>

									<div className="buyoradd_btn c-fr">
										{status < 2 ?
											<span className={`c-tc c-fr ${status == 0 || !real_store ? 'toseeit' : 'rightnow'}`}>
                                        <AppOrPc to={this.urlHandle("/item?item_id=" + data.item_id, type)} type={type}>
                                            {status == 0 || !real_store ? "去看看" : "马上抢"}
                                        </AppOrPc>
                                    </span>
											:
											<span className={`c-tc c-fr ${ collect ? 'collected' : 'ahead_time' }`}
														onClick={() => this.onCollect()}>
                                        {collect ? "已收藏" : "抢先收藏"}
                                    </span>
										}
									</div>
								</div>
							</div>
						</div>
						:
						<SpecialFlashsaleList data={data}/>
				}
			</li>
		)
	}
}

//专场特卖商品入口
class SpecialFlashsaleList extends Component {
	getImgList() {
		let ret = [];
		let {data} = this.props;
		let {items} = data;
		if (data && data.items) {
			data && data.items.forEach((val, i) => {
				ret.push(
					<li className="c-dpib c-pr" key={i}>
						<img src={val.primary_image}/>
						<div className="sp_price_area c-pr c-tc">
                            <span className="sp_promotion_price">
                                ¥{val.promotion_price}
                            </span>
						</div>
					</li>
				);
			});
			return ret;
		}
	}

	render() {
		let {data} = this.props;
		let url = `/specialFlashsale?promotion_id=${data.promotion_id}`;
		return (
			data ?
				<AppOrPc to={url}>
					<div className="specialBrand c-pr c-tc">
						<div className="corner_icon c-pa c-tc">品牌特卖</div>

						<div className="title_area">
							<span className="main_title">{data.specialflashsale_title}</span>
							<div className="subtitle_area c-pr">
								<span className="subtitle">{data.specialflashsale_subtitle}</span>
								<img src="/src/img/specialFlashsale/arrow_right.png"/>
							</div>
						</div>

						<ul>
							{ this.getImgList() }
						</ul>
					</div>
				</AppOrPc>
				:
				""
		);
	}
}

