/**
 * Created by hzhdd on 2017/10/31.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {actionAxios, concatPageAndType} from 'js/actions/actions';
import axios from 'js/util/axios';
import {LoadingRound, ShareConfig, getJSApi, EmptyPage} from 'component/common';
import {browserHistory} from 'react-router';
import {Modal, Fix} from 'component/modal';
import {redirectURL} from 'src/js/util/index'
import {getCookie, setCookie, clearCookie} from 'js/common/cookie';

import './item.scss';

import Detail from "./detail.jsx"
import Seckill from "./seckill.jsx"
import GroupBuy from "./groupBuy.jsx"

const pageApi = {
	Detail: {url: "/originapi/itemNew/detail", method: "get"},         //详情
	Mix: {url: "/originapi/itemNew/mix", method: "get"},               //混合
	Promotion: {url: "/originapi/itemNew/promotion", method: "get"},  //促销和规格数据
	Rate: {url: "/originapi/itemNew/rate", method: "get"},            //评价
	Recommend: {url: "/originapi/itemNew/recommend", method: "get"}, //推荐
	GetCart: {url: "/originapi/h5/cart/count", type: "get"},  //购物车信息
};
const axiosCreator = actionAxios('itemIndex');
const createActions = concatPageAndType('itemIndex');

// 加入渠道码 脚本start
function getURLParameter(name) {
	var parameterStr = window.location.search.replace(/^\?/, ''),
		reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
		value = parameterStr.match(reg);
	return value ? value[2] : null;
}

function addChannel(obj) {
	obj.find("a").each(function () {
		let org_href = $(this).attr('href');
		let reg_schem = /^t/;
		let reg_channel = /channel/;
		if (org_href && !reg_schem.test(org_href) && !reg_channel.test(org_href)) {
			let reg_requrey = /\?/, href;
			href = org_href + (reg_requrey.test(org_href) ? "&" : "?" ) + "channel=" + channel;
			$(this).attr('href', href)
		}
	})
}

class ItemPage extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const mini = this.props.location.query.mini;
		redirectURL(location.pathname + location.search, mini);
		document.title = '商品详情';
		let {item_id} = this.props.location.query;
		if (!item_id) {
			browserHistory.push("/");
		}

		/*if (item_id != this.props.data.item_id) {
		 this.props.InitAndClearData();
		 this.props.Detail(item_id);
		 // this.props.Mix();
		 this.props.Promotion(item_id);
		 this.props.Rate(item_id);
		 this.props.GetCart();
		 }*/
	}

	/*componentDidMount() {
	 let channel = getURLParameter('channel');
	 if (channel) addChannel($('body'));
	 if (this.props.buyModal || this.props.promotionModal || this.props.couponsModal || this.props.searverModal) {
	 preventScroll(true)
	 } else {
	 preventScroll(false)
	 }
	 }*/

	/*selectModel = () => {
	 let {data} = this.props;
	 let ret;
	 switch (data.item_type) {
	 case "groupbuy":
	 ret = <GroupBuy {...this.props} />;
	 break;
	 case "seckill":
	 ret = <Seckill {...this.props}/>;
	 break;
	 default:
	 ret = <Detail {...this.props}/>
	 }
	 return ret
	 };*/

	render() {
		return (
			<EmptyPage config={{
				bgImgUrl: "/src/img/shopCart/item-noexist-icon.png",
				msg: "该页面不存在，请打开APP或者前往微信商城查看",
				noBtn: true
			}}/>
		)
	}
}

export function ItemPageState(state, props) {
	return {
		...state.itemIndex,
		// ...state.global
	}
}

export function ItemPageDispatch(dispatch, props) {
	let targetUrl = window.location.href.split("#")[0];
	return {
		InitAndClearData: () => {
			dispatch(createActions('initAndClearData'))
		},
		Detail: (item_id) => {
			axios.request({...pageApi.Detail, params: {"item_id": item_id}}).then(
				result => {
					if (!result.data.status) {
						dispatch(createActions('changeUpdata', {updata: true}));
						return
					}
					dispatch(createActions('changeUpdata', {updata: true, itemId: item_id}));
					dispatch(createActions('initData', {data: result.data.data, status: true}));
					dispatch(axiosCreator('recommendData', {
						...pageApi.Recommend,
						params: {
							"item_id": item_id,
							category_id: result.data.data.category_id,
							shop_id: result.data.data.shop.shop_id
						}
					}));
					dispatch(axiosCreator('mixData', {...pageApi.Mix, params: {"item_id": item_id}}));
				}
			).catch(error => {
				console.log(error);
			});
		},
		/*Mix: () => {
		 dispatch(axiosCreator('mixData', {...pageApi.Mix, params: {"item_id": item_id}}));
		 },*/
		Promotion: (item_id) => {
			dispatch(axiosCreator('promotionData', {...pageApi.Promotion, params: {"item_id": item_id}}));
		},
		Rate: (item_id) => {
			dispatch(axiosCreator('rateData', {...pageApi.Rate, params: {"item_id": item_id}}));
		},
		GetCart: () => {
			dispatch(axiosCreator('cartInfoData', pageApi.GetCart));
		},

		UpdateBuyModal: (data) => {
			dispatch(createActions('updateBuyModal', data));
		},
		InitState: (ret) => { //初始化弹框规格数据
			dispatch(createActions('initState', {ret: ret}));
		},
		UpdateCartInfo: (data) => { //更新购物车数据
			dispatch(createActions('updateCartInfo', data));
		}
	}
}
export default connect(ItemPageState, ItemPageDispatch)(ItemPage);

























