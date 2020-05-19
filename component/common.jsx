import React, {Component} from 'react';
import {Link} from 'react-router';
import GetNextPage from '../src/plugin/get-next-page.js'
import {dataConvertShare, base64Utf8} from "../src/js/util/index";
import {UCENTER,SERCVICEURL} from 'config/index';
import { getCookie } from 'js/common/cookie';
import axios from 'axios';
import styles from "./common.scss";


//没有更多
export let NoMore = () => {
	const style = {
		height: "30px",
		lineHeight: "30px"
	};
	return <div className="no-more c-fs14 c-cc9 c-tc" style={style}>
		别拉了，我是有底线的~
	</div>
};

//加载中 圆圈
export let LoadingRound = () => (
	<div className="loading-round c-tc" style={{padding: "80px 0", width: "100%"}}>
		<img src="/src/img/icon/loading/load-animate.gif" width="77" height="80"/>
		<div className="c-fs10 c-c999">加载中...</div>
	</div>
);

//局部 加载中
export let LoadingImg = () =>(
	<div className="c-tc" style={{padding:"30px 0",width:"100%"}} >
		<img src="/src/img/icon/loading/load-animate.gif" width="38" height="40" />
	</div>
);

//弹窗加载
export const PopupLoading = () => (
	<div>
		<Shady options={{bgColor: "transparent"}}/>
		<div className={styles.popupLoad }>
			<div className={styles.popupLoadBox}>
				<div className={styles.popupLoadImg}></div>
			</div>
			<div className={styles.popupLoadText}>Loading ...</div>
		</div>
	</div>
);

//没有更多订单
export let NoMoreOrder = () => {
	return (
		<div className="no-more-order c-tc" style={{paddingTop: "2.8rem", width: "100%"}}>
			<img src="/src/img/icon/order-menu-icon.png" width="100" height="80"/>
			<div className="c-fs14 c-cc9" style={{padding: "0.35rem 0"}}>您还没有相关订单</div>
		</div>
	)
};
//没有订单信息
export const NoMoreOrderInfo =()=>{
    return(
        <div className="no-more-order c-tc" style={{paddingTop:"2.8rem",width:"100%"}}>
            <img src="/src/img/icon/order-menu-icon.png"  width="100" height="80"/>
            <div className="c-fs14 c-cc9" style={{padding:"0.35rem 0"}}>暂无订单信息哦~</div>
        </div>
    )
};
//没有更多页面
export let NoMorePage = ({text}) => {
	return (
		<div className="no-more-order c-tc" style={{paddingTop: "2.8rem", width: "100%"}}>
			<img src="/src/img/icon/order-menu-icon.png" width="100" height="80"/>
			<div className="c-fs14 c-cc9" style={{padding: "0.35rem 0"}}>{text}</div>
		</div>
	)
};
//没有搜索结果
export const SearchNone =()=>{
	return(
		<div className="c-tc" style={{paddingTop:"80px"}}>
			<img src="/src/img/search/search-none.png" width="58" height="56" />
			<p className="c-fs14 c-mt10">抱歉，暂无相关商品</p>
			<p className="c-cc9">换个关键词试试吧~</p>
		</div>
	)
};

//没有筛选结果
export const FilterNone =()=>{
	return(
		<div className="c-tc" style={{paddingTop:"80px"}}>
			<img src="/src/img/search/search-none.png" width="58" height="56" />
			<p className="c-fs14 c-mt10">没有相关商品</p>
		</div>
	)
};
//网络故障
export const NetError =()=>{
	return(
		<div className="c-tc" style={{paddingTop:"50px"}}>
			<img src="/src/img/search/net-error.png" width="78" height="104" />
			<p className="c-cc9">网络异常，点击重试~</p>
			<p className="reload-container"><div className="reload-button" onClick={()=>{window.location.reload()}}>重新加载</div></p>
		</div>
	)
};

//半透明遮罩层
export const Shady = ({options, clickHandle}) => {
	let zIndex = (options && options.zIndex) || 100;
	let bgColor = (options && options.bgColor) || "#000";
	const styles = {
		zIndex: zIndex,
		opacity: 0.5,
		background: bgColor,
		top: 0,
		left: 0,
		position: "fixed",
		width: "100%",
		height: "100%"
	};
	return (
		<div style={styles} onTouchStart={ (e) => {
			clickHandle && clickHandle();
		} } onTouchMove={ (e) => {
			e.preventDefault();
		} }></div>
	)
};

export const CommonShady = ({zIndex, clickHandle}) => {
	zIndex = zIndex || 100;
	const styles = {
		zIndex: zIndex,
		opacity: 0.5,
		background: "#000",
		top: 0,
		left: 0,
		position: "fixed",
		width: "100%",
		height: "100%"
	};
	return (
		<div style={styles} onClick={ (e) => {
			clickHandle && clickHandle();
		} }></div>
	)
};

//透明加载中遮罩层
export const TransShady = ({options, clickHandle}) => {
	let zIndex = (options && options.zIndex) || 105;
	const styles = {
		zIndex: zIndex,
		opacity: 0.5,
		background: "transparent",
		top: 0,
		left: 0,
		position: "fixed",
		width: "100%",
		height: "100%"
	};
	const imgStyles = {position: "absolute", top: "50%", marginTop: "-12px"};
	return (
		<div className="c-tc" style={styles} onTouchStart={ (e) => {
			clickHandle && clickHandle();
		} } onTouchMove={ (e) => {
			e.preventDefault();
		} }>
			<img src={ require('src/img/icon/loading/loading-round-red.gif')} width="24" height="24" style={imgStyles}/>
		</div>
	)
};

//页面为空
export let EmptyPage = ({config}) => {
	return (
		<div data-comp="empty-page">
			<div className="empty-bg" style={{
				background: `url(${config.bgImgUrl}) center top no-repeat transparent`,
				backgroundSize: "125px 100px"
			}}>
				<p className="c-fs13 c-cc9">{config.msg}</p>
				{!config.noBtn ? <a className="red-btn" href={config.link}>{config.btnText}</a> : null}
			</div>
		</div>
	)
};

export const EmptyPageLink = ({config}) => {
	return (
		<div data-comp="empty-page-link">
			<div className="empty-bg" style={{
				background: `url(${config.bgImgUrl}) center top no-repeat transparent`,
				backgroundSize: "125px 100px"
			}}>
				<p className="c-fs13 c-cc9">{config.msg}</p>
				{!config.noBtn ? <div className="red-btn" onClick={ config.btnClick }>{config.btnText}</div> : null}
			</div>
		</div>
	)
}


//搜索条
export class SearchBarA extends Component {
	constructor(props) {
		super(props);
		this.state = {
			innerValue: props.defaultValue
		};
	}

	changeHandle = (e) => {
		const value = e.target.value;
		if (this.props.value !== undefined) {
			this.props.onChange && this.props.onChange(value);
		} else {
			this.setState({
				innerValue: value
			});
		}
	};
	clearHandle = (e) => {
		if (this.props.value) {
			this.props.onChange && this.props.onChange("");
		} else {
			this.setState({
				innerValue: ""
			})
		}
	};
	getTerraceHost = () => {
		let terraceHost = "m";
		if(navigator.userAgent.indexOf('51gjj')>-1){
			terraceHost = "51af-m";
		}else if(document.cookie.platform=='mall'){
			terraceHost = "m";
		}else if(document.cookie.platform=='finance'){
			terraceHost = "jr-m";
		}else if(!document.cookie.origin){
			terraceHost = "wx";
		}
		return terraceHost;
	};
	getLinkByTerrace = (link)=>{
		return (link&&link.indexOf("tairanmallhost")>-1)?link.replace('tairanmallhost',this.getTerraceHost()):link;
	};
	isResultPage(param){
		return param.shop||param.coupon_id;
	};
	componentDidMount() {
		const {isMount} = this.props;
		isMount && isMount.call(this);
	};

	render() {
		const {value,listStyle,placeHolder,param} = this.props,
			{innerValue} = this.state;
		return (
			<form data-comp="search-bar-a" className="g-row-flex" onSubmit={(e)=>{
					  e.preventDefault();
				      this.refs.search.value.trim()?
				      this.props.onSearch(this.refs.search.value.trim(),null,param):
				      this.props.onSearch(((!this.isResultPage(param)&&placeHolder)?placeHolder.word:""),this.getLinkByTerrace(placeHolder?placeHolder.link:""),param) }}>
				<label className="g-col-1 search-label" ref="label">
					<input ref="search" value={ value!==undefined?value:innerValue } type="search"  placeholder={(param.shop||param.coupon_id)?"在结果中搜索":((placeHolder&&placeHolder.word)||"搜索：商品 分类 品牌 国家")}  onChange={this.changeHandle} onFocus={this.props.onFocus } className="search-input"/>
					{( value!==undefined?value:innerValue ) !=="" && <i ref="clear" onTouchTap={this.clearHandle }  className="close-x-icon"> </i>}
					<i className="search-icon"> </i>
				</label>
				{this.props.changeType?(<div className="change-container" onClick={this.props.changeType}><i className={listStyle==1?"list-style1-icon":"list-style2-icon"}> </i></div>):<button type="submit" className="search-btn">搜索</button>}
			</form>
		)
	}
}

export class LinkChange extends Component {
	static contextTypes = {
		isApp: React.PropTypes.bool,
		isLogin: React.PropTypes.bool
	};

	noop() {
	}

	render() {
		let props = this.props;
		let notLogin = props["data-notLogin"]
		let context = this.context;
    return (
			!context.isApp ?
				<Link {...props} to={"/guide?redirect=" + encodeURIComponent(location.href)} onTouchTap={this.noop}
							onClick={this.noop}>{props.children}</Link>
				: !(notLogin === true || context.isLogin) ?
				<a href="trmall://to_login" {...props} onTouchTap={this.noop} onClick={this.noop}>{props.children}</a>
				: <Link  {...props}>{props.children}</Link>
		)
	}
}

//分享
export class ShareAndTotop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			click: true
		}
	}

	static contextTypes = {
		isApp: React.PropTypes.bool,
		store: React.PropTypes.object
	};

	componentDidMount() {
		let $window = $(window);
		let windowH = $window.height();
		let $toTop = $(".toTop");
		let timer;
		$window.scroll(function () {
			let $this = $(this);
			let scrollH = $this.scrollTop();
			if (scrollH > 35) {
				$toTop.show()
			} else {
				$toTop.hide()
			}
		})
		if (this.props.openShare && this.refs.share) {
			this.refs.share.click()
		}
	}

	clearTime=()=> {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null
		}
	};

	handleClick = () => {
		this.setState({click: false});
		let $toTop = $("toTop");
		let h = $(window).scrollTop();
		$toTop.hide();
		this.clearTime();
		this.timer = setInterval(() => {
			h -= 20;
			$(window).scrollTop(h);
			if (h <= 0) {
				this.clearTime();
				this.setState({click: true})
			}
		})
	};

	getShareParams() {

		let {config} = this.props, params;

		if (this.params) {
			return this.params;
		} else {
			return this.params = dataConvertShare(config)
		}
	}

	render() {
		console.log(this.state.click);
		return (
			<div className="share-toTop" data-comp="share-label">
				<ul> {
					this.context.isApp ? <li className="share"><a href={this.getShareParams()} ref="share"></a></li> : null
				}
					<li className="toTop" onClick={()=>{this.state.click?(this.handleClick()):""}}></li>
				</ul>
			</div>
		)
	}
}

export class OpenInAppGuide extends Component {
	static contextTypes = {
		isApp: React.PropTypes.bool,
		store: React.PropTypes.object
	};

	render() {
		return (
			!this.context.isApp ?
				<div id="mask" style={{
					position: "fixed",
					top: "0",
					width: "100%",
					background: "rgba(0,0,0,.6)",
					padding: "3px 10px",
					color: "#fff",
					zIndex: "10000"
				}}>
					<p style={{color: "#fff", fontSize: "12px", margin: "0"}}>1.微信等暂不支持打开第三方应用，进行购买将跳转到下载界面，请根据引导操作。</p>
					<p style={{color: "#fff", fontSize: "12px", margin: "0"}}>2.若您已安装本应用，进入浏览器后请根据提示进入应用。</p>
				</div> : null)

	}
}


export class Scroll extends Component {

	static contentsProps = {
		classfix: "scroll-wrap",
		nowState: "INIT",
		scrollArea: window,
		domDown: {
			domInit: () => (
				<div className="dropload-load dropload-init">
					<img className="loading" src="/src/img/icon/loading/loading.png"/>
					加载中...{/*初始化中*/}
				</div>
			),
			domRefresh: () => (<div className="dropload-load">上拉加载更多</div>),
			domLoad: () => (
				<div className="dropload-load">
					<img className="loading" src="/src/img/icon/loading/loading.png"/>
					加载中...
				</div>
			),
			domNoData: () =>(<div className = "dropload-load">别拉了，我是有底线的~</div>)
		},
		getData: () => {
		}
	}

	createMapState() {
		let {domDown} = this._props;

		this.mapState = {
			"INIT": {dom: domDown.domInit, fn: this.getData},
			"REFRESH": {dom: domDown.domRefresh},
			"LOAD": {dom: domDown.domLoad, fn: this.getData},
			"NODATA": {dom: domDown.domNoData}
		}
	}

	stateInit() {
		this.changeState("INIT")
	}

	stateRefresh() {
		this.changeState("REFRESH")
	}

	stateLoad() {
		this.changeState("LOAD")
	}

	stateNodata() {
		this.changeState("NODATA")
	}

	unLocked(flag) {
		this._props.locked = !!flag;
	}

	clone(target, ...arg) {
		if (!arg.length) {
			return target
		}

		let src, keys, cObj, i = -1;

		while (src = arg[++i]) {
			keys = Object.keys(src);

			keys.forEach((key, i) => {
				if (typeof src[key] == "Object") {
					cObj = target[key] || src[key].length ? [] : {}
					this.clone(cObj, src[key]);
				} else {
					cObj = src[key]
				}

				target[key] = cObj
			})
		}

		return target
	}

	changeState(sState) {
		let state = this.mapState[sState];

		state.nowState = sState;
		this.setState(state);
		if (state.fn) {
			state.fn.call(this)
		}
	}

	getData() {
		this.unLocked(true);
		this.props.getData(this)
	}


	constructor(props) {
		super(props)
		this.state = {}
		this._props = this.clone({
			locked: false
		}, Scroll.contentsProps, props);

		this.createMapState()
	}

	componentWillReceiveProps(np) {
		if (np.nowState == "INIT") {
			this.stateInit()
		}
	}

	componentWillMount() {
		this.changeState(this._props.nowState);
	}

	componentDidMount() {
		this.unmout = this.onMount();
	}

	componentWillUnmount() {
		if (this.unmout)
			this.unmout();
	}

	onMount() {
		let {anchor} = this.refs;
		let self = this;

		self.mount = () => {
			if (self.state.nowState == "NODATA" || self._props.locked) {
				return
			} else if (window.innerHeight > anchor.offsetTop - window.scrollY) {
				self.changeState("LOAD")
			}
		}

		this._props.scrollArea.addEventListener('scroll', self.mount);
		return () => this._props.scrollArea.removeEventListener('scroll', self.mount)
	}

	render() {
		let {classfix} = this._props;
		return (
			<div className={classfix}>
				{this.props.children }
				<div ref="anchor" id="test">
					{this.state.dom()}
				</div>
			</div>
		)

	}
}

//客服
export class CustomerService extends Component {
	getServiceUrl = (queue,loginName,isLogin)=>{
		return 	`${SERCVICEURL}?from=chat&queue=${queue}&loginName=${loginName}&password=&device=mobile&visit=${isLogin}`;
	};

	toCustomService = ()=>{
		//客服中心接待组队列号
		const serviceQueue = { 1: 3101, 2: 3201 };
		let {shopAttr} = this.props;
		/*shopAttr = shopAttr==2? 2:1;*/
        shopAttr = 1;
		location.href = `trmall://customer_service?targetId=${serviceQueue[shopAttr]}`;

		/*//未登录用户跳转链接
		const visitorUrl = this.getServiceUrl(serviceQueue[shopAttr],sdk.getDeviceId(),1);

		//初始化值为未登录状态
		const token = getCookie('token');
		if(token){
			//判断用户是否登录,token是否有效
			axios.request({
				url: `${UCENTER}/user`,
				headers: {'Authorization': "Bearer " + token},
				params: {needPhone: true}
			}).then(({data}) => {
				if (data.code === "200") {
					//登录用户跳转链接
					location.href = this.getServiceUrl(serviceQueue[shopAttr],data.body.phone,0);
				}else{
					location.href = visitorUrl;
			}
			}).catch(err=>{
				console.log(err);
				location.href = visitorUrl;
		})
		}else{
			location.href = visitorUrl;
		}*/
	};

	render() {
		return (
			<a className={this.props.className} onClick={this.toCustomService}>
				{this.props.children }
			</a>
		)
	}
}










































