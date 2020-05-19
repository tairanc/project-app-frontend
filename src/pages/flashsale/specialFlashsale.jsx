import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Link} from 'react-router';
import 'src/scss/specialFlashsale.scss';
import {LoadingRound, ShareAndTotop, ReactIscroll, Scroll} from 'component/common';
import {tip} from 'component/module/popup/tip/tip';
import echo from 'plugin/echo';
import {RNDomain, MALLAPI} from 'src/config/index'
import axios from 'js/util/axios';
import {addImageSuffix} from "src/js/util/index"

let _localTime, status, loadTimes = 0; //loadTimes加载次数
const smallImgSuffix = '_t.jpg'

let pageApi = {
    specialFlashsale: {
        url: `${MALLAPI}/promotion/getSpecialFlashSaleItem`,
        method: "get"
    },
    DelFav: {
        url: `${MALLAPI}/user/removeItemCollection`,
        method: "get"
    },
    //收藏
    Fav: {
        url: `${MALLAPI}/user/saveItemCollection`,
        method: "post"
    }
};

let Type = {
	"past": {timeText: "已结束", countDown: false},
	"present": {timeText: "离本场结束", countDown: true, countField: "end_time"},
	"future": {timeText: "离本场开始", countDown: true, countField: "start_time"}
}

function parse(n) {
	n = n | 0;
	return n >= 10 ? n : "0" + n
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
			return <a href={to} className={className}>{this.props.children}</a>
		} else {
			return <a href={to} className={className}>{this.props.children}</a>
		}
	}
}

export default class SpecialFlashsale extends Component {
	constructor(props) {
		super(props);
		this.state = {
			update: false,
			data: null
		}
	}

	componentWillMount() {
		document.title = "品牌专场特卖";
		this.context.isApp && (window.location.href = "jsbridge://set_title?title=品牌专场特卖");
		let promotion_id = getURLParameter("promotion_id");
        axios.request({
            ...pageApi.specialFlashsale, params: {
                promotion_id: promotion_id,
                page: 1,
            }
        }).then(
            result => {
                _localTime = +new Date();
                loadTimes++;
                this.setState({
                    update: true,
                    data: result.data.data
                });
            }
        ).catch(error => {
            console.log(error);
            tip.show({msg: error.response && error.response.data.message || '服务器繁忙'})
        })
	}

	componentDidUpdate() {
		//组件每次更新时都进行一次懒加载初始化
		echo.init({ offset: $(window).height(), throttle: 1000 });
	}

	render() {
		return (
			this.state.update ?
				this.state.data ?
					<div data-page="special-flashsale">
						<Banner data={this.state.data}/>
						<BrandContentList data={this.state.data}/>
					</div>
					:
					<NoCommodity />
				:
				<LoadingRound />
		)
	}
}


//没有品牌专场特卖商品
class NoCommodity extends Component {
	render() {
		return (
			<img className="no_commodity" src="/src/img/specialFlashsale/noCommodity.png"/>
		);
	}
}

//头部
class Banner extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: ""
		}
	}

	componentWillMount() {
		let {data} = this.props;
		let intervalTime = Math.floor((+new Date() - _localTime) / 1000); //组件加载的间隔时间
		let now = (+new Date(data.now.replace(/-/g,'/'))) + intervalTime;
		if (now > (+new Date(data.promotion.end_time.replace(/-/g,'/')))) {
			status = 0;  //past
		} else if (now > (+new Date(data.promotion.start_time.replace(/-/g,'/')))) {
			status = 1;  //present
		} else {
			status = 2;  //future
		}
		let type = status < 2 ? (status ? "present" : "past") : "future";
		this.setState({
			type: type
		});
	}

	render() {
		let {data} = this.props;
		let specialflashsale_image = (data.promotion ? (data.promotion.arguments? data.promotion.arguments.special_flash_sale_image:""):"")
		return (
			<div className="brand c-pr">
				<img src={specialflashsale_image}/> {/*专场特卖广告图*/}
                <SpecialFlashTimeInfo data={data} nowTime={+new Date(data.now.replace(/-/g,'/'))} type={this.state.type}/>
			</div>
		);
	}
}

//倒计时
class SpecialFlashTimeInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		this.initState();
	}

	componentDidMount() {
		this.initState();
	}

	componentWillUnmount() {
		window.clearTimeout(this.timer);
		this.timer = null;
	}

	initState() {
		let {data, type, nowTime} = this.props;
		let intervalTime = Math.floor((+new Date() - _localTime) / 1000); //组件加载的间隔时间
		let count = null;

		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		if (Type[type].countDown) {
			const {promotion} = data
			const { start_time, end_time } = promotion
			if(type === 'present') {
                count = +new Date(end_time.replace(/-/g,'/')) - nowTime - intervalTime;
			}
			if(type === 'future') {
                count = +new Date(start_time.replace(/-/g,'/')) - nowTime - intervalTime;
			}
			this.timeHandler();
		}
		this.setState({
			count: count / 1000
		});
	}

	getTimeInfo() {
		return Type[this.props.type].timeText;
	}

	timeHandler() { //倒计时器，延时1秒执行，此时setState已经执行
		this.timer = setTimeout(() => {
			let count = this.state.count - 1;
			if (count == 0) {
				location.reload();
			} else {
				this.setState({
					count
				});
				this.timeHandler();
			}
		}, 1000);
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

//品牌专场特卖商品列表
class BrandContentList extends Component {
	constructor(props) {
		super(props);
		this.getData = this.getData.bind(this);
	}

	componentWillMount() {
		this.initState();
	}

	initState() {
		this.state = {
			data: this.props.data.items,
			nowState: "LOAD"
		}
		this._page = 2;
		this.setState(this.state);
	}

	initList() {
		let {data} = this.props;
		let ret = [];
		data && data.items.forEach((val, i) => {
			ret.push(<EachCommodity data={val} key={i}/>);
		})
		return ret;
	}

	getData = (scroll) => {
		delete this.state.nowState;
		if (loadTimes > 1) {
			let self = this;
			self.ajax && self.ajax.abort()
            let promotion_id = getURLParameter("promotion_id");
            axios.request({
                ...pageApi.specialFlashsale, params: {
                    promotion_id: promotion_id,
                    page: self._page++
                }
            }).then(
                result => {
                    if (!result.data.data || result.data.data.items.length < 10) {
                        scroll.stateNodata();
                    } else {
                        scroll.stateRefresh();
                    }
                    if (result.data.data) {
                        self.state.data.push(...res.data.data.items);
                        self.setState(self.state);
                    }
                    scroll.unLocked();
                }
            ).catch(error => {
                console.log(error);
                tip.show({msg: error.response && error.response.data.message || '服务器繁忙'})
            })
		}
		if (loadTimes === 1) {
			if (this.props.data.items.length < 10) {
				scroll.stateNodata();
			}
			scroll.unLocked();
		}
		loadTimes++;
	}

	render() {
		let {data} = this.props;
		return (
			<Scroll getData={this.getData} nowState={this.state.nowState}>
				<ul> {this.initList()} </ul>
			</Scroll>
		);
	}
}


//每一件品牌专场特卖商品详情
class EachCommodity extends Component {
	componentWillMount() {
		this.state = {
			collect: this.props.data.is_fav
		}
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
			return "trmall://open_link_in_new_window?url=" + window.btoa(url);
		} else {
			return url;
		}
	}

	onCollect() {
		let self = this;
		if (!this.context.isLogin && this.context.isApp) {
			location.href = "trmall://to_login";
			return
		}

		let _url = this.state.collect ? "DelFav" : "Fav"
        axios.request({
            ...pageApi[_url], params: {
                item_id: this.props.data.id
            }
        }).then(
            result => {
                self.setState({
                    collect: !self.state.collect
                })
            }
        ).catch(error => {
            tip.show({msg: error.response && error.response.data.message || '服务器繁忙'})
        })
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
		let {real_store, price, sell_price} = data;
		let type = this.context.isApp ? "app" : "pc";
		return (
			<li className="infor_wrap">
				<div className="infor_l c-fl">
					<AppOrPc to={this.urlHandle(RNDomain+"/item?item_id=" + data.id, type)} type={type}>
						<img className="primary-image" data-echo={ addImageSuffix(data.primary_image,'_t') ||"/src/img/search/no-goods-image.png"} src="/src/img/icon/loading/default-watermark.png" />
						{ (!real_store && status == 1) ? <div className="sale_statue c-tc">还有机会</div> : null  }
					</AppOrPc>
				</div>
				<div className="infor_r">
					<AppOrPc to={this.urlHandle(RNDomain+"/item?item_id=" + data.id, type)} className="infor_tit" type={type}>
						{data.title}
					</AppOrPc>

					<div className="favour">
                        <span className={`full_discount ${(data.tag&&data.tag.length) ? '' : 'c-dpno'}`}>
                            {
								data.tag.map(function(item,index){
									return <span key={index}>{item}</span>
								})
							} {/*满减标志*/}
                        </span>
						{  status < 2 ?
							(status ?
									<div className={`last_num c-tc ${(real_store > 0 && real_store < 11) ? '' : 'c-dpno'}`}>
										仅剩{real_store}件
									</div>
									:
									<span className="prompt">仍有优惠~</span>
							)
							:
							<span className="prompt">限量{data.store}件</span>
						}
					</div>

					<div className="detail_footer c-pr">
						<div className="price_area c-fl c-pr">
                            <span className={`promotion_price c-dpb ${sell_price ? '' : 'c-pt10'}`}>
                                <span className="money_icon">¥</span>{/*促销价.toFixed(2)*/}
															{this.priceIsInt(price) ?
																<span>
                                        {price}
                                    </span>
																:
																<span>
                                        {Math.floor(price)}
																	<span className="price_decimal">
                                            .{this.decimalPrice(price)}
                                        </span>
                                    </span>
															}
                            </span>
							<span className="market_price c-dpb c-cc9" style={sell_price ? {} : {display: "none"}}>
                                ¥ {sell_price}{/*市场价*/}
                            </span>
						</div>

						<div className="buyoradd_btn c-fr">
							{status < 2 ?
								<span className={`c-tc c-fr ${status == 0 || !real_store ? 'toseeit' : 'rightnow'}`}>
                                    <AppOrPc to={this.urlHandle(RNDomain+"/item?item_id=" + data.id, type)} type={type}>
                                        {status === 0 || !real_store ? "去看看" : "马上抢"}
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
			</li>
		);
	}
}
