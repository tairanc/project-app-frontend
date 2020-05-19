import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {SearchBarA} from 'component/common';
import {actionAxios, concatPageAndType} from 'js/actions/actions';
import {PopupTip} from 'component/modal';
import {throttle} from 'js/common/utils';
import  './search.scss';

const pageApi = {
	completion: {url: "/newapi/search/suggests", method: "get"},
	hot: {url: "/newapi/search/bizKeyword?type=biz", method: "get"}
};

const axiosActions = actionAxios('qygSearch');
const createActions = concatPageAndType('qygSearch');

class SearchIndex extends Component {
	constructor(props, context){
		super(props);
		document.title="搜索";
		if( context.isApp ) window.location.href = "jsbridge://set_title?title=搜索";
	}
	static contextTypes = {
		isApp: React.PropTypes.bool
	};
	componentWillMount() {
		this.props.initialPage();
		this.props.updateHot();
		this.xhrHandle = throttle(this.props.searchCompletion);
	}
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
	//搜索提交
	searchSubmit = (key,link,param) => {
		key = key !== undefined ? key.trim() : "";
		if (!key) {
			this.props.dispatch(createActions('ctrlPrompt', {prompt: {show: true, msg: "请输入搜索词"}}));
			return;
		}
		if( link ){
			window.location.href = this.getLinkByTerrace(link);
		}else{
			this.addHistoryHandle(key);
			browserHistory.replace(`/searchResult?key=${ encodeURIComponent(key)}&type=biz${(param&&param.shop)?'&shop='+param.shop:''}${(param&&param.coupon_id)?'&coupon_id='+param.coupon_id:''}`);
		}
	};

	//添加本地搜索历史
	addHistoryHandle = (key) => {
		if (!key) return false;
		let {searchHistory, dispatch} = this.props;
		for (let i = 0, item; item = searchHistory[i++];) {
			if (item.word === key) {
				searchHistory.splice(i - 1, 1);
			}
		}
		searchHistory.unshift({word: key});
		if (searchHistory.length > 20) {
			searchHistory.length = 20;
		}
		let storage = JSON.stringify(searchHistory);
		window.localStorage.setItem("qygSearchHistory", storage);
		dispatch(createActions('historyCtrl', {history: searchHistory}))
	};

	//清除搜索历史
	clearHistory = () => {
		window.localStorage.removeItem("qygSearchHistory");
		this.props.dispatch(createActions('historyCtrl', {history: []}));
	};

	searchHandle = (key) => {
		this.props.dispatch(createActions('keyCtrl', {key: key}));
		if (key.trim() === "") {
			this.props.dispatch(createActions('listCtrl', {list: []}));
			return;
		}
		this.xhrHandle(this.deleteSpace(key));
	};

	getList = () => {
		return this.props.compList && this.props.compList.map((item, i) => {
				return <ResultStrip key={i} text={ item } keyHandle={ this.searchSubmit }/>
			})
	};

	deleteSpace = (text) => {
		if(typeof text == 'string'){
			text = text.trim();
			let str = '';
			for(let i=0;i<text.length;i++){
				str += text[i]==' '?'':text[i];
			}
			return str;
		}else{
			return text;
		}
	};

	searchBarMount=( keyWord )=> {
		let text = this.deleteSpace(keyWord);
		if( text !==""){
			this.props.searchCompletion( text )
		}
		setTimeout( ()=>{
			$(this.refs.search).focus();
		},0)
	};

	render() {
		let {keyWord,param,searchHistory,hotList,prompt,promptClose} = this.props;
		return <div data-page="search-page" id="searchPage">
			<div className="search-bar-grid">
				<SearchBarA ref="search"
							onChange={ this.searchHandle }
							value={ keyWord }
							param={param}
							isMount={ this.searchBarMount.bind( null, keyWord ) }
							onSearch={this.searchSubmit }
				/>
			</div>
			{ this.props.keyWord ?(param.shop||param.coupon_id)?
				"":
				<div className="search-list-grid">
					<div className="search-list">
						{ this.getList() }
					</div>
				</div>:
				<div className="history-block">
					<SearchKeyWord type="history"
								   data={searchHistory}
								   param={param}
								   clearHistory={this.clearHistory }
								   searchKeyWord={this.searchSubmit }/>
					<SearchKeyWord type="hotWord"
								   data={ hotList }
								   param={param}
								   searchKeyWord={this.searchSubmit }/>
				</div>
			}
			<PopupTip active={ prompt.show } msg={ prompt.msg } onClose={ promptClose }/>
		</div>
	}
}


//搜索关键词
class SearchKeyWord extends Component {
	render() {
		const {type, data, searchKeyWord,param} = this.props;
		const title = {
			history: {text: "历史搜索", del: true},
			hotWord: {text: "热门搜索", del: false}
		};
		const html = ( data && data.length ) ? <div className="search-key">
			{ data.slice(0,10).map((item, i) => {
				return (
					<div className="grid-key" key={i} onClick={ searchKeyWord.bind( null, item.word, item.link,param ) }>
						<div className={item.active ? "red-btn" : "black-btn"}>
							<div>{item.word }</div>
						</div>
					</div>
				)
			})}
		</div> :
			<div className="no-history">暂无{title[type].text}</div>;
		return (
			<div className="search-key-list c-clrfix">
				<h3>
					<span>{ title[type].text }</span>
					{ title[type].del && <i className="delete-box-icon" onTouchTap={ this.props.clearHistory }> </i> }
				</h3>
				{html}
			</div>
		)
	}
}

//结果条
class ResultStrip extends Component {
	render() {
		return (
			<div className="list-one c-clrfix" onClick={  ()=>this.props.keyHandle( this.props.text ) }>
				<div className="c-fl c-dpb grid-left">{this.props.text}</div>
			</div>
		)
	}
}

function searchIndexState(state, props) {
	return {...state.qygSearch }
}

function searchIndexDispatch(dispatch, props) {
	return {
		dispatch,
		//提示框关闭
		promptClose: () => {
			dispatch(createActions('ctrlPrompt', {prompt: {show: false, msg: ""}}));
		},
		initialPage(){
			try {
				let history = window.localStorage.getItem("qygSearchHistory");
				if (history) {
					history = JSON.parse(history);
					dispatch(createActions('historyCtrl', {history: history}));
				}
			} catch (e) {
				console.error(error);
			}
		},
		updateHot(){
			dispatch(axiosActions('updateHot', pageApi.hot));
		},
		searchCompletion(key){
			dispatch(axiosActions('searchCpt', {...pageApi.completion, params: {keyword: key}}, key));
		}
	}
}


export default connect(searchIndexState, searchIndexDispatch)(SearchIndex);