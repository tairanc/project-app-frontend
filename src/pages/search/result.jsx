import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Link,browserHistory } from 'react-router';
import { SearchBarA, LoadingRound, Shady } from 'component/common';
import {actionAxios, concatPageAndType} from 'js/actions/actions';
import { DropDownLoad } from 'component/HOC';
import {PopupTip} from 'component/modal';
import axios from 'axios';
import Immutable from 'immutable';
import  './search.scss';
import echo from 'plugin/echo';
import {RNDomain} from 'src/config/index'

const createActions = concatPageAndType('searchResult');
const searchActions = concatPageAndType('searchIndex');
const qygSearchActions = concatPageAndType('qygSearch');

const pageApi = {
	search:{ url:"/newapi/search" , method:"post"}
};

let CancelToken = axios.CancelToken;
let cancel;

const navDataA =[
	{
		text:"综合",
		icon:false,
		status:"",
		direct:""
	},
	{
		text:"销量",
		icon:false,
		status:"sell_count",
		direct:"desc"
	},
	{
		text:"新品",
		icon:false,
		status:"shelved_at",
		direct:" desc"
	},
	{
		text:"价格",
		icon:true,
		status:"price",
		direct:"asc",
		origIcon:"arrow-tb-icon",
		sort:true,
		ascIcon:"arrow-tr-bg-icon",
		desIcon:"arrow-tg-br-icon"
	}
];

//state数据到请求数据
function stateToSearch( searchData, priceArr, preProperty, couponId, searchType, shop ) {
	searchData = Immutable.fromJS(  searchData ).toJS();
	searchData.orderBy = searchData.orderBy.type +":"+ searchData.orderBy.direct;
	searchData.brand = searchData.brand.join(",");
	searchData.category = searchData.category.join(",");
	let properties = [];
	let keys = Object.keys( searchData.properties );
	keys.forEach( ( id )=>{
		properties = properties.concat( searchData.properties[id]);
	});
	if( preProperty.length ){
		properties = properties.concat( preProperty );
	}
	searchData.properties = properties;

	if( couponId ){
		searchData.coupon_id = couponId;
	}

	if( shop ){
		searchData.shop = shop;
	}
	if( searchType ){
		searchData.searchType = searchType;
	}

	if( searchData.priceRange.id ){
		priceArr.some( ( item )=>{
			if( item.id === searchData.priceRange.id ){
				searchData.priceRange = item.begin + ":" + item.end;
				return true;
			}
			return false;
		});
	}else if( searchData.priceRange.min ==="" && searchData.priceRange.max ==="" ){
		searchData.priceRange = "";
	}else{
		searchData.priceRange = searchData.priceRange.min +":" + searchData.priceRange.max;
	}

	return searchData;
}

//价格处理
function filterPrice( searchData ){
	searchData = Immutable.fromJS( searchData ).toJS();
	if(  searchData.priceRange.id ) {
		return searchData;
	}
	let { min, max } = searchData.priceRange;
	if( min !== "" ){
		if( max !== "" ){
			if( min > max ){
				searchData.priceRange.min = max;
				searchData.priceRange.max = min;
			}
		}else{
			searchData.priceRange.min = 0;
			searchData.priceRange.max = min;
		}
	}else{
		if( max !=="" ){
			searchData.priceRange.min = 0;
		}
	}
	searchData.pages = 1;
	return  searchData;
}

export class SearchResult extends Component {
	constructor(props, context ){
		super(props);
		if(!props.storeHomeRequest){
			document.title="搜索结果";
			if( context.isApp ) window.location.href = "jsbridge://set_title?title=搜索结果";
		}
	}
	static contextTypes={
		isApp:React.PropTypes.bool
	};
	componentWillMount() {
		if( this.props.from ==="item"&&!this.props.storeHomeRequest ){
			this.props.dispatch( createActions('setFrom',{ from:"" }));
			return;
		}
		this.props.initialPage();
	}

	componentDidMount() {
		echo.init({ offset: $(window).height(), throttle: 0 });
		let scrollT = 0;
		let pageTop = $(this.refs.pageTop);
		this.filterScroll = function(){
			let top = $(window).scrollTop();
			if( pageTop.height() >100 && top > pageTop.height()-46 && top - scrollT >= 2 ){
				pageTop.addClass("active");
			}
			if( top - scrollT <= -2 ){
				pageTop.removeClass("active");
			}
			scrollT = top;
		};
		$(window).on('scroll',this.filterScroll );
	}

	componentDidUpdate() {
		echo.init({ offset: $(window).height(), throttle: 0 });
	}

	componentWillUnmount(){
		$(window).unbind('scroll',this.filterScroll );
		this.props.saveDisTop();
	}

	dropDown=( me )=>{
		let { searchData, dispatch, totalPage, priceArr, preProperty, couponId, searchType, shop, listLoad,dataList } = this.props;
		if( listLoad || !dataList || searchData.pages >= totalPage  ){
			me.lock();
			me.noData();
			me.resetload();
			return;
		}
		searchData = Immutable.fromJS( searchData ).toJS();
		searchData.pages += 1;
		if( cancel )  cancel('cancel Success');
		axios.request({ ...pageApi.search,
			data: JSON.stringify( stateToSearch( searchData, priceArr, preProperty, couponId, searchType, shop ) ),
			cancelToken: new CancelToken(function executor(c) {
				cancel = c;
			})
		}).then( result =>{
			if( !result.data.status ){
				dispatch( createActions('ctrlPrompt',{ prompt:{ show:true, msg: result.data.msg } }) );
				me.lock();
				me.noData();
				me.resetload();
				return;
			}
			dispatch( createActions('concatData',{ result: result.data }));
			me.resetload();
			let { pagers } = result.data.data;
			if( pagers.current >= pagers.total ){
				me.lock();
				me.noData();
				me.resetload();
			}
		}).catch( error =>{
			console.error( error );
			me.resetload();
		})
	};

	//搜索排序切换
	navClick =( type, direct )=>{
		let { dispatch,searchData } = this.props;
		let { orderBy } = searchData;
		if( type === orderBy.type ){
			if( type === "price" ){
				dispatch( createActions('sortOrder', { navType:type, direct: orderBy.direct==="asc"?"desc":"asc" } ));
			}else{
				return false;
			}
		}else{
			dispatch( createActions('sortOrder', { navType:type, direct: direct } ));
		}
		setTimeout( ()=>{
			this.updateResult();
		},0);
	};

	//商品类型切换
	itemTypeChg=( type )=>{
		this.props.dispatch( createActions('itemType', { itemType: type } ));
		setTimeout( ()=>{
			this.updateResult();
		},0)
	};

	//下弹出列表
	dropTypeChg=( type )=>{
		if( type === this.props.dropType ){
			this.updateResult();
		}
		this.props.dispatch( createActions('dropType', { dropType: type } ));
	};

	//下拉列表元素选择
	filterSelect=( type, elem )=>{
		let { searchData, dispatch } = this.props;
		let data = searchData[type];
		let index = data.indexOf( elem[type+"_id"] );
		if( index > -1 ){
			data.splice( index, 1 );
		}else{
			data.push( elem[type+"_id"] );
		}
		dispatch( createActions('filterSelect',{ filterType:type, data: data }));
	};

	//下拉列表重置
	selectReset=( type )=>{
		this.props.dispatch( createActions('filterSelectReset',{ filterType: type }));
	};

	//下拉页面确定
	selectSure =()=>{
		this.props.dispatch(  createActions('dropType',{ dropType:""} ));
		this.updateResult();
	};

	//筛选弹出窗
	filterPopup=()=>{
		if( this.props.dropProperty ){
			this.updateResult();
		}
		this.props.dispatch( createActions('filterPopupCtrl'));
	};

	updateResult = () => {
		let {dispatch, searchData, priceRange, preProperty,couponId, searchType, shop } = this.props;

		searchData = filterPrice( searchData );

		dispatch( createActions('resetSearchData',{ data: searchData }) );

		dispatch(createActions('resetSearchList'));

		if (cancel) cancel('cancel Success');
		axios.request({
			...pageApi.search,
			data: JSON.stringify( stateToSearch( searchData, priceRange, preProperty, couponId, searchType, shop )),
			cancelToken: new CancelToken(function executor(c) {
				cancel = c;
			})
		}).then(result => {
			dispatch(createActions('initData', {result: result.data}));
		}).catch( error =>{
			console.error( error );
		})
	};

	toItem=( url )=>{
		this.props.dispatch( createActions('setFrom',{ from:"item" }));
		// browserHistory.push( url );
		location.href=url;
	};

	preventScroll( status ){
		if( status ){
			$("html,body").css({ height:"100%",overflowY:"hidden" })
		}else{
			$("html,body").css({ height:"", overflowY:"" })
		}
	}

	searchBarFocus=()=>{
		if( this.props.searchType === "biz"){
			this.props.dispatch( qygSearchActions('keyCtrl',{ key: this.props.keyWord }));
			browserHistory.replace( '/qygSearch');
		}else{
			this.props.dispatch( searchActions('keyCtrl',{ key: this.props.keyWord }));
			browserHistory.replace( '/search');
		}

	};

	searchBarSearch=()=>{
		let { keyWord, dispatch, searchType } = this.props;
		if( keyWord ===""){
			dispatch( createActions('ctrlPrompt',{ prompt:{ show:true, msg:"请输入搜索词"  } }) );
			return;
		}
		if( searchType === "biz"){
			browserHistory.replace(`/searchResult?key=${ encodeURIComponent(keyWord) }&type=biz`);
		}else{
			browserHistory.replace(`/searchResult?key=${ encodeURIComponent(keyWord) }`);
		}
		dispatch( createActions('resetState', { keyWord: keyWord,searchType: searchType } ) );
		if( cancel )  cancel('cancel Success');
		axios.request({
			...pageApi.search,
			data: JSON.stringify({ search_keywords:keyWord,searchType: searchType }),
			cancelToken: new CancelToken(function executor(c) {
				cancel = c;
			})
		}).then( result =>{
			dispatch( createActions('initData',{ result: result.data } ));
		}).catch( error =>{
			console.error( error );
		})
	};

	render(){
		let { dataList,category, property, brands, searchData,dropType, dropProperty, storeHomeRequest } = this.props;
		let {storeHome} = this.props.location.query;
		return (
			<div data-page="search-page" id="searchResult">
				<div className="list-filter-ctrl" ref="pageTop">
					{(!storeHomeRequest)?<div style={{borderBottom:"1px solid #e4e4e4"}}>
						<SearchBarA value={ this.props.keyWord }
									onChange={ e=>{} }
									onFocus={ this.searchBarFocus }
									onSearch={ this.searchBarSearch } />
					</div>:""}
					{ (!this.props.load && this.props.property )?
						<div className="list-filter-a-wrap">
							<ListFilterACtrl searchData={ searchData }
											 brands={ brands }
											 dropProperty={ dropProperty }
											 category={ category }
											 property={ property }
											 filterSelect={ this.filterSelect }
											 filterPopup={ this.filterPopup }
											 updateResult={ this.updateResult }
											 navClick={ this.navClick }
											 storeHomeRequest={storeHomeRequest}
											 storeHome={storeHome} />
						</div>:"" }
					{ ( !this.props.load && category && !storeHomeRequest && !storeHome  ) ? <ListFilterB searchData={ searchData }
																										  brands={ brands }
																										  category={ category }
																										  dropType={ this.props.dropType }
																										  selectSure={ this.selectSure }
																										  selectReset={ this.selectReset }
																										  filterSelect={ this.filterSelect }
																										  itemTypeChg={ this.itemTypeChg }
																										  dropTypeChg={ this.dropTypeChg } /> :"" }
				</div>
				<div className="item-list" ref="list">
					{ this.props.load ? <LoadingRound /> :
						( !this.props.listLoad ?
								<ListInfoCtrl data={ dataList }
											  category={ category }
											  dropDown={ this.dropDown }
											  toItem={ this.toItem }
											  correct={ this.props.correction }
											  keyWord={ this.props.keyWord } /> :
								<LoadingRound />
						)
					}
				</div>
				<PopupTip active={ this.props.prompt.show } msg={ this.props.prompt.msg } onClose={ this.props.promptClose }/>
				{ ( dropType || dropProperty ) ?
					this.preventScroll( true ): this.preventScroll( false )
				}
			</div>
		)
	}
}


//列表内容控制
export class ListInfoCtrl extends Component{
	render(){
		const { data, category } = this.props;
		return(
			<div className="list-center" ref="itemList">
				{ ( data && data.length ) ?
					<DropDownList data={data}
								  scrollArea={window}
								  toItem={ this.props.toItem }
								  dropDown={this.props.dropDown }
								  correct={this.props.correct }
								  keyWord={ this.props.keyWord } />:
					( category.length ?
							<FilterNone /> :
							<SearchNone />
					)
				}

			</div>
		)
	}
}

//内容列表
class ListInfo extends Component{
	getHtml(){
		return this.props.data.map( (item,i)=>{
			return <OneItem key={i} data={item} toItem={ this.props.toItem }/>
		});
	}
	render(){
		const { correct,keyWord } = this.props;
		return(
			<div className="list-main">
				{ correct !== null && <div className="list-tip">
					<p>没找到“<span className="c-cdred">{keyWord}</span>”相关商品，已为您推荐“<span className="c-cdred">{ correct }</span>”相关商品</p>
				</div>}
				<div className="list-detail c-clrfix">
					{ this.getHtml() }
				</div>
			</div>
		)
	}
}

const DropDownList = DropDownLoad(ListInfo);

//一个商品
class OneItem extends Component{
	render(){
		let { H5_pic,group_type,item_id,sell_price,support_ecard,market_price,trade_type, primary_image, installment,title,promotionDetail,activity_price,activity_store,store,valid } = this.props.data;
		let saleOut = null;
		activity_store !== undefined ?  saleOut = activity_store<=0 : saleOut = store <=0;
		if( !valid  ) saleOut = true;
		return(
			<div className="one-item-grid">
				<div className="one-item"   onClick={ this.props.toItem.bind( null,RNDomain + `/item?item_id=${item_id}`) }>
					<div className="item-img c-pr">
						{H5_pic?<img className="c-pa" style={{width:'60px',top:0,left:0}} src={H5_pic} />:(group_type === "ROOKIE_GROUP" ?
							<img className="c-pa new-img"
								 src="/src/img/activity/new-group.png"/> : "")}
						<img data-echo={primary_image+"_m.jpg"} src="/src/img/icon/loading/default-watermark.png" />
						{ saleOut ?<div className="float-label">
							<img src="/src/img/search/sale-out-big.png" />
						</div> :""}
					</div>
					<div className="item-title c-mt10">
						{ ( trade_type==="Direct" || trade_type==="Overseas") && <span className="label yellow-label">海外直邮</span>}
						{trade_type==="Bonded" && <span className="label blue-label">跨境保税</span> }
						{title}
					</div>
					<div className="item-price c-mt5">
						<span>¥{ activity_price?(+activity_price).toFixed(2):(+sell_price).toFixed(2) }</span>{support_ecard?<img src="/src/img/common/support-e-card.png" />:""}
						{installment?<span className="c-cfff stage-sign">分期</span>:""}
					</div>
					<div className="item-promotion">
						{ promotionDetail && <span className="promotion-label">{promotionDetail.join(" | ")}</span>}
					</div>
				</div>
			</div>
		)
	}
}


//列表导航A控制
export class ListFilterACtrl extends Component{
	render(){
		return(
			<div className="list-filter-a">
				<div className="list-nav-a-grid" ref="sortNav" >
					<ListFilterA   {...this.props}
						navData={ navDataA }
						filter={ this.props.dropProperty }
						filterPopup={ this.props.filterPopup }
						navClick={ this.props.navClick } />
					{ this.props.dropProperty && <ListFilterConnect  filterSelect={ this.props.filterSelect }
																	 updateResult={ this.props.updateResult }/> }
				</div>
			</div>

		)
	}
}

//列表导航A
export class ListFilterA extends Component{
	getHtml=()=>{
		let { searchData } = this.props;
		return this.props.navData.map((item,i)=>{
			return (
				<div key={item.text}
					 className={"g-col-1 nav-click"}
					 onClick={ this.props.navClick.bind( null, item.status, item.direct ) }>
					<span className={`nav-span ${ searchData.orderBy.type === item.status?"active":""}`}>
						<span>{item.text}</span>
						{item.icon && <i className={ searchData.orderBy.type === item.status ?
							( item.sort ? ( searchData.orderBy.direct==="asc"?item.ascIcon:item.desIcon):item.activeIcon )
							:item.origIcon}> </i> }
					</span>
				</div>
			)
		});
	};
	render(){
		let {storeHomeRequest,storeHome} = this.props;
		return(
			<div className="list-nav-a g-row-flex c-tc">
				<div className="grid-left g-row-flex g-col-1">
					{ this.getHtml() }
				</div>
				{(storeHomeRequest||storeHome)?"":(
					<div className="grid-right">
						<div className="nav-click" onClick={ this.props.filterPopup } >
						<span className={`nav-span${this.props.filter?" active":""}`}>
							<span>筛选</span>
						<i className={ this.props.filter?"filter-red-icon":"filter-grey-icon"}> </i>
						</span>
						</div>
					</div>
				)}
			</div>
		)
	}
}

//列表搜索B
export class ListFilterB extends Component{
	concatBrands=()=>{
		let { brands, searchData } = this.props;
		return searchData.brand.map( ( id, i)=>{
			let name="";
			brands.some(( item, j )=>{
				if( item.brand_id === id ){
					name = item.name;
					return true;
				}
				return false;
			});
			return name;
		}).join(",")
	};

	concatCategory=()=>{
		let { category, searchData } = this.props;
		return searchData.category.map( ( id, i)=>{
			let name="";
			category.some(( item, j )=>{
				if( item.category_id === id ){
					name = item.name;
					return true;
				}
				return false;
			});
			return name;
		}).join(",")
	};

	render(){
		const { searchData, brands, category, dropType } = this.props;
		let { self, promotion } = searchData;
		return(
			<div className="list-nav-b-grid">
				<div className="list-nav-b g-row-flex" ref="navB" >
					<div className={`nav-one g-col-1 btn ${ self ?"active":""}`}
						 onClick={ this.props.itemTypeChg.bind( null,"self")  } >
						<div className="nav-one-next">
							{ self && <i className="red-current-icon"> </i>}<span>自营</span>
						</div>
					</div>
					<div className={`nav-one g-col-1 btn ${ promotion ?"active":""}`}
						 onClick={ this.props.itemTypeChg.bind( null,"promotion") }>
						<div className="nav-one-next">
							{ promotion && <i className="red-current-icon"> </i>}<span>促销</span>
						</div>
					</div>
					<div className={`nav-one g-col-1 dropDown ${ dropType==="brand"?"down":( searchData.brand.length?"active":"")}`}
						 onClick={ this.props.dropTypeChg.bind( null,"brand") } >
						<div className="nav-one-next">
							<span>{( searchData.brand.length && dropType!=="brand")? this.concatBrands() :"品牌"}</span>
							{(dropType==="brand")? <i className="arrow-top-m-icon"> </i>:( !searchData.brand.length ? <i className="arrow-btm-m-icon"> </i>:"")}
						</div>
					</div>
					<div className={`nav-one g-col-1 dropDown ${ dropType==="category"?"down":( searchData.category.length ? "active":"")}`}
						 onClick={ this.props.dropTypeChg.bind( null, "category")  } >
						<div className="nav-one-next">
							<span>{( searchData.category.length && dropType!=="category") ? this.concatCategory():"分类"}</span>
							{(dropType==="category")?<i className="arrow-top-m-icon"> </i>:( !searchData.category.length? <i className="arrow-btm-m-icon"> </i>:"")}
						</div>
					</div>
				</div>
				{dropType? <ListChoose data={ dropType==="brand"? brands:category }
									   type={dropType}
									   searchData={ searchData }
									   filterSelect={ this.props.filterSelect }
									   selectReset={ this.props.selectReset }
									   selectSure={ this.props.selectSure }
									   onBtnStatus={this.dropDownHandle }/>:""}
				{dropType? <Shady options={{zIndex:-2}} />:""}
			</div>
		)
	}
}


//弹出列表筛选
export class ListFilter extends Component{
	componentDidMount() {
		const dom = $(this.refs.main);
		dom.css({ height: $(window).height() - dom.offset().top + $(window).scrollTop() });
	}
	componentWillUnmount(){
	}
	render(){
		return(
			<div className="list-pop-select" ref="main" >
				<ListFilterMain {...this.props} ref="filter" />
				<ListFilterBtm allSelectReset={ this.props.allSelectReset } allSelectSure={ this.props.allSelectSure } />
			</div>
		)
	}
}

function listFilterState( state ) {
	let { property, listType, searchData } = state.searchResult;
	return {
		data: property,
		listType,
		searchData,
	}
}

function listFilterDispatch( dispatch, props ) {
	return {
		listTypeChg( type ){
			dispatch( createActions('listType',{ listType: type }))
		},
		propertyFilter( id, data ){
			dispatch( createActions('filterProperty',{ id, data }))
		},
		allSelectReset(){
			dispatch( createActions('allSelectReset'))
		},
		allSelectSure(){
			dispatch( createActions('filterPopupCtrl') );
			props.updateResult();
		},
		priceRangeSelect( id ){
			dispatch( createActions('priceSelect',{ id: id }) )
		},
		minPrice:( e )=>{
			dispatch( createActions('minPrice', { value:e.target.value }));
		},
		maxPrice:( e )=>{
			dispatch( createActions('maxPrice', { value:e.target.value }));
		}
	}
}

const ListFilterConnect = connect( listFilterState, listFilterDispatch )( ListFilter );

//弹出列表筛选 main
export class ListFilterMain extends Component{

	componentDidMount() {
		this.listLeft = new IScroll( this.refs.listLeft,{ click:true });
		this.listRight = new IScroll( this.refs.listRight,{ click:true } );
		$(window).trigger("resize");
	}

	componentDidUpdate(){
		this.listRight.refresh();
	}
	hasChosen=( id )=>{
		let { searchData } = this.props;
		switch(id){
			case 'brand':
			case 'category':
				if( searchData[id].length ){
					return true;
				}
				return false;
			case 'price':
				if( searchData.priceRange.min || searchData.priceRange.max || searchData.priceRange.id ){
					return true;
				}
				return false;
			default:
				if( searchData.properties[id] && searchData.properties[id].length ){
					return true;
				}else{
					return false;
				}
		}
		return false;
	};

	getListLeft=()=>{
		let { listType, data } = this.props;
		return data.length && data.map( (item,i)=>{
				return <div className={`list-text ${item.id === listType ?"active":""}`}
							key={i}
							onClick={ this.props.listTypeChg.bind( null, item.id ) }>
					<span>{ item.name }</span> { this.hasChosen( item.id ) && <i className="red-current-icon"> </i> }
				</div>
			})
	};

	getListRight=()=>{
		let { listType, data, searchData } = this.props;
		let listData, result;
		for( let i=0, li; li=data[i++];){
			if( li.id === listType ){
				listData = li;
				break;
			}
		}
		switch ( listType ){
			case "brand":
				result = listData ? listData.list.map( (item,j)=>{
					return <div key={j}
								className={`list-text ${ searchData[listType].indexOf( item[listType+"_id"]) > -1?"active":"" }`}
								onClick={ this.props.filterSelect.bind( null, listType,item  ) } >
						<span>{ item.name }</span>
						{ searchData[listType].indexOf( item[listType+"_id"]) > -1 && <i className="red-current-icon"> </i>}
					</div>
				}):"";
				break;
			case "price":
				result = <div className="range-price" >
					<h4>价格区间</h4>
					<div className="input-price">
						<input ref="min" type="number"
							   min="0" max="999999" step="1"
							   placeholder="最低价格"
							   value={ searchData.priceRange.min }
							   onChange={ this.props.minPrice }/>
						<span>—</span>
						<input ref="max" type="number"
							   min="0" max="999999" step="1"
							   placeholder="最高价格"
							   value={ searchData.priceRange.max }
							   onChange={ this.props.maxPrice } />
					</div>
					{
						listData ? listData.list.map( (item,j)=>{
							return <div key={j}
										className={`list-text ${ searchData.priceRange.id === item.id?"active":""} `}
										onClick={ this.props.priceRangeSelect.bind( null, item.id ) } >
								<span>{item.begin}-{ item.end}</span>
								{  searchData.priceRange.id === item.id && <i className="red-current-icon"> </i> }
							</div>
						}):""
					}
				</div>;
				break;
			case 'category':
				result = listData ? listData.list.map((item,j)=>{
					return <div key={j}
								className={`list-text ${ searchData[listType].indexOf( item[listType+"_id"]) > -1?"active":"" }`}
								onClick={ this.props.filterSelect.bind( null, listType,item  ) }>
						<span>{item.name}</span>
						{ searchData[listType].indexOf( item[listType+"_id"]) > -1 && <i className="red-current-icon"> </i>}
					</div>
				}):"";
				break;
			default:
				result = listData ? listData.list.map( (item,j)=>{
					return<div key={j}
							   className={`list-text ${ searchData.properties[listType].indexOf( item.property_value_id ) > -1 ?"active":"" }`}
							   onClick={ this.props.propertyFilter.bind( null, listType, item ) }    >
						<span>{item.text}</span>
						{ searchData.properties[listType].indexOf( item.property_value_id ) > -1 && <i className="red-current-icon"> </i>}
					</div>
				}):"";
		}
		return result;
	}

	render(){
		return(
			<div className="list-pop-main g-row-flex"  >
				<div className="list-left-grid" ref="listLeft">
					<div className="list-left" >
						{ this.getListLeft() }
					</div>
				</div>
				<div className="list-right-grid g-col-1" ref="listRight" >
					<div className="list-right">
						{ this.getListRight() }
					</div>
				</div>
			</div>
		)
	}
}


//弹出列表筛选 底部
export class ListFilterBtm extends Component{
	render(){
		return(
			<div className="list-pop-btm g-row-flex">
				<div className="c-fs12 total-num" >
					{/*	有<span className="c-cdred">360</span>件商品*/}
				</div>
				<div className="grey-btn c-bge4 g-col-1" onClick={ this.props.allSelectReset } >重置</div>
				<div className="dred-btn c-bgdred c-cfff g-col-1" onClick={ this.props.allSelectSure  } >确定</div>
			</div>
		)
	}
}

//弹出选择列表
export class ListChoose extends Component{
	getHtml(){
		let { data, searchData, type } = this.props;
		return data.map( (item,i)=>{
			let active = searchData[type].indexOf( item[type+"_id"] ) > -1;
			return (
				<div className="choose-one" key={i} >
					<div className={`choose-span ${active?"active":"" }`} onClick={ this.props.filterSelect.bind( null, type, item )}>
						<span>{item.name}</span>{active && <i className="red-current-icon"> </i> }
					</div>
				</div>
			);
		});
	}
	render(){
		return(
			<div className="list-choose" >
				<div className="list-choose-main c-clrfix" >
					{ this.getHtml() }
				</div>
				<div className="choose-ctrl g-row-flex">
					<div className="grey-btn c-bge4 g-col-1" onClick={ this.props.selectReset.bind( null, this.props.type)  }>
						重置
					</div>
					<div className="dred-btn c-bgdred c-cfff g-col-1" onClick={ this.props.selectSure } >
						确定
					</div>
				</div>
			</div>
		)
	}
}

//没有搜索结果
const SearchNone =()=>{
	return(
		<div className="c-tc" style={{paddingTop:"80px"}}>
			<img src="/src/img/search/search-none.png" width="58" height="56" />
			<p className="c-fs14 c-mt10">抱歉，暂无相关商品</p>
			<p className="c-cc9">换个关键词试试吧~</p>
		</div>
	)
};

//没有筛选结果
const FilterNone =()=>{
	return(
		<div className="c-tc" style={{paddingTop:"80px"}}>
			<img src="/src/img/search/search-none.png" width="58" height="56" />
			<p className="c-fs14 c-mt10">没有相关商品</p>
		</div>
	)
};



export function searchResultState( state ) {
	return { ...state.searchResult }
}

export function searchResultDispatch( dispatch, props ) {
	let { key,coupon_id, brand, category, property, order,type,shop } = props.location.query;
	let {shop_attr,storeHomeRequest} = props;
	key = key!==undefined ? decodeURIComponent(key):"";
	let searchData = {
		search_keywords: key,
		coupon_id: coupon_id !== undefined ? coupon_id : "",
		shop:shop !== undefined ? shop: "",
		brand: brand !== undefined ? brand.split(",").map( ( item,i )=> Number(item) ).join(",") : "",
		category : category !== undefined ? Number(category) : "",
		properties: property !== undefined ? property.split(",").map( ( item,i )=> Number(item) ):"",
		orderBy: order !== undefined ? order :"",
		searchType: (storeHomeRequest&&shop_attr)?shop_attr:(type !== undefined ?type:"")
	};

	return {
		dispatch,
		//提示框关闭
		promptClose: () => {
			dispatch(createActions('ctrlPrompt', {prompt: {show: false, msg: ""}}));
		},
		initialPage(){
			dispatch( createActions('resetState', { keyWord: key,searchType: type } ) );
			dispatch( createActions('initSearch',{ searchData: searchData }));
			axios.request({
				...pageApi.search,
				data: JSON.stringify(searchData),
				cancelToken: new CancelToken(function executor(c) {
					cancel = c;
				})
			}).then( result =>{
				dispatch( createActions('initData',{ result: result.data } ));
			}).catch( error =>{
				console.error( error );
			});
		},
		saveDisTop() {
			dispatch(createActions('saveTop', {value: $(window).scrollTop()}) );
		},

	}
}



export default connect( searchResultState, searchResultDispatch )( SearchResult );