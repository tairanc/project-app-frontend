import React, {Component} from 'react';
import {connect} from 'react-redux';
import {LoadingRound, EmptyPageLink} from 'component/common.jsx';
import {Link} from 'react-router';
import {actionAxios, actionAxiosAll, concatPageAndType} from 'js/actions/actions';
import {DropDownLoad} from 'component/HOC.jsx';
import axios from 'axios';
import Popup from 'component/modal';
import {newWindow} from 'js/common/utils';
import './home.scss';
import {RNDomain} from 'src/config/index'

const pageApi = {
	nav: {url: "/newapi/promotion/groupBuy/category", method: "get"},
	list: {url: "/newapi/promotion/groupBuy/item", method: "get"},
	banner: {url: "/newapi/promotion/groupBuy/getGroupBanner", method: "get"},
	comingList: {url: "/newapi/promotion/groupBuy/comingItem", method: "get"},
	collection: {url: "/newapi/user/collection/add", method: "post"},
	cancelcollection: {url: "/newapi/user/collection/remove", method: "get"},
};

const axiosActions = actionAxios('groupMallHome');
const axiosActionsAll = actionAxiosAll('groupMallHome');
const createActions = concatPageAndType('groupMallHome');

let CancelToken = axios.CancelToken;
let cancel;

const ItemNone = <EmptyPageLink config={{
	bgImgUrl: "/src/img/activity/item-none-page.png", msg: "暂时没有活动商品", btnText: "返回", btnClick: () => {
		location.href = 'jsbridge://goBack'
	}
}}/>;

const PreItemNone = <EmptyPageLink config={{
	bgImgUrl: "/src/img/activity/item-none-page.png", msg: "暂时没有预告商品", btnText: "返回", btnClick: () => {
		location.href = 'jsbridge://goBack'
	}
}}/>;

class HomePage extends Component {
	constructor(props, context) {
		super(props);
		document.title = "拼团";
		if (context.isApp) location.href = "jsbridge://set_title?title=拼团";
		this.reload = $('<meta name="reload-enbaled" content="false" />');
		$('head').append(this.reload);
	}

	static contextTypes = {
		isApp: React.PropTypes.bool,
		isLogin: React.PropTypes.bool
	};

	componentWillMount() {
		if (this.props.load) this.props.getNav();
	}

	componentDidMount() {
		echo.init({offset: 0, throttle: 0});
	}

	componentDidUpdate() {
		echo.init({offset: 0, throttle: 0});
	}

	componentWillUnmount() {
		this.props.saveDistanceTop();
		this.reload.remove();
	}

	dropDown = (me) => {
		const {list, categoryId, dispatch} = this.props;
		if (list.page >= list.total) {
			me.lock();
			me.noData();
			me.resetload();
			return;
		}
		if (list.isComing) {
			axios.request({
				...pageApi.comingList,
				cancelToken: new CancelToken(function executor(c) {
					cancel = c;
				}),
				params: {
					category_id: categoryId,
					page: list.page + 1,
					limit: 20
				}
			}).then(result => {
				if (!result.data.status) {
					// dispatch(createActions('promptCtrl', {prompt: {show: true, msg: result.data.msg}}));
					Popup.MsgTip({msg: result.data.msg});
					me.resetload();
					return;
				}
				dispatch(createActions('concatDataSuccess', {result: result.data}));
				me.resetload();
			})
		} else {
			axios.request({
				...pageApi.list,
				cancelToken: new CancelToken(function executor(c) {
					cancel = c;
				}),
				params: {
					category_id: categoryId,
					page: list.page + 1,
					limit: 20
				}
			}).then(result => {
				if (!result.data.status) {
					// dispatch(createActions('promptCtrl', {prompt: {show: true, msg: result.data.msg}}));
					Popup.MsgTip({msg: result.data.msg});
					me.resetload();
					return;
				}
				dispatch(createActions('concatDataSuccess', {result: result.data}));
				me.resetload();
			})
		}

	}

	render() {
		if (this.props.load) {
			return <LoadingRound/>;
		}
		return <div data-page="group-mall-home" style={{minHeight: $(window).height(), background: "#f4f4f4"}}>
			<div className="home-index">
				<HeadNav data={ this.props.nav } getList={ this.props.getList } changeList={ this.props.changeList }
								 categoryId={ this.props.categoryId }/>
				{this.props.banner && this.props.showBanner ? <BannerSlide data={ this.props.banner }/> : ""}
				{ !this.props.listLoad ?
					( this.props.list.data ?
						<GroupListCtrl data={ this.props.list.data } isComing={this.props.list.isComing} dropDown={ this.dropDown }
													 isApp={ this.context.isApp }
													 isLogin={this.context.isLogin}/> :
						(this.props.list.isComing ? PreItemNone : ItemNone) ) :
					<LoadingRound/> }
				<BtnToTop/>
			</div>
		</div>
	}
}


class HeadNav extends Component {
	componentDidMount() {
		let mySwiperNav = new Swiper(this.refs.swiperNav, {
			slidesPerView: 'auto',
			paginationClickable: true,
			freeMode: true,
			onTap: function () {
				if (mySwiperNav.clickedIndex >= 1) {
					mySwiperNav.slideTo(mySwiperNav.clickedIndex - 2);
				}
			}
		});
		this.props.getList();
	}

	getNavList() {
		return this.props.data && this.props.data.map((item, i) => {
				let length = this.props.data.length;
				return <div className={`swiper-slide ${this.props.categoryId === item.category_id ? "active" : ""}`} key={i}
										onClick={ i === (length - 1) ? (e) => this.props.changeList(item.category_id, true) : (e) => this.props.changeList(item.category_id) }>
					<span>{item.name}</span>
				</div>
			});
	}

	render() {
		return <div data-plugin="swiper" className="home-nav">
			<div className="swiper-container" ref="swiperNav">
				<div className="swiper-wrapper">
					{this.getNavList()}
				</div>
			</div>
		</div>
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
				return <a className="swiper-slide" href={item.link_target || "javascript:void(0)"} key={i}>
					<img src={item.img_link}/>
				</a>
			});
	}

	render() {
		let {data} = this.props, style;
		data.length > 1 ? style = {display: "block"} : style = {display: "none"};
		return (
			<div data-plugin="swiper" className="home-banner">
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


class GroupListCtrl extends Component {
	render() {
		return <div className="group-list" id="groupList">
			<DropDownList data={ this.props.data } scrollArea={ window } isComing={this.props.isComing}
										dropDown={ this.props.dropDown } isApp={ this.props.isApp}
										isLogin={this.props.isLogin}/>
		</div>
	}
}

class GroupList extends Component {
	render() {
		return <div className="group-body">
			{this.props.data && this.props.data.map((list, i) => {
				return <GroupItem data={list} key={i} isComing={this.props.isComing}
													isApp={ this.props.isApp } isLogin={this.props.isLogin}/>
			})}
		</div>
	}
}

const DropDownList = DropDownLoad(GroupList);

class GroupItem extends Component {
	constructor(props) {
		super(props);
		let {data, isLogin} = this.props;
		this.state = {
			is_fav: isLogin ? data.is_fav : false,
			clickAble: true
		}
	}

	goCollection = () => {
		let self = this;
		let {data, isLogin} = self.props;
		let {is_fav} = self.state;
		self.setState({clickAble: false}, function () {
			if (!isLogin) {
				window.location.href = "trmall://to_login";
				return
			}
			if (is_fav) {
				axios.request({
					...pageApi.cancelcollection,
					params: {item_id: data.item_id}
				}).then(result => {
					if (!result.data.success) {
						Popup.MsgTip({msg: result.data.msg});
						self.setState({is_fav: false, clickAble: true})
					} else {
						Popup.MsgTip({msg: result.data.msg});
					}
				})
			} else {
				axios.request({
					...pageApi.collection,
					params: {item_id: data.item_id}
				}).then(result => {
					if (!result.data.success) {
						Popup.MsgTip({msg: result.data.msg});
						self.setState({is_fav: true, clickAble: true})
					} else {
						Popup.MsgTip({msg: result.data.msg});
					}
				})
			}
		});
	};

	render() {
		const {data, isComing} = this.props;
		let {is_fav, clickAble} = this.state;
		let itemId = data.item_id;
		return <div className="group-item">
			<a className="item-img" href={ RNDomain + `/item?item_id=${ data.item_id }`}>
				{data.group_type === "ROOKIE_GROUP" ? <img className="new-group" src="/src/img/activity/new-group.png"/> : ""}
				<img data-echo={ data.primary_image + '_m.jpg' } src="/src/img/icon/loading/default-watermark.png"/>
				{ !data.store ? <div className="sale-out">已抢完</div> : ""}
			</a>
			<a className="item-title" href={ RNDomain + `/item?item_id=${ data.item_id }`}>
				{data.title}
			</a>
			<div className="item-info">
				<div className="item-text">
					<i className="people-black-icon"> </i>
					<span>{ data.group_persons }人团</span>
					<div className="price"><span>¥</span>{ +data.group_price }</div>
					{data.price ? <del className="market-price">单买价¥{ +data.price }</del> : ""}
				</div>
				{isComing ? <button className={`item-btn blue-btn ${is_fav ? 'collection' : ""}`} onClick={() => {
					if (clickAble) {
						this.goCollection()
					}
				}}>
					{is_fav ? "已收藏" : "抢先收藏"}
				</button> : <a className="item-btn"
											 href={ RNDomain + `/item?item_id=${ data.item_id }`}>
					{data.store ? "去开团" : "去看看"} <i className="arrow-right-white-icon"> </i>
				</a>}

			</div>
		</div>
	}
}

class BtnToTop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		}
	}

	componentWillMount() {
		this.showHandle = () => {
			let top = $(window).scrollTop();
			if (top <= $(window).height() * 2) {
				this.setState({show: false})
			} else {
				this.setState({show: true});
			}
		};
		window.addEventListener('scroll', this.showHandle);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.showHandle);
	}

	clickHandle = () => {
		$(window).scrollTop(0);
	};

	render() {
		return <div>
			{ this.state.show && <div className="return-top" onClick={ this.clickHandle }>
				<img src="/src/img/home/return-top.png" width="100%" height="100%"/>
			</div>}
		</div>
	}
}

export const NoMoreItem = () => {
	const styles = {fontSize: "13px", padding: "25px 0", textAlign: "center"};
	return (
		<div style={ styles }>别拉了，我是有底线的~</div>
	)
}

function homePageState(state, props) {
	return {
		...state.groupMallHome
	}
}

function homePageDispatch(dispatch, props) {
	return {
		dispatch,
		getNav: () => {
			dispatch(axiosActionsAll('init', [{...pageApi.nav}, {...pageApi.banner}]));
		},
		getList: (categoryId) => {
			dispatch(axiosActions('getList', {...pageApi.list, params: {category_id: categoryId, page: 1, limit: 20}}));
		},
		saveDistanceTop: () => {
			dispatch(createActions('saveTop', {value: $(window).scrollTop()}));
		}
	}
}


function homePageProps(stateProps, dispatchProps, props) {
	let {categoryId} = stateProps;
	let {dispatch} = dispatchProps;
	return {
		...stateProps,
		...dispatchProps,
		...props,
		changeList: (id, flag) => {
			if (id !== "") {
				dispatch(createActions('hideBanner', {showBanner: false}));
			} else {
				dispatch(createActions('hideBanner', {showBanner: true}));
			}
			if (cancel) cancel('cancel Success');
			dispatch(createActions('changeId', {id: id}));
			if (flag) {
				dispatch(axiosActions('getList', {
					...pageApi.comingList,
					cancelToken: new CancelToken((c) => {
						cancel = c;
					}),
					params: {page: 1, limit: 20}
				}));
			} else {
				dispatch(axiosActions('getList', {
					...pageApi.list,
					cancelToken: new CancelToken((c) => {
						cancel = c;
					}),
					params: {category_id: id, page: 1, limit: 20}
				}));
			}
		},
	}
}

export default connect(homePageState, homePageDispatch, homePageProps)(HomePage);