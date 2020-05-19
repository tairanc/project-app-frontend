import React, {Component} from 'react';
import {LoadingRound, ShareConfig, Shady} from 'component/common';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {tip} from 'component/module/popup/tip/tip';
import axios from 'axios';
import {MALLAPI, ZXURL} from 'config/index'
import {base64encode, utf16to8} from "src/js/util/index"
import {browser} from 'js/common/utils';
import {getCookie, setCookie} from 'js/common/cookie';
import {RHOST} from "../../../js/util/index"
import './index.scss';
//接口请求
const pageApi = {
	getDrawRecordList: {
		url: `${MALLAPI}/draw/getDrawRecordList`,
		method: "get",
		headers: {"Cache-Control": "no-cache"}
	}, //获取最新的奖池记录
	getUserTask: {url: `${MALLAPI}/draw/getUserTask`, method: "get", headers: {"Cache-Control": "no-cache"}}, //获取用户任务参与情况接口
	getActivityData: {url: `${MALLAPI}/draw/getActivityData`, method: "get", headers: {"Cache-Control": "no-cache"}}, //获取活动详情接口
	getUserDrawNum: {url: `${MALLAPI}/draw/getUserDrawNum`, method: "get", headers: {"Cache-Control": "no-cache"}}, //获取剩余抽奖次数
	getMyPrizeRecord: {url: `${MALLAPI}/draw/getMyPrizeRecord`, method: "get", headers: {"Cache-Control": "no-cache"}}, //获取当前用户的中奖记录
	getDrawResult: {url: `${MALLAPI}/draw/draw`, method: "post", headers: {"Cache-Control": "no-cache"}}, //抽奖处理接口
	shareTask: {url: `${MALLAPI}/draw/shareTask`, method: "post", headers: {"Cache-Control": "no-cache"}}, //分享任务回调接口
};

const mainUrl = window.location.protocol + "//www.tairanmall.com/wap/activities/tairan110.html";
const loginUrl = `trmall://to_login?redirectUri=${encodeURIComponent(window.location.href)}`;

export default class LuckyDraw extends Component {
	constructor(props) {
		super(props);
		this.state = {
			update: false,
			ruleModal: false,
			winModal: false,
			drawRecordList: "",
			userDrawNum: 0,
			myPrizeRecord: "",
			prizeList: [],
			activityData: "",
			userTask: "",
			drawResult: "",
			enableClick: true,
			leadShare: false,
			successFlag: false,
			timeout: false,
			isSending: false
		}
	}

	static contextTypes = {
		isApp: React.PropTypes.bool,
		isLogin: React.PropTypes.bool
	};

	backReload = () => {
		window.addEventListener("popstate", function (e) {
			self.location.reload();
		}, false);
		var state = {
			title: "",
			url: "#"
		};
		window.history.replaceState(state, "", "#");
	};

	componentWillMount() {
		this.backReload();
		const {activity_id} = this.props.location.query;
		const self = this;
		if (!activity_id) {
			browserHistory.push("/");
		}
		this.getDrawData("getActivityData", activity_id);
		setTimeout(function () {  //延时加载
			self.getDrawData("getDrawRecordList", activity_id);
			oneTimer();
		});
		this.getDrawData("getUserDrawNum", activity_id);
		let oneTimer = () => {
			this.timer = setInterval(() => {
				this.getDrawData("getDrawRecordList", activity_id);
			}, 60000)
		};
	}

	componentDidMount() {
		const {android, iPhone} = browser.versions;
		const {activity_id} = this.props.location.query;
		this.getDrawData("getMyPrizeRecord", activity_id, 1);
		this.getDrawData("getUserTask", activity_id);

		//分享成功回调方法（由安卓原生调用）
		window.shareSuccess = () => {
			// 用户确认分享后执行的回调函数
			// if (android || ((iPhone && parseInt(getCookie("version").replace(/\./g, "")) >= 2200))) this.getDrawData("shareTask", activity_id);
		};

		//原生页面返回不刷新问题解决  (由原生去调用)
		window.onResume = () => {
			location.reload();
		};
		window.onPause = () => {
		}
	}

	componentWillUnmount() {
		$("body").css({overflow: "", position: ""});
		this.oneTimer = null;
	}

	getDrawResult = (activity_id, goKinerLottery) => {
		axios.request({
			...pageApi.getDrawResult, params: {
				activity_id: activity_id,
			}, timeout: 1000 * 10
		}).then(({data}) => {
				function random() {
					switch ($(`.${data.data.prize_id}`)[0].id) {
						case "0":
							return Math.floor(Math.random() * 30 + 210);
						case "1":
							return Math.floor(Math.random() * 30 + 255);
						case "2":
							return Math.floor(Math.random() * 30 + 300);
						case "3":
							return Math.floor(Math.random() * 30 + 345);
						case "4":
							return Math.floor(Math.random() * 30 + 30);
						case "5":
							return Math.floor(Math.random() * 30 + 75);
						case "6":
							return Math.floor(Math.random() * 30 + 120);
						case "7":
							return Math.floor(Math.random() * 30 + 165);
						default:
							return;
					}

				}

				goKinerLottery.goKinerLottery(random());
				//点击抽奖成功后设置成功标志successFlag
				return this.setState({drawResult: data.data, userDrawNum: data.data.draw_num, successFlag: true});
			}
		).catch(error => {
			console.log(error);
			this.setState({enableClick: true});
			if (!error.response || error.response.status == 504) {  //网络超时
				this.setState({timeout: true})
			} else {  //正常业务报错
				tip.show({msg: error.response.data.message || '服务器繁忙'});
				goKinerLottery.stopKinerLottery(goKinerLottery.defNum);
				this.getDrawData("getUserDrawNum", activity_id);
				if (error.response.data.message === "完成任务可获得额外抽奖机会") {
					$(window).scrollTop($(window).height() * 0.6)
				}
			}
		});
	};

	getDrawData = (requestType, activity_id, page) => {
		const self = this;
		axios.request(requestType === "getDrawRecordList" ? {
			...pageApi.getDrawRecordList, params: {
				activity_id: activity_id,
			}
		} : (requestType === "getUserDrawNum" ? {
			...pageApi.getUserDrawNum, params: {
				activity_id: activity_id,
			}
		} : (requestType === "getMyPrizeRecord" ? {
			...pageApi.getMyPrizeRecord, params: {
				activity_id: activity_id,
				page_size: 12,
				page: page
			}
		} : (requestType === "getActivityData" ? {
			...pageApi.getActivityData, params: {
				activity_id: activity_id,
			}
		} : (requestType === "getUserTask" ? {
			...pageApi.getUserTask, params: {
				activity_id: activity_id,
			}
		} : (requestType === "shareTask" ? {
			...pageApi.shareTask, params: {
				activity_id: activity_id,
			}
		} : "")))))).then(({data}) => {
				switch (requestType) {
					case "getDrawRecordList":
						return this.setState({drawRecordList: data.data.data});
					case "getUserDrawNum":
						return this.setState({userDrawNum: data.data});
					case "getMyPrizeRecord":
						return this.setState({
							myPrizeRecord: data.data,
							prizeList: page === 1 ? data.data.data : self.state.prizeList.concat(data.data.data),
							isSending: false
						});
					case "getActivityData":
						return this.setState({activityData: data.data, update: true});
					case "getUserTask":
						return this.setState({userTask: data.data});
					case "shareTask":
						self.getDrawData("getUserDrawNum", activity_id); //改变次数
						self.getDrawData("getUserTask", activity_id);  //改变任务状态
						return;
					default:
						return;
				}
			}
		).catch(error => {
			console.log(error);
			tip.show({msg: error.response.data.message || '服务器繁忙'})
		});
	};


	handleRuleModal = () => {
		this.setState({ruleModal: !this.state.ruleModal})
	};

	handleCloseWinModal = () => {
		this.setState({winModal: !this.state.winModal})
	};

	//获取分享信息
	shareMsg = () => {
		const self = this;
		const {activityData} = this.state;
		const {iPhone} = browser.versions;
		const {activity_id} = this.props.location.query;
		const config = {
			title: activityData.share_title,
			content: activityData.share_description,
			icon: activityData.share_image,
			link: RHOST + window.location.pathname + window.location.search,
		};
		const params = base64encode(utf16to8(JSON.stringify(config)));
		setTimeout(function () {
			self.getDrawData("shareTask", activity_id);
		}, 1000);
		window.location.href = "trmall://share?params=" + params;
	};

	render() {
		const {update, ruleModal, drawRecordList, userDrawNum, myPrizeRecord, prizeList, activityData, userTask, winModal, enableClick, drawResult, leadShare, successFlag, timeout, isSending} = this.state;
		const {activity_id} = this.props.location.query;
		const context = this.context;
		if (winModal || ruleModal || leadShare) {
			$("body").css({overflow: "hidden", position: "fixed"})
		} else {
			$("body").css({overflow: "", position: ""})
		}
		return (
			update ?
				<div data-page="lucky-draw">
					<div className="top">
						<button className="rule" onClick={this.handleRuleModal}></button>
						{drawRecordList && <DrawRecordList drawRecordList={drawRecordList}/>}
						<img className="activity_time" src="/src/img/activity/20181111/activity_time.png"/>
					</div>
					<DrawTurntable activityData={activityData} getDrawData={this.getDrawData} userDrawNum={userDrawNum}
								   getDrawResult={this.getDrawResult}
								   activity_id={activity_id} enableClick={enableClick} handleEnableClick={(flag) => {
						this.setState({enableClick: flag})
					}} handleWinModalStatus={this.handleCloseWinModal} successFlag={successFlag} timeout={timeout}
								   isLogin={context.isLogin}/>
					{userTask && !(userTask instanceof Array) &&
					<TaskArea userTask={userTask} shareMsg={this.shareMsg} isLogin={context.isLogin}/>}
					{myPrizeRecord &&
					<MyPrizeRecord myPrizeRecord={myPrizeRecord} isLogin={context.isLogin} isSending={isSending}
								   prizeList={prizeList} getDrawData={this.getDrawData} activity_id={activity_id}
								   handleIsSending={(flag) => {
									   this.setState({isSending: flag})
								   }}/>}
					<RuleModal closeRuleModal={this.handleRuleModal} ruleModal={ruleModal} activityData={activityData}/>
					<WinInformationModal winModal={winModal} handleWinModalStatus={this.handleCloseWinModal}
										 drawResult={drawResult}/>
					<a className="dobber-button" href={mainUrl}/>
				</div>
				:
				<LoadingRound />
		)
	}
}

//中奖消息轮播
class DrawRecordList extends Component {
	componentDidMount() {
		this.swiper = new Swiper(this.refs.swiperWinningRadio, {
			loop: true,
			autoplay: {
				delay: 0
			},
			autoplayDisableOnInteraction: false,
			// direction: 'vertical',
			slidesPerView: 1.3,
			loopedSlides: 10,
			speed: 3000
		})
	}

	getHtml = (data) => {
		return data.map((item, i) => {
			return <div className="swiper-slide each-one" key={i}>
				恭喜 {item.tel}&nbsp;&nbsp;&nbsp;&nbsp;抽中了{item.prize_alias}
			</div>
		})
	};

	render() {
		const {drawRecordList} = this.props;
		return drawRecordList && !!drawRecordList.length ? <div className="winning-radio" data-plugin="swiper">
			<img className="ring" src="/src/img/activity/20181111/trumpet.png"/>
			<div className="swiper-container" ref="swiperWinningRadio">
				<div className="swiper-wrapper">
					{this.getHtml(drawRecordList)}
				</div>
			</div>
		</div> : <div className="winning-radio">
			<img className="ring" src="/src/img/activity/20181111/trumpet.png"/>
		</div>
	}
}

//转盘抽奖
class DrawTurntable extends Component {
	componentDidMount() {
		let self = this;
		this.KinerLottery = new KinerLottery({
			rotateNum: 5, //转盘转动圈数
			body: ".draw", //大转盘整体的选择符或zepto对象
			direction: 0, //0为顺时针转动,1为逆时针转动
			disabledHandler: function (key) {
				switch (key) {
					case "noStart":
						window.location.replace(loginUrl);
						break;
					case "completed":
						alert("活动已结束");
						break;
				}
			}, //禁止抽奖时回调
			clickCallback: function () {
				//此处访问接口获取奖品
				if (self.props.enableClick) {
					self.props.handleEnableClick(false);
					self.props.getDrawResult(self.props.activity_id, this);
					if (self.props.userDrawNum) {
						function random() {
							return Math.floor(Math.random() * 30 + 210);
						}

						this.goKinerLottery(random());
					}

				}

			}, //点击抽奖按钮,再次回调中实现访问后台获取抽奖结果,拿到抽奖结果后显示抽奖画面
			KinerLotteryHandler: function (deg) {
				if (self.props.successFlag) { //请求接口成功
					self.props.handleEnableClick(true);
					self.props.handleWinModalStatus();
					self.props.getDrawData("getMyPrizeRecord", self.props.activity_id, 1);
				} else {
					if (self.props.timeout) {
						tip.show({msg: "您的网络丢了，我帮您重新刷一下"});
						setTimeout(function () {
							location.reload();
						}, 2000);
					}
				}
			} //抽奖结束回调
		});
	}

	render() {
		const {activityData, isLogin, userDrawNum} = this.props;
		let prizeHtml = activityData.prize_list && activityData.prize_list.map((item, i) => {
				const optL = Math.sin((360 / 8 * Math.PI / 180 * (i + 1))) * $(window).width() * 54 / 100 / 2 + $(window).width() * 0.79 / 2;
				const optT = Math.cos((360 / 8 * Math.PI / 180 * (i + 1))) * $(window).width() * 54 / 100 / 2 + $(window).width() * 0.765 / 2;
				return <div className={`each-prize  each-prize${i} ${item.id}`} id={i} key={i}
							style={{
								left: optL,
								top: optT,
							}}>

					<div className="img-wraper">
						<img className="prize-img" src={item.prize_image}/>
					</div>
				</div>
			});
		return <div className="draw-area">
			<img src="/src/img/activity/20181111/marquee.gif" className="marquee-bg"/>
			<img src="/src/img/activity/20181111/ball.jpg" className="ball1"/>
			<img src="/src/img/activity/20181111/ball.jpg" className="ball2"/>
			<div className="draw">
				<div className="draw-turntable outer KinerLottery KinerLotteryContent" style={{position: "relative"}}>
					{prizeHtml}
					<img src="/src/img/activity/20181111/turntable.png" className="draw-bg"/>
				</div>
				<img className={`draw-button inner KinerLotteryBtn ${isLogin ? "start" : "no-start"}`}
					 src={`${isLogin ? "/src/img/activity/20181111/draw_click.png" : "/src/img/activity/20181111/login_button.png"}`}/>

				{isLogin ?
					<div className="tip c-fs12 c-cfff c-tc">今天还有<span className="c-cfe8 c-fs15"> {userDrawNum} </span>次机会
					</div> : <div className="tip c-fs13 c-cfff c-tc">登录后可查看抽奖机会</div> }
			</div>
			<div className="draw-bottom">
				<img src="/src/img/activity/20181111/turntable_bottom.png"/>
			</div>
		</div>
	}
}

//做任务区域
class TaskArea extends Component {
	render() {
		const {userTask, shareMsg, isLogin} = this.props;
		const {android} = browser.versions;
		return <div className="task-area">
			<div className="title c-fs14 c-cfff c-tc">做任务可获得额外抽奖机会</div>
			{userTask && <ul className="task-list">
				{!!userTask.share.reward_times && <li>
					<img className="c-fl" src="/src/img/activity/20181111/icon_share.png"/>
					<div className="c-dpib content">
						<p className="c-fb">分享活动
							{userTask.share.finished &&
							<img className="finished c-ml5" src="/src/img/activity/20181111/done.png"/>}
						</p>
						<span>每天分享该活动可抽奖{userTask.share.reward_times}次</span>
					</div>
					<button className="share-button" onClick={isLogin ? shareMsg : () => {
						location.href = loginUrl
					}}>去分享
					</button>
				</li>}
				{!!userTask.shop_cart.reward_times && <li>
					<img className="c-fl" src="/src/img/activity/20181111/icon_cart.png"/>
					<div className="c-dpib content">
						<p className="c-fb">加入购物袋
							{userTask.shop_cart.finished &&
							<img className="finished c-ml5" src="/src/img/activity/20181111/done.png"/>}
						</p>
						<span>将商品加入购物袋可获得{userTask.shop_cart.reward_times}次</span>
					</div>
					<a className="share-button" href={isLogin ? mainUrl : loginUrl}>去逛逛</a>
				</li>}
				{!!userTask.payment.reward_times && <li>
					<img className="c-fl" src="/src/img/activity/20181111/icon_order.png"/>
					<div className="c-dpib content">
						<p className="c-fb">购物订单
							{userTask.payment.finished &&
							<img className="finished c-ml5" src="/src/img/activity/20181111/done.png"/>}
						</p>
						<span>支付完成一笔订单可获得{userTask.payment.reward_times}次</span>
					</div>
					<a className="share-button" href={isLogin ? mainUrl : loginUrl}>去逛逛</a>
				</li>}
				{!!userTask.rate.reward_times && <li>
					<img className="c-fl" src="/src/img/activity/20181111/icon_evaluate.png"/>
					<div className="c-dpib content">
						<p className="c-fb">晒图评价
							{userTask.rate.finished &&
							<img className="finished c-ml5" src="/src/img/activity/20181111/done.png"/>}
						</p>
						<span>评价订单并晒图可获得{userTask.rate.reward_times}次</span>
					</div>
					<a className="share-button"
					   href={isLogin ? "trmall://myOrder?type=0&registLifecircle=true" : loginUrl}>去晒图</a>
				</li>}
			</ul>}
		</div>
	}
}


//我的奖品
class MyPrizeRecord extends Component {

	componentDidMount() {
		const self = this;
		const {activity_id} = this.props;
		$(".myPrize-record-wrapper").bind('scroll.loadmore', function () {
			const {page: {total_page, current_page}} = self.props.myPrizeRecord;
			let $this = $(this);
			let scrollH = $this.scrollTop();
			let scrollHeight = $(".myPrize-record ul").height() - $(".myPrize-record-wrapper").height();
			if (scrollH > scrollHeight) {
				if ($('.add span').html() === "下拉加载更多") {
					self.props.handleIsSending(true);
					self.props.getDrawData("getMyPrizeRecord", activity_id, +current_page + 1)
				}
			}
		})
	}

	render() {
		const {myPrizeRecord, isLogin, isSending, prizeList} = this.props;
		const {page: {total_page, current_page}} = myPrizeRecord;
		return <div className="my-prize">
			<div className="title c-fs14 c-cfff c-tc">我的奖品</div>
			<div className="myPrize-record">
				<div className="myPrize-record-wrapper">
					<ul className="c-clrfix">{/* style={{marginHeight:$(window).height()}}*/}
						{isLogin ? prizeList.length ? prizeList.map((item, i) => {
							return <li className="" key={i} style={i % 2 === 1 ? {float: "right"} : {float: "left"}}>
								<div className="c-tc prize-detail">
									<span className="c-fb gift_title">{item.prize_alias}</span><br/>
									{(item.prize_type === "0" || item.prize_type === "1" || item.prize_type === "2") &&
									<span><span className="sub_title">{item.arguments.use_condition}</span><br/></span>}
									<span className="c-fs10 c-c35">{item.created_at.substr(5)}</span>
								</div>
							</li>
						}) : <div className="no-prize">
							<img src="/src/img/activity/20181111/no_prize.png"/>
							<span className="c-fs14 c-cc9 no-prize-tip">您还没有获得奖品哦</span>
						</div> : <div className="no-prize">
							<a href={loginUrl} className="button">登录查看</a>
							<span className="c-fs14 c-cc9 no-prize-tip c-tc">登录后可以查看您的奖品哦</span>
						</div>}
					</ul>
				{isLogin && !!prizeList.length && <div className="add">
					{current_page != total_page ? (isSending ?
						<span className="loading">加载中...</span> :
						<span style={{height: "30px", lineHeight: "50px"}}>下拉加载更多</span>) : null}
				</div>
				}
				</div>
			</div>
		</div>
	}
}

//规则弹框
class RuleModal extends Component {
	render() {
		const {ruleModal, closeRuleModal, activityData} = this.props;
		return ruleModal ? <div className="rule">
			<Shady clickHandle={closeRuleModal}/>
			<div className="rule-modal">
				<div>
					<div className="rule-content"
						 dangerouslySetInnerHTML={{__html: activityData.activity_rule}}></div>
					<button className="sure-button" onClick={closeRuleModal}></button>
				</div>
				<button className="close" onClick={closeRuleModal}><img
					src="/src/img/activity/20181111/close-button.png"/></button>
			</div>
		</div> : null
	}
}

//中奖信息弹框
class WinInformationModal extends Component {
	render() {
		const {winModal, handleWinModalStatus, drawResult} = this.props;
		const {android} = browser.versions;
		return winModal ? <div className="win">
			<Shady />
			<div className=" modal-bg">
				{$(`.${drawResult.prize_id}`)[0].id === "0" ? <div className="losing-lottery">
					<a className="button button-center" href={mainUrl}></a>
				</div> :
					<div className="win-modal">
						<div className="content">
							<img src={drawResult.prize_image}/>
						</div>
						<p className="title">{drawResult.prize_alias}</p>
						<a className="button button-left" href={mainUrl}> </a>
						<a className="button button-right"
						   href={`trmall://getCouponBag?registLifecircle=true&type=${drawResult.type === "3" ? "redPacket" : "coupon"}`}> </a>
					</div>}
				<button className="close" onClick={handleWinModalStatus}><img
					src="/src/img/activity/20181111/close-button.png"/></button>
			</div>
		</div> : null
	}
}
