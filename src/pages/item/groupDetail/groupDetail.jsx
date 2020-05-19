import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import ReactDOM, {render} from 'react-dom';
import {LinkChange, LoadingRound, OpenInAppGuide, ShareAndTotop} from 'component/common';
import {connect} from 'react-redux';
import {actionAxios, concatPageAndType} from 'js/actions/actions';
import {tip} from 'component/module/popup/tip/tip';
import {addImageSuffix} from "src/js/util/index"
import axios from 'js/util/axios'
import 'src/scss/groupDetail.scss';
import {BuyModal} from "../../itemNew/groupBuy"
import {RHOST} from "../../../js/util/index"
import {RNDomain, MALLAPI} from 'src/config/index'

const pageApi = {
	GroupBuy: {url: `${MALLAPI}/item/groupBuy`, method: "get"},
	Promotion: {url: `${MALLAPI}/item/promotion`, method: "get"},  //促销和规格数据
	Recommend: {url: `${MALLAPI}/groupBuy/recommendItem`, method: "get"}, //推荐
};
const axiosCreator = actionAxios('itemIndex');
const createActions = concatPageAndType('itemIndex');

class GroupDetail extends Component {
	constructor(props, context) {
		super(props);
		let {object_id, user_id} = props.location.query;
		this.state = {
			objectID: object_id,
			userId: user_id,
			update: false,
			openMsg: false,
			recommend: false,
		}
	}

	static contextTypes = {
		isApp: React.PropTypes.bool,
		store: React.PropTypes.object,
		router: React.PropTypes.object
	};

	openOrClose() {
		this.setState({
			openMsg: !this.state.openMsg
		})
	}

	componentWillMount() {
		document.title = '拼团详情';
		this.context.isApp && (window.location.href = 'jsbridge://set_title?title=拼团详情');
		if (!this.state.objectID) {
			browserHistory.push("/");
		}
	};

	componentDidMount() {
		let {objectID} = this.state;
		axios.request({...pageApi.GroupBuy, params: {object_id: objectID}}).then(({data}) => {
			if (data.code === 0) {
				let dataList = data.data;
				this.setState({
					dataList: dataList,//dataList,
					update: true
				});
				if (!this.props.retState.flag) { //flag  为true表示可以通用详情页的数据，不需要重新请求
					this.props.Promotion(data);
				}
				axios.request({
					...pageApi.Recommend,
					params: {
						item_id: data.data.item.id,
					}
				}).then(
					({data}) => {
						if (data.code === 0) {
							this.setState({
								recommendDataList: data,
								recommend: true
							});
						}
					}
				);
			} else {
				tip.show({msg: data.message})
			}
		}).catch(error => {
			console.log(error);
			tip.show({msg: error.response.data.message || '服务器繁忙'});
		});
	}

	openShare() {
		let {pay} = this.props.location.query;
		return !!pay
	}

	componentWillUnmount() {
		this.props.UpdateBuyModal({buyModal: false});
	}

	render() {
		let {dataList, recommendDataList, update, openMsg, recommend, userId} = this.state;
		let {promotion, proStatus} = this.props;
		return (
			update ?
				<div data-page="group-detail">
					<section id="group-detail" ref="group-detail">
						<GoodsMsg data={dataList} userId={userId}/>
						<GroupMsg data={dataList} fn={this.openOrClose.bind(this)}/>
						{openMsg ? <UsersDetail data={dataList}/> : ''}
						<div style={{height: 15, backgroundColor: "#f4f4f4"}}></div>
						{recommend ? <GroupRecommend data={recommendDataList}/> : ""}
					</section>
					{proStatus &&
					<BuyBarCtl {...this.props} data={dataList} promotion={promotion} itemId={dataList.item.item_id}/>}
					<OpenInAppGuide/>
					<ShareAndTotop config={{
						title: dataList.item.title,
						content: "我在泰然城发现了一个不错的商品，赶快来看看吧。",
						link: RHOST + window.location.pathname + window.location.search,
						icon: dataList.item.primary_image,
					}} openShare={this.openShare()}/>
				</div>
				: <LoadingRound/>
		)
	}
}

//商品信息
class GoodsMsg extends Component {
	render() {
		let {data, userId} = this.props;
		return (
			<div className="goods-msg">
				<a href={RNDomain + `/item?item_id=${ data.item.id }`} className="goods-img">
					{data.group.group_type === "ROOKIE_GROUP" ?
						<img className="new-group" src="/src/img/activity/new-group.png"/> : ""}
					<img src={addImageSuffix(data.item.primary_image, '_s')}/></a>
				<div className="goods-detail">
					<a href={RNDomain + `/item?item_id=${ data.item.id }`} className="c-fs12 c-c35 c-lh16 goods-title"
					   style={{'display': 'block', 'height': '48px'}}>{data.item.title}</a>
					<p className="c-fs12 c-c35">{data.group.required_person}人团: <span
						className="c-fs16 c-cf55">¥{data.group.price}</span></p>
				</div>
			</div>
		)
	}
}

//参团信息
class GroupMsg extends Component {
	componentDidMount() {
		let self = this;
		let gHeight = $(self.refs.imgsBox).css('height');
		$(self.refs.groupImg).css({'height': gHeight});
	};

	render() {
		//用户
		let {data} = this.props, groupPeople = data.group.required_person - data.group.current_person;
		let users = data.user.map(function (item, i) {
			return <HeadPortrait second={i ? false : true} isLeader={false} key={i}/>
		});
		//is_dealed  2表示拼团成功，1表示拼团中，0表示拼团失败
		return (
			<div className="group-msg c-bgf4">
				<div className="c-c80 c-fs12 c-tc c-lh50">
					{data.group.is_dealed === 1 ?
						(data.group.group_type === "ROOKIE_GROUP" ?
							<span>还差<span className="c-cf44">{groupPeople}位新人</span>拼团成功，快去邀请好友吧</span> :
							<span>还差<span className="c-cf44">{groupPeople}</span>人,盼你如南方人盼暖气</span>) :
						(data.group.is_dealed === 0 ? <span>{data.group.current_person}人参团，拼团失败</span> :
							<span className="c-cf44">{data.group.required_person}人参团，此团已完成</span>)}
				</div>
				<div className="group-img c-mb15" ref="groupImg">
					<div className="imgs-box c-tc" ref="imgsBox">
						<HeadPortrait isLeader={true}/>
						{users}
					</div>
				</div>
				{data.group.is_dealed === 1 && <Timer data={data.group}/> }
				<OpenDetail fn={this.props.fn}/>
				{data.group.is_dealed === 1 ? '' :
					<img className='success-of-fail'
						 src={data.group.is_dealed === 0 ? '/src/img/evaluate/group-fail.png' : '/src/img/evaluate/group-success.png'}/>}
			</div>
		)
	}
}

//参团人头像
class HeadPortrait extends Component {
	render() {
		let {second, isLeader} = this.props;
		return (
			<div className="head-portrait">
				<div className="portrait">
					<img src="/src/img/icon/avatar/default-avatar.png"/>
				</div>
				{(isLeader || second) ?
					<span className="c-bgf44 c-cfff c-fs10 c-tc c-lh16"
						  style={{'backgroundColor': isLeader ? '#ff4444' : '#ffc515'}}>
					{isLeader ? '团长' : '沙发'}
				</span>
					: ''}
			</div>
		)
	}
}

//倒计时
class Timer extends Component {
	componentWillMount() {
		let {data} = this.props;
		let timeDiff = (new Date(data.expire_time.replace(/-/g, '/')).getTime() - new Date(data.now_time.replace(/-/g, '/')).getTime()) / 1000,
			hh = Math.floor(timeDiff / 60 / 60),
			mm = Math.floor((timeDiff - hh * 60 * 60) / 60),
			ss = Math.floor((timeDiff - hh * 60 * 60 - mm * 60)),
			mms = 9;
		this.setState({
			hh: hh || 0,
			mm: mm || 0,
			ss: ss || 0,
			mms: mms
		})
	}

	componentDidMount() {
		let self = this;
		this.timer = setInterval(() => {
			let {hh, mm, ss, mms} = self.state;
			if (hh === 0 && mm === 0 && ss === 0 && mms === 0) {
				clearInterval(this.timer);
				$('.remaining-time').css({display: 'none'});
				history.go(0);
				return;
			}
			//有延时，此时mms为1
			self.setState({mms: mms - 1});
			if (mms < 1) {
				self.setState({
					mms: 9,
					ss: ss - 1
				})
			}
			if (ss < 0) {
				self.setState({
					ss: 59,
					mm: mm - 1
				});
			}
			if (mm < 0) {
				self.setState({
					mm: 59,
					hh: hh - 1
				});
			}
		}, 100);
	};

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		let {hh, mm, ss, mms} = this.state;
		let {timerStatus} = this.props;
		return (
			timerStatus ?
				<div className="timer1">
					<div className=" c-fs18 c-cfff c-tc">
						剩余 <span className="time">{hh > 9 ? hh : ('0' + hh)}</span> : <span
						className="time">{mm > 9 ? mm : ('0' + mm)}</span> : <span
						className="time" style={{position: "relative", width: "54px"}}><span
						className="mm">{ss > 9 ? ss : ('0' + ss)}.</span><span
						className="c-fs16 c-cdred mms">{mms}</span></span> 结束
					</div>
				</div> : <div className="remaining-time">
				<div className="timer c-fs10 c-cfff c-tc c-bg35">
					距离结束仅剩 {hh > 9 ? hh : ('0' + hh)}:{mm > 9 ? mm : ('0' + mm)}:{ss > 9 ? ss : ('0' + ss)}</div>
			</div>
		)
	}
}

//查看详情
class OpenDetail extends Component {
	componentWillMount() {
		this.setState({
			isOpen: false
		})
	};

	openOrClose() {
		this.setState({
			isOpen: !this.state.isOpen
		});
		this.props.fn();
	};

	render() {
		let {isOpen} = this.state;
		return (
			<div className="open-detail">
				<div onClick={this.openOrClose.bind(this)}
					 className={isOpen ? "open-txt open-txt-bg c-fs12 c-c80" : "open-txt c-fs12 c-c80"}>
					查看全部参团详情
				</div>
			</div>
		)
	}
}

//参团用户详情
class UsersDetail extends Component {
	render() {
		let {data} = this.props;
		let users = data.user.map(function (item, i) {
			return <EachDetail data={item} isLeader={false} key={i}/>
		});
		return (
			<div className="users-detail">
				<i className="user-detail-arror"> </i>
				<ul>
					<EachDetail data={data.user_start[0]} isLeader={true}/>
					{users}
				</ul>
			</div>
		)
	}
}

//单个参团用户详情
class EachDetail extends Component {
	getDate(tt) {
		let d = new Date(tt),
			yy = d.getFullYear() > 9 ? d.getFullYear() : '0' + d.getFullYear(),
			mon = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1),
			dd = d.getDate() > 9 ? d.getDate() : '0' + d.getDate(),
			hh = d.getHours() > 9 ? d.getHours() : '0' + d.getHours(),
			mm = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes(),
			ss = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds();
		return yy + '-' + mon + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
	};

	render() {
		let {isLeader, data} = this.props,
			startTime = isLeader ? data.open_time : data.join_time;
		return (
			<li className={isLeader ? "c-bgf99 c-mb10" : "c-bgc9 c-mb10"}>
				<span className={isLeader ? "c-bgf99 horn" : "c-bgc9 horn"}></span>
				<span className="circle c-bgf44"></span>
				<div className="portrait">
					<img src="/src/img/icon/avatar/default-avatar.png"/>
				</div>
				{isLeader ?
					<div className="c-cfff c-fl c-fs12 c-lh46" style={{paddingRight: '4px'}}>团长</div> : ''}
				<p className="c-fl c-cfff c-lh46">{data.name}</p>
				<p className="c-fr c-cfff c-lh46">{isLeader ? '开团' : '参团'}</p>
				<div className="c-fr c-cfff c-lh46" style={{paddingRight: '2px'}}>{startTime}</div>
			</li>
		)
	}
}

//拼团推荐
class GroupRecommend extends Component {
	render() {
		let {data} = this.props;
		let list = data.data.data.map(function (item, i) {
			if (i < 9) {
				return <EachOne data={item} key={i}/>
			}
		});
		return (
			<div className="group-recommend">
				<p className="c-fs14 recommend-title">拼团推荐</p>
				<div className="recommend-goods">
					{list}
				</div>
				<div className="recommend-footer">
					<Link to="/">
						<span style={{color: "#999999"}}>拼团商城</span>
					</Link>
					<i> </i>
					<Link to="/groupList/0">
						<span style={{color: "#999999"}}>我的拼团</span>
					</Link>
				</div>
			</div>
		)
	}
}

//单个商品详情
class EachOne extends Component {
	render() {
		let {data} = this.props;
		let priceInt = String(parseFloat(data.sell_price)).split(".")[0];
		let priceMod = String(parseFloat(data.sell_price)).split(".")[1];
		return (
			<div className="c-tc each-goods">
				<div style={{width: '96%', maxWidth: 105, display: "inline-block"}}>
					<div style={{height: 105, overflow: "hidden"}}>
						<a href={RNDomain + `/item?item_id=${ data.item_id }`}>
							<img
								src={addImageSuffix(data.images[0], '_s') || "/src/img/icon/loading/default-no-item.png"}/>
						</a>
					</div>
					<div className="c-fs12 c-tl">
						<p className=" c-c35 title">{data.title}</p>
						{priceMod > 0 ?
							<p className="recommend-price c-fs15">
								<span className="c-fs12">¥</span>{priceInt + "."}
								<span className="c-fs12">{priceMod}</span></p> :
							<p className="recommend-price c-fs15">
								<span className="c-fs12">¥</span>{priceInt}</p>
						}
					</div>
				</div>
			</div>
		)
	}
}

let NOSELL = 0,
	OPENGROUP = 1,
	AGAINGROUP = 2,
	SPONSOR = 3,
	NOTSPONSOR = 4,
	NOGROUPBUY = 5,
	SELLLIMIT = 6,
	NOLOGIN = 7,
	SELLOUT = 8,
	ONLYNEW = 9,
	OPENLIMIT = 10;

let GroupState = [];

GroupState[NOGROUPBUY] = {
	text: "活动已过期",
	clsFix: "color-grey",
	click: null
};
GroupState[SELLOUT] = {
	text: "已售罄",
	clsFix: "color-grey",
	click: null
};
GroupState[NOSELL] = {
	text: "暂不销售",
	clsFix: "color-grey",
	click: null
};
GroupState[OPENGROUP] = {
	text: "我也开个团",
	click: "showModal",
	activeType: "groupBuy"
};
GroupState[AGAINGROUP] = {
	text: "重新开团",
	click: "showModal",
	activeType: "groupBuy"
};
GroupState[SPONSOR] = {
	text: "分享",
	click: "BUY"
};
GroupState[NOTSPONSOR] = {
	text: "确定参团",
	click: "showModal",
	activeType: "joinGroup"
};
GroupState[SELLLIMIT] = {
	text: "参与次数到上限",
	clsFix: "color-grey",
	click: null
};
GroupState[OPENLIMIT] = {
	text: "开团已达上限",
	clsFix: "color-grey",
	click: null
};
GroupState[NOLOGIN] = {
	text: "登录后参团",
	click: null
};
GroupState[ONLYNEW] = {
	text: "仅限新人参团",
	clsFix: "color-grey",
	click: null
};

class BuyBar extends Component {
	static contextTypes = {
		isLogin: React.PropTypes.bool
	};

	componentWillMount() {
		let groupState = GroupState[this.getGroupState()];
		this.state = {
			groupState
		}
	}

	getGroupState() {
		let {data, data: {item, is_open}, promotion: {realStore}} = this.props;
		let groupPeople = data.group.required_person - data.group.current_person;
		let end = new Date(data.group.expire_time.replace(/-/g, '/')).getTime(),
			now = new Date(data.group.now_time.replace(/-/g, '/')).getTime(),
			timeOut = (end - now) / 1000;
		if (item.status !== "SHELVING") {
			return NOSELL   //暂不销售
		}

		if (realStore === 0) {
			return SELLOUT   //已售罄
		}

		if (data.item_type !== "GroupBuy") {
			return NOGROUPBUY   //活动已过期
		}
		if (!this.context.isLogin) {
			return NOLOGIN     //登录后参团
		}
		if (timeOut <= 0 || groupPeople <= 0) { //不在当前团有效期内（需要开团）
			//开团上限内（我也开个团|重新开团|开团达上限）
			return is_open === 1 ? AGAINGROUP : OPENGROUP  //1开团人：重新开团  0参团人：我也开个团
		} else {
			return is_open === 1 ? AGAINGROUP : NOTSPONSOR//重新开团|确认参团
		}
	}

	showModal = () => {
		this.props.UpdateBuyModal({buyModal: true});
	};
	closeModal = () => {
		this.props.UpdateBuyModal({buyModal: false});
	};

	bindClick(state) {
		if (!state.click) {
			return
		} else {
			this[state.click]();
		}
	}

	render() {
		let {item, group, is_open} = this.props.data;
		//is_dealed  2表示拼团成功，1表示拼团中，0表示拼团失败
		let data = {
			primary_image: item.primary_image,
			tax_rate: item.tax,
			trade_type: item.trade_type,
			object_id: group.is_dealed === 1 ? ( is_open === 1 ? 0 : this.props.location.query.object_id) : 0,  //参团传object_id 开团传0
			groupPrice: group.price,
			shop_id: item.shop_id,
			shop: item.shop,
		};
		let props = {
			...this.props,
			...this.state,
			itemId: this.props.data.item.id,
			data: data,
			closeModal: this.closeModal
		};
		let {groupState} = this.state;
		return (

			<section className="group-purchase-btn">
				<BuyModal  {...props} active={groupState.activeType}/>
				<a className="more-pintuan" href="/groupMall">
					<span className="list-icon"><img src="/src/img/pintuan/list-shape-icon.png"/></span>更多拼团
				</a>
				<LinkChange className={"jump-group-btn sure-join-group " + (groupState.clsFix || " ")} onClick={() => {
					this.bindClick(groupState)
				}}>{groupState.text}</LinkChange>
			</section>
		)
	}
}


const stateLogin = (state) => ({
	...state.global
});

export function stateModalData(state) {
	let props = {
		promotion: state.itemIndex.promotion,
		retState: state.itemIndex.retState,
		buyModal: state.itemIndex.buyModal,
		buyActive: state.itemIndex.buyActive,
		proStatus: state.itemIndex.proStatus,
		areaData: state.itemIndex.areaData
	};
	return props;
};

export function stateModalDispatch(dispatch) {
	return {
		Promotion: (data) => {
			dispatch(axiosCreator('promotionData', {
				...pageApi.Promotion,
				params: {"item_id": data.data.item.id}
			}));
		},
		UpdateBuyModal: (data) => {
			dispatch(createActions('updateBuyModal', data));
		},
		InitState: (ret) => { //初始化弹框规格数据
			dispatch(createActions('initState', {ret: ret}));
		},
	}
};


let BuyBarCtl = connect(stateLogin)(BuyBar);

export default connect(stateModalData, stateModalDispatch)(GroupDetail);

