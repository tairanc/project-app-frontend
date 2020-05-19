import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as api from '../../api/api';
import * as apiTest from '../../api/test';
import { SearchBarA, LoadingRound, Shady, SearchNone, FilterNone, NetError } from 'component/common';
import { actionAxios, concatPageAndType } from 'js/actions/actions';
import { DropDownLoad } from 'component/HOC';
import { tip } from 'component/module/popup/tip/tip';
import Immutable from 'immutable';
import './search3.scss';
import echo from 'plugin/echo';
import { scrollTo } from 'js/util/index';
import {RNDomain} from 'src/config/index'


const createActions = concatPageAndType('searchResult3');
const searchActions = concatPageAndType('searchIndex');
const qygSearchActions = concatPageAndType('qygSearch');

const currentApi = api;

const apiToUrl = {
    search_keywords: 'key',
    coupon_id: 'coupon_id',
    shop: 'shop',
    brand: 'brand',
    category: 'category',
    properties: 'property',
    order_by: 'order',
    search_type: 'type',
    price_range: 'price',
    service: 'service',
    page: 'page',
    country_id: 'country_id',
    promotion_id: 'promotion_id'
};
const urlToApi = {
    key: 'search_keywords',
    coupon_id: 'coupon_id',
    shop: 'shop',
    brand: 'brand',
    category: 'category',
    property: 'properties',
    order: 'order_by',
    type: 'search_type',
    price: 'price_range',
    service: 'service',
    page: 'page'
};
class SearchResult extends Component {

    constructor(props, context) {
        super(props);
        if (!props.storeHomeRequest) {
            document.title = "搜索结果";
        }
        this.state = {
            topButtonState: false
        };
    }
    componentWillMount() {
        this.props.setFilterUpdate(false);
        //若是从详情页返回的，不去请求接口，保留原数据
        if (this.props.from == 'item') {
            this.props.setFrom('');
            // return;
        }
        //将地址中的参数传入搜索条件，进行搜索条件初始化
        let { key, coupon_id, brand, category, property, order, type, shop, price, service, country_id, promotion_id } = this.props.location.query;
        let { shop_attr, storeHomeRequest } = this.props;
        key = key !== undefined ? decodeURIComponent(key) : "";
        let searchData = {
            search_keywords: key,
            coupon_id: coupon_id !== undefined ? coupon_id : "",
            shop: shop !== undefined ? shop : "",
            brand: brand !== undefined ? brand : "",
            category: category !== undefined ? Number(category) : "",
            properties: property !== undefined ? property : "",
            order_by: order !== undefined ? order : "",
            search_type: (storeHomeRequest && shop_attr) ? shop_attr : (type !== undefined ? type : ""),
            price_range: price !== undefined ? price : "",
            service: service !== undefined ? this.formatSearchData(service) : "",
            page: 1,
            country_id: country_id !== undefined ? Number(country_id) : '',
            promotion_id: promotion_id !== undefined ? promotion_id : ''
        };
        this.props.dispatch(createActions('setSearch', { searchData: searchData }));
    }
    componentWillReceiveProps(nextProps) {
        //当且仅当搜索条件发生变化时进行搜索
        if (this.props.searchData !== nextProps.searchData) {
            let data = Object.assign({}, nextProps.searchData, { search_keywords: nextProps.correction || nextProps.searchData.search_keywords }),
                init = nextProps.init,
                filterUpdate = this.props.filterUpdate;
            this.changeUrl(nextProps.searchData);
            this.props.setData(data, init, filterUpdate);
        }
    }
    componentDidMount() {
        let that = this;
        let windowHeight = Math.max(this.props.windowHeight, $(window).height());
        $(window).scroll(function () {
            let scrollTop = $(window).scrollTop();
            let oldState = that.state.topButtonState;
            let newState = scrollTop > windowHeight;
            if (oldState !== newState) {
                that.setState({ topButtonState: scrollTop > windowHeight });
            }
        });
        if (this.props.windowHeight < $(window).height()) {
            this.props.setWindowHeight($(window).height());
        }
    }
    componentDidUpdate() {
        //组件每次更新时都进行一次懒加载初始化
        echo.init({ offset: $(window).height(), throttle: 1000 });
    }
    componentWillUnmount() {
        this.props.setFilterUpdate(true);
        $("body").css(
            {
                overflowY: "",
                position: "static"
            }
        );
        this.props.setCorrection('');
        $(window).unbind('scroll');
    }
    changeUrl(searchData) {
        let searchStr = "";
        let href = location.href.split('?')[0];
        for (let key in searchData) {
            if (searchData.hasOwnProperty(key)) {
                if (searchData[key]) {
                    searchStr += "&" + apiToUrl[key] + "=" + (key == 'service' ? this.formatSearchData(searchData[key]) : searchData[key]);
                }
            }
        }
        history.replaceState({}, null, href + "?" + searchStr.substr(1));
    }
    formatSearchData(data) {
        let str = "";
        let obj = {};
        if (typeof data == 'object') {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    str += data[key] ? key + "," : ""
                }
            }
            return str.substr(0, str.length - 1);
        } else if (typeof data == 'string') {
            let array = data.split(',');
            for (let i = 0; i < array.length; i++) {
                obj[array[i]] = 1;
            }
            return obj;
        }
    }
    dropDown(me) {
        //用于dropLoad插件的dropDown方法，翻页时调用
        let { searchData, dispatch, currentPage, totalPage, load, goodsList, correction } = this.props;
        if (!load || !goodsList || currentPage >= totalPage) {
            me.lock();
            me.noData();
            me.resetload();
            return;
        }
        searchData = Immutable.fromJS(searchData).toJS();
        searchData.search_keywords = correction || searchData.search_keywords;
        searchData.page = currentPage + 1;
        currentApi.search(searchData).then(result => {
            if (result.data.code !== 0) {
                me.lock();
                me.noData();
                me.resetload();
                return;
            }
            dispatch(createActions('concatData', { result: result.data }));
            dispatch(createActions('setCurrentPage', { current: currentPage + 1 }));
            me.resetload();
            let { page } = result.data.data;
            if (page.current_page >= page.total_page) {
                me.lock();
                me.noData();
                me.resetload();
            }
        }).catch(error => {
            console.error(error);
            me.resetload();
        })
    }
    render() {
        let { errorState, load, init, categoriesLevelList, goodsList, listStyle, setFrom, setGoodHeight, goodHeight,
            correction, coupon, searchData, storeHomeRequest, setFilterState, filterState, promotion } = this.props;
        return (
            init ? (
                <div id="searchResult" data-page="search-page3" style={{ 'minHeight': this.props.windowHeight }}>
                    <SearchFilter {...this.props} />
                    {!errorState && load && categoriesLevelList && categoriesLevelList.length > 0 && goodsList && goodsList.length > 0 ? <Prompt searchData={searchData} correction={correction} coupon={coupon} /> : ""}
                    {/*此处写的有问题，由于dropLoad插件初始化后整个商品列表的高度会随着商品样式的改变出现变化，故采用两个不同的商品列表组件去存储dropLoad插件*/}
                    {!errorState ? load ? (categoriesLevelList && categoriesLevelList.length) ? (goodsList && goodsList.length) ?
                        (listStyle == 1 ?
                                <GoodsList key="1" goodsList={goodsList} listStyle={listStyle} setFrom={setFrom} setGoodHeight={setGoodHeight} promotion={promotion}
                                           goodHeight={goodHeight} scrollArea={window} dropDown={this.dropDown.bind(this)} storeHomeRequest={storeHomeRequest} setFilterState={setFilterState} filterState={filterState} /> :
                                <GoodsList key="2" goodsList={goodsList} listStyle={listStyle} setFrom={setFrom} setGoodHeight={setGoodHeight} promotion={promotion}
                                           goodHeight={goodHeight} scrollArea={window} dropDown={this.dropDown.bind(this)} storeHomeRequest={storeHomeRequest} setFilterState={setFilterState} filterState={filterState} />
                        ) : <FilterNone /> : <SearchNone /> : <LoadingRound /> : <NetError />}
                    {this.state.topButtonState ? <JumpTopButton /> : ''}
                </div>
            ) : <LoadingRound />
        );
    }
}
//筛选条件组件，包括关键字筛选，排序筛选，高级筛选，快捷筛选
class SearchFilter extends Component {
    render() {
        //filterState 筛选条件展示状态，true为全展示，false为只展示快捷筛选
        let { dispatch, setSearch, setSearchService, setData, toggleQuickSelect, searchData, brandsList, brandsOrderList, categoriesList, categoriesLevelList, properties, service, listStyle, errorState, storeHomeRequest, isQuickSelect, filterState, setFilterState } = this.props;
        let keyWord = searchData.search_keywords;
        let searchType = searchData.search_type;
        let isFilter = !errorState && brandsList && brandsList.length && categoriesLevelList && categoriesLevelList.length;
        return (
            <div className={`filter-condition ${storeHomeRequest ? 'store-container' : ''} ${filterState ? '' : 'filter-reduce'}`} ref="filterCondition">
                {storeHomeRequest ? "" : <SearchInput ref="searchInput" dispatch={dispatch} keyWord={keyWord} searchData={searchData} searchType={searchType} listStyle={listStyle} toggleQuickSelect={toggleQuickSelect} filterState={filterState} setFilterState={setFilterState} />}
                {isFilter ? <OrderFilter setSearch={setSearch} searchData={searchData} toggleQuickSelect={toggleQuickSelect} /> : ""}
                {isFilter && !storeHomeRequest ? <AdvancedFilter setSearch={setSearch} searchData={searchData} setData={setData} toggleQuickSelect={toggleQuickSelect} brandsList={brandsList} brandsOrderList={brandsOrderList} categoriesList={categoriesList} categoriesLevelList={categoriesLevelList} properties={properties} service={service} /> : ""}
                {isFilter && !storeHomeRequest ? <QuickFilter setSearch={setSearch} setSearchService={setSearchService} setData={setData} toggleQuickSelect={toggleQuickSelect} searchData={searchData} brandsList={brandsList} categoriesList={categoriesList} isQuickSelect={isQuickSelect} /> : ""}
            </div>
        )
    }
}
//关键字筛选
class SearchInput extends Component {
    componentDidMount() {
        let that = this;
        const $searchInput = $(ReactDOM.findDOMNode(this.refs.searchInput)),
            inputHeight = $searchInput.height(),
            $orderFilter = $(".order-filter"),
            filterHeight = $orderFilter.height();
        this.currentTop = 0;
        this.currentScrollEvent = this.scrollControlFilter.bind(that, inputHeight, filterHeight);
        !this.props.storeHomeRequest && $(window).bind('scroll', that.currentScrollEvent);
    }
    scrollControlFilter(inputHeight, filterHeight) {
        let scrollTop = $(window).scrollTop();
        if (scrollTop - inputHeight - filterHeight >= 0) {
            if (scrollTop - this.currentTop >= 2) {
                this.props.filterState && this.props.setFilterState(false);
            } else if (scrollTop - this.currentTop <= -2) {
                this.props.filterState || this.props.setFilterState(true);
            }
        } else {
            this.props.filterState || this.props.setFilterState(true);
        }
        this.currentTop = scrollTop;
    }
    //根据搜索条件中搜索类型的不同决定跳普通搜索还是企业购搜索
    searchBarFocus = () => {
        this.props.toggleQuickSelect(false);
        if (this.props.searchType === "biz") {
            this.props.dispatch(qygSearchActions('keyCtrl', { key: this.props.keyWord }));
            this.props.dispatch(qygSearchActions('paramCtrl', { param: this.props.searchData }));
            browserHistory.replace('/qygSearch');
        } else {
            this.props.dispatch(searchActions('keyCtrl', { key: this.props.keyWord }));
            this.props.dispatch(searchActions('paramCtrl', { param: this.props.searchData }));
            browserHistory.replace('/search');
        }
    };
    //商品类型转换
    changeType = () => {
        let that = this;
        !that.props.storeHomeReques && $(window).unbind('scroll', that.currentScrollEvent);
        let style = this.props.listStyle == 1 ? 2 : 1;
        this.props.dispatch(createActions('changeListStyle', { style: style }));
        setTimeout(function () {
            !that.props.storeHomeReques && $(window).bind('scroll', that.currentScrollEvent);
        }, 0);
    };
    render() {
        return (
            <SearchBarA value={this.props.keyWord}
                        param={this.props.searchData}
                        onChange={e => { }}
                        onFocus={this.searchBarFocus}
                        changeType={this.changeType}
                        listStyle={this.props.listStyle}
            />
        )
    }
}
//排序筛选
class OrderFilter extends Component {
    constructor(props) {
        super(props);
        this.orderFilter = [
            { name: '综合', type: '' },
            { name: '销量', type: 'sell_count' },
            { name: '新品', type: 'shelved' },
            { name: '价格', type: 'price', orderControl: true }
        ];
        this.orderIcon = {
            normal: 'arrow-tb-icon',
            asc: 'arrow-tr-bg-icon',
            desc: 'arrow-tg-br-icon'
        }
    }
    //若搜索条件不变，则该组件无需更新
    shouldComponentUpdate(nextProps) {
        return this.props.searchData !== nextProps.searchData;
    }
    //排序条目点击事件 currentType：点击的条目类型，orderControl：点击条目是否可进行升降序筛选
    filterClick(currentType, orderControl) {
        let previousOrderBy = this.props.searchData.order_by;
        let previousType = previousOrderBy.split(':')[0];
        let previousOrder = previousOrderBy.split(':')[1];
        let flag = false;
        if (orderControl) {
            flag = currentType != previousType || previousOrder == 'desc';
        } else {
            if (currentType == previousType) {
                return;
            }
        }
        this.props.toggleQuickSelect(false);
        let currentOrder = flag ? 'asc' : 'desc';
        let currentOrderBy = currentType && (currentType + ':' + currentOrder);
        this.props.setSearch({ order_by: currentOrderBy });
    }
    //是否是选中状态
    isActive(type) {
        let previousOrderBy = this.props.searchData.order_by;
        return previousOrderBy ? previousOrderBy.split(":")[0] == type : !type;
    }
    //获取排序筛选内容
    getOrderFilter() {
        let self = this;
        return this.orderFilter.map(function (item, index) {
            let isActive = self.isActive(item.type);
            return <li key={index} onClick={self.filterClick.bind(self, item.type, item.orderControl)} className={`order-filter-item ${isActive ? 'active' : ''}`}>
                <span>{item.name}</span>{item.orderControl ? <i className={self.orderIcon[isActive ? (self.props.searchData.order_by.split(':')[1]) : 'normal']}></i> : ''}
            </li>
        })
    }
    render() {
        return (
            <ul className="order-filter">
                {this.getOrderFilter()}
            </ul>
        )
    }
}
//高级筛选组件
class AdvancedFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            select: false
        }
    }
    //切换高级筛选列表显示状态
    toggleAdvancedFilterSelect() {
        let select = this.state.select;
        this.setState({
            select: !select
        }, function () {
            $("body").css(
                {
                    overflowY: (this.state.select ? "hidden" : ""),
                    position: (this.state.select ? "fixed" : "static")
                }
            );
        });
        this.props.toggleQuickSelect(false);
    }
    render() {
        let select = this.state.select;
        return <div className="advanced-filter" onClick={this.toggleAdvancedFilterSelect.bind(this)}>
            <span className="advanced-filter-span">筛选</span><i className="filter-grey-icon"></i>
            {select ? <AdvancedFilterSelect {...this.props} toggleAdvancedFilterSelect={this.toggleAdvancedFilterSelect.bind(this)} /> : ""}
            {select ? <Shady options={{ zIndex: 1 }} /> : ""}
        </div>
    }
}
//高级筛选列表组件
class AdvancedFilterSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allItem: false,
            priceStart: '',
            priceEnd: ''
        };
        this.service = {
            promotion: '促销',
            is_self: '自营',
            store_only: '仅看有货',
            tax_free: '包税',
            // is_hot: '热销',
            support_ecard: '支持活动e卡'
        }
    }
    componentWillMount() {
        let { searchData } = this.props;
        let data = this.getData();
        let stateObj = {};
        for (let i = 0; i < data.length; i++) {
            let key = data[i].key;
            stateObj[key + 'Id'] = {};
            stateObj[key + 'Name'] = {};
        }
        for (let i = 0; i < data.length; i++) {
            if (searchData[data[i].type]) {
                let key = data[i].key;
                let dataList = data[i].list;
                let idList = '';
                if (data[i].type == 'service') {
                    let serviceObj = searchData[data[i].type];
                    let serviceIdList = [];
                    for (let id in serviceObj) {
                        if (serviceObj.hasOwnProperty(id) && serviceObj[id]) {
                            serviceIdList.push(id);
                        }
                    }
                    idList = serviceIdList;
                } else {
                    idList = searchData[data[i].type].toString().split(',');
                }
                for (let j = 0; j < dataList.length; j++) {
                    let id = dataList[j][data[i].id];
                    let name = dataList[j].name || dataList[j].text;
                    for (let v = 0; v < idList.length; v++) {
                        if (idList[v] == id) {
                            stateObj[key + 'Id'][id] = true;
                            stateObj[key + 'Name'][id] = name;
                        }
                    }
                }
            }
        }
        if (searchData.price_range) {
            let priceList = searchData.price_range.toString().split(":");
            if (priceList[0] && priceList[1]) {
                stateObj.priceStart = Math.min(priceList[0], priceList[1]) || '';
                stateObj.priceEnd = Math.max(priceList[0], priceList[1]) || '';
            } else {
                stateObj.priceStart = priceList[0] || '';
                stateObj.priceEnd = priceList[1] || '';
            }
        }
        this.setState(stateObj);
    }
    stopPropagation(e) {
        e.stopPropagation();
    }
    //对高级筛选的服务项进行特殊处理
    getService(service) {
        let array = [];
        for (let id in service) {
            if (service.hasOwnProperty(id)) {
                array.push({ service_id: id, name: this.service[id] });
            }
        }
        return array;
    }
    //获取高级筛选的前端所需所有数据
    getData() {
        let data = [];
        let self = this;
        let { service, brandsList, brandsOrderList, categoriesLevelList, properties } = this.props;
        data.push({ key: 'service', type: 'service', id: 'service_id', name: '小泰服务', list: self.getService(service), displayStyle: 1 });
        data.push({ key: 'price', type: 'price', id: 'price_id', name: '价格区间', displayStyle: 0 });
        data.push({ key: 'brand', type: 'brand', id: 'brand_id', name: '品牌', list: brandsList, orderList: brandsOrderList, displayStyle: 1, limit: 2, maxLimit: 5 });
        for (let i = 0; i < categoriesLevelList.length; i++) {
            data.push({ key: 'category' + i, type: 'category', id: 'category_id', name: categoriesLevelList[i].name, list: categoriesLevelList[i].children, displayStyle: 1, limit: 1 })
        }
        for (let i = 0; i < properties.length; i++) {
            let id = '', type = '';
            if (properties[i].is_country && properties[i].is_country == true) {
                // id = 'country_id';
                // type = 'country';
                data.push({ key: 'country', type: 'country_id', id: 'country_id', name: properties[i].name, list: properties[i].list, displayStyle: 1, limit: 1 });
            } else {
                // id = 'property_value_id';
                // type = 'properties';
                data.push({ key: 'properties' + i, type: 'properties', id: 'property_value_id', name: properties[i].name, list: properties[i].list, displayStyle: 1, limit: 1 });
            }

        }
        for (let i = 0; i < data.length; i++) {
            data[i].hasMore = !!(data[i].limit && data[i].list.length > data[i].limit * 3);
            data[i].hasAll = !!(data[i].maxLimit && data[i].list.length > data[i].maxLimit * 3 - 1)
        }
        return data;
    }
    //重置已选择项目
    resetData() {
        let data = this.getData();
        let stateObj = {};
        for (let i = 0; i < data.length; i++) {
            let key = data[i].key;
            stateObj[key + 'Id'] = {};
            stateObj[key + 'Name'] = {};
        }
        stateObj.priceStart = '';
        stateObj.priceEnd = '';
        this.setState(stateObj);
    }
    //提交已选择项目
    ensureData() {
        let { setSearch } = this.props;
        let state = Immutable.fromJS(this.state).toJS();
        let data = this.getData();
        let searchObj = {};
        for (let i = 0; i < data.length; i++) {
            if (state[data[i].key + 'Id']) {
                let idItem = state[data[i].key + 'Id'];
                if (data[i].type == 'service' && JSON.stringify(idItem) != "{}" ) {
                    for (let id in idItem) {//serviceId
                        if (idItem.hasOwnProperty(id)) {
                            idItem[id] = idItem[id] ? 1 : 0;
                        }
                    }
                    searchObj.service = idItem;
                } else if (data[i].type == 'price') {
                    if(this.state.priceStart && this.state.priceEnd){
                        searchObj.price_range = this.state.priceStart + ":" + this.state.priceEnd;
                    }else{
                        searchObj.price_range = '';
                    }
                } else {
                    let idArray = searchObj[data[i].type] ? searchObj[data[i].type].toString().split(',') : [];
                    for (let id in idItem) {
                        if (idItem.hasOwnProperty(id) && idItem[id]) {
                            idArray.push(id);
                        }
                    }
                    searchObj[data[i].type] = idArray.join(',');
                }
            }
        }
        setSearch(searchObj);
        this.props.toggleAdvancedFilterSelect();
    }
    //当每项数目多于指定行数时只显示指定行数
    sliceListByLimit(list, limit, max) {
        let limitNum = max == 'max' ? limit * 3 - 1 : limit * 3;
        return (limit && list.length > limitNum) ? list.slice(0, limitNum) : list;
    }
    //每项的下拉切换
    toggleItemSelect(key) {
        let selectState = key + 'Select';
        this.setState({
            [selectState]: !this.state[selectState]
        })
    }
    //每项具体条目的选择切换
    toggleItem(id, name, key) {
        let chooseIdList = Immutable.fromJS(this.state[key + 'Id'] || {}).toJS();
        let chooseNameList = Immutable.fromJS(this.state[key + 'Name'] || {}).toJS();
        chooseIdList[id] = !chooseIdList[id];
        chooseNameList[id] = chooseNameList[id] ? '' : name;
        this.setState({ [key + 'Id']: chooseIdList, [key + 'Name']: chooseNameList });
    }
    //价格改变时的存储
    setPrice(type, event) {
        this.setState({ [type]: event.target.value });
    }
    //选中项进行格式化处理并显示
    getChooseNameText(list) {
        let container = [];
        for (let id in list) {
            if (list.hasOwnProperty(id) && list[id]) {
                container.push(list[id]);
            }
        }
        return container.join(',');
    }
    //显示某一筛选项的所有条目
    showAllItem() {
        this.setState({ allItem: true });
    }
    //隐藏某一筛选项的所有条目
    hideAllItem() {
        this.setState({ allItem: false });
    }
    //设置品牌
    setBrand(activeIdObj, activeNameObj) {
        this.setState({ brandId: activeIdObj, brandName: activeNameObj });
    }
    //高级筛选各条目显示
    getAdvancedItem() {
        let data = this.getData();
        let self = this;
        return data.map(function (item, index) {
            let limit = item.limit;
            let maxLimit = item.maxLimit;
            let chooseIdList = self.state[item.key + 'Id'] || {};//是个对象
            let chooseNameList = self.state[item.key + 'Name'] || {};
            let chooseNameText = self.getChooseNameText(chooseNameList);
            let { priceStart, priceEnd } = self.state;
            let typeSelect = item.key + 'Select';
            //二级分类
            let limitList = self.state[typeSelect] ? item.maxLimit ? self.sliceListByLimit(item.list, maxLimit, 'max') : item.list : self.sliceListByLimit(item.list, limit);
            return (
                <div key={index} className="select-item">
                    <div className="select-title">
                        <div className="title-left"><div><span>{item.name}</span></div></div>
                        <div className="title-right">
                            <div className="choose-name"><span>{chooseNameText}</span></div>
                            {item.hasMore ? <div className="more-item" onClick={self.toggleItemSelect.bind(self, item.key)}><span>更多</span><i className={self.state[typeSelect] ? "arrow-mi-up-icon" : "arrow-mi-down-icon"}></i></div> : ""}
                        </div>
                    </div>
                    {item.displayStyle ?
                        <ul className="select-content">
                            {limitList.map(function (listItem, listIndex) {
                                return <li className="select-content-item" key={listIndex} onClick={self.toggleItem.bind(self, listItem[item.id], listItem.name || listItem.text, item.key)}><div className={chooseIdList[listItem[item.id]] ? 'active' : ''}>{listItem.name || listItem.text}</div></li>
                            })}
                            {item.hasAll && self.state[typeSelect] ? <li className="all-item-button" onClick={self.showAllItem.bind(self, item.type)}><span>全部品牌</span><i className="arrow-right-m-icon"></i><i className="arrow-right-m-icon"></i></li> : ''}
                        </ul>
                        :
                        <div className="select-content">
                            <input value={priceStart} onChange={self.setPrice.bind(self, 'priceStart')} placeholder="最低价格" />
                            <span className="space-character">一</span>
                            <input value={priceEnd} onChange={self.setPrice.bind(self, 'priceEnd')} placeholder="最高价格" />
                        </div>
                    }
                    {(item.orderList && self.state.allItem) ? <AllItem data={item.orderList} activeBrandId={self.state.brandId} activeBrandName={self.state.brandName} hideAllItem={self.hideAllItem.bind(self)} setBrand={self.setBrand.bind(self)} /> : ""}
                </div>
            )
        });
    }
    render() {
        return <div className="advanced-filter-select" onClick={this.stopPropagation.bind(this)}>
            <div>{this.getAdvancedItem()}</div>
            <div className="control-button">
                <div className="reset-button c-bge4" onClick={this.resetData.bind(this)}>重置</div>
                <div className="ensure-button c-bgdred" onClick={this.ensureData.bind(this)}>确定</div>
            </div>
        </div>
    }
}
//某一高级筛选项目的全部条目组件
class AllItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alphabetIdList: {},
            alphabetNameList: {}
        };
    }
    componentWillMount() {
        this.setState({
            alphabetIdList: this.props.activeBrandId,
            alphabetNameList: this.props.activeBrandName
        });
    }
    componentDidMount() {
        let $elementArray = $(".item-item");
        let $container = $(this.refs.container);
        let heightArray = [];
        let currentIndex = -1;
        for (let i = 0; i < $elementArray.length; i++) {
            let $element = $elementArray.eq(i);
            heightArray.push($element.offset().top - $element.find(".item-item-title").height());
        }
        var str = navigator.userAgent.toLowerCase();
        var ver = str.match(/cpu iphone os (.*?) like mac os/);
        if (!ver) {
            $container.scroll(function () {
                let scrollTop = $(this).scrollTop();
                for (let i = 0; i < heightArray.length - 1; i++) {
                    let heightMin = heightArray[i];
                    let heightMax = heightArray[i + 1];
                    if (scrollTop >= heightMin && scrollTop < heightMax && i != currentIndex) {
                        currentIndex = i;
                        $elementArray.removeClass("alphabet-float");
                        $elementArray.eq(i).addClass("alphabet-float");
                    }
                }
            });
        }
    }
    toggleItem(id, name) {
        let alphabetIdList = Immutable.fromJS(this.state.alphabetIdList).toJS();
        let alphabetNameList = Immutable.fromJS(this.state.alphabetNameList).toJS();
        alphabetIdList[id] = !alphabetIdList[id];
        alphabetNameList[id] = alphabetNameList[id] ? "" : name;
        this.setState({
            alphabetIdList: alphabetIdList,
            alphabetNameList: alphabetNameList
        })
    }
    resetData() {
        this.setState({ alphabetIdList: {}, alphabetNameList: {} });
    }
    ensureData() {
        this.props.setBrand(this.state.alphabetIdList, this.state.alphabetNameList);
        this.props.hideAllItem();
    }
    //点击字母时滚动到以该字母为首字母的品牌位置
    scrollToAlphabet(alphabet) {
        let $element = $(this.refs[alphabet]);
        let $container = $(this.refs.container);
        let top = $element.offset().top - $container.offset().top + $container.scrollTop();
        $container.scrollTop(top + 1);
    }
    render() {
        let self = this;
        let data = this.props.data;
        let alphabetList = [];
        for (let alphabet in data) {
            if (data.hasOwnProperty(alphabet)) {
                alphabetList.push(alphabet);
            }
        }
        return <div className="all-item">
            <div className="all-item-title">
                <span className="back-button" onClick={this.props.hideAllItem}><i className="arrow-left-black-icon"></i></span><span className="title-text">品牌</span>
            </div>
            <div className="all-item-content">
                <div className="item-list" ref="container">
                    {alphabetList.map(function (item, index) {
                        let itemList = data[item];
                        return <div className="item-item" key={index}>
                            <div className="item-item-title" ref={item}>{item}</div>
                            <ul className="item-item-content">
                                {itemList.map(function (item, index) {
                                    let chooseState = self.state.alphabetIdList[item.brand_id];
                                    return <li className={chooseState ? 'active' : ''} key={index} onClick={self.toggleItem.bind(self, item.brand_id, item.name)}>{item.name}</li>
                                })}
                            </ul>
                        </div>
                    })}
                </div>
                <ul className="alphabet-list">
                    {alphabetList.map(function (item, index) {
                        return <li key={index} onClick={self.scrollToAlphabet.bind(self, item)}>{item}</li>
                    })}
                </ul>
            </div>
            <div className="control-button">
                <div className="reset-button c-bge4" onClick={this.resetData.bind(this)}>清空品牌</div>
                <div className="ensure-button c-bgdred" onClick={this.ensureData.bind(this)}>确定</div>
            </div>
        </div>
    }
}
//快捷筛选
class QuickFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.quickFilter = [
            { name: '自营', type: 'is_self', style: 'click' },
            { name: '促销', type: 'promotion', style: 'click' },
            { name: '品牌', type: 'brand', style: 'select' },
            { name: '分类', type: 'category', style: 'select' }
        ];
    }
    //收起下拉列表
    stopSelect() {
        this.props.toggleQuickSelect(false);
    }
    //快捷筛选点击事件
    filterClick(type, style) {
        if (style == 'click') {
            let service = this.props.searchData.service || {};
            service[type] = service[type] ? 0 : 1;
            this.props.toggleQuickSelect(false);
            this.props.setSearchService(service);
        } else if (style == 'select') {
            let select = this.props.isQuickSelect;
            if (this.state.type == type) {
                this.props.toggleQuickSelect(!select);
            } else {
                this.setState({
                    type: type
                });
                this.props.toggleQuickSelect(true);
            }
        }
    }
    //判断是否为选中状态
    isActive(type, style) {
        let flag = false;
        if (style == 'click') {
            flag = this.props.searchData.service && this.props.searchData.service[type];
        } else if (style == 'select') {
            flag = this.props.searchData[type];
        }
        return !!flag;
    }
    //判断是否为下拉展开状态
    isSelect(type, style) {
        let flag = false;
        if (style == 'select' && type == this.state.type && this.props.isQuickSelect) {
            flag = true;
        }
        return flag;
    }
    //将选中的条目文本替换掉快捷筛选的文字
    showChooseItem(type) {
        let { searchData, brandsList, categoriesList } = this.props;
        let idArray = searchData[type].toString().split(',');
        let nameArray = [];
        if (type == 'brand') {
            for (let i = 0; i < brandsList.length; i++) {
                let name = this.getNameById(brandsList[i], idArray, type);
                name && nameArray.push(name);
            }
        } else if (type == 'category') {
            for (let i = 0; i < categoriesList.length; i++) {
                let name = this.getNameById(categoriesList[i], idArray, type);
                name && nameArray.push(name);
            }
        } else {
            console.log('error');
            return 0;
        }
        return nameArray.join(',');
    }
    //通过快捷筛选的条目id获取快捷筛选条目名称
    getNameById(item, activeList, type) {
        for (let i = 0; i < activeList.length; i++) {
            if (type == 'brand') {
                if (activeList[i] == item.brand_id) {
                    return item.name;
                }
            } else if (type == 'category') {
                if (activeList[i] == item.category_id) {
                    return item.name;
                }
            } else {
                console.log('error');
                return '';
            }
        }
    }
    //获取快捷筛选内容
    getQuickFilter() {
        let self = this;
        return this.quickFilter.map(function (item, index) {
            let isActive = self.isActive(item.type, item.style);
            let isSelect = self.isSelect(item.type, item.style);
            return <li key={index} className={isSelect ? 'select' : (isActive ? item.style == 'click' ? 'active' : 'select-active' : '')} onClick={self.filterClick.bind(self, item.type, item.style)}>
                <div><span>{(item.style == 'select' && (!isSelect && isActive)) ? self.showChooseItem(item.type) : item.name}</span>{(item.style == 'select' && (isSelect || (!isSelect && !isActive))) ? <i className={isSelect ? "arrow-top-black-icon" : "arrow-btm-black-icon"}></i> : ''}</div>
            </li>
        });
    }
    //下拉列表展开时避免整个屏幕滚动
    preventScroll(status) {
        if (status) {
            $("body").css({ overflowY: "hidden", position: "fixed" })
        } else {
            $("body").css({ overflowY: "", position: "static" })
        }
    }
    render() {
        let select = this.props.isQuickSelect;
        let { brandsList, categoriesList, searchData, setSearch } = this.props;
        this.preventScroll(select);
        return (
            <div className="quick-filter">
                <ul className="filter-list">
                    {this.getQuickFilter()}
                </ul>
                {select ? <QuickFilterSelect setSearch={setSearch} brandsList={brandsList} categoriesList={categoriesList} type={this.state.type} searchData={searchData} stopSelect={this.stopSelect.bind(this)} /> : ""}
                {select ? <Shady options={{ zIndex: -1 }} /> : ""}
            </div>
        )
    }
}
//快捷筛选下拉列表组件
class QuickFilterSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: {}
        };
    }
    componentWillMount() {
        this.initSelect(this.props.type);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.type != nextProps.type) {
            this.initSelect(nextProps.type);
        }
    }
    //下拉列表条目点击事件
    selectFilter(id) {
        let list = this.state.list;
        list[id] = !list[id];
        this.setState({
            list: list
        })
    }
    //初始化下拉列表数据
    initSelect(type) {
        let list = {};
        let array = [];
        if (type == 'brand' && this.props.searchData.brand) {
            array = this.props.searchData.brand.toString().split(',');
        } else if (type == 'category' && this.props.searchData.category) {
            array = this.props.searchData.category.toString().split(',');
        }
        for (let i in array) {
            if (array.hasOwnProperty(i)) {
                list[array[i]] = true;
            }
        }
        this.setState({ list: list });
    }
    //清空下拉列表数据
    resetSelect() {
        this.setState({ list: {} })
    }
    //提交下拉列表数据
    ensureSelect() {
        let list = this.state.list;
        let { setSearch, type } = this.props;
        let idArray = [];
        let idText = '';
        for (let id in list) {
            if (list.hasOwnProperty(id) && list[id]) {
                idArray.push(id);
            }
        }
        idText = idArray.join(',');
        setSearch({ [type]: idText });
        this.props.stopSelect();
    }
    //获取下拉列表数据
    getFilterList() {
        let { brandsList, categoriesList, type } = this.props;
        let self = this;
        let list = "";
        if (type == 'brand') {
            list = brandsList.map(function (item, index) {
                return <li key={index} onClick={self.selectFilter.bind(self, item.brand_id, item.name)}><div className={self.state.list[item.brand_id] ? 'choose' : ''}>{item.name}</div></li>
            })
        } else if (type == 'category') {
            list = categoriesList.map(function (item, index) {
                return <li key={index} onClick={self.selectFilter.bind(self, item.category_id, item.name)}><div className={self.state.list[item.category_id] ? 'choose' : ''}>{item.name}</div></li>
            })
        }
        return list;
    }
    render() {
        return (
            <div className="quick-filter-select">
                <ul className="select-list">
                    {this.getFilterList()}
                </ul>
                <div className="reset-button c-bge4" onClick={this.resetSelect.bind(this)}>重置</div>
                <div className="ensure-button c-bgdred" onClick={this.ensureSelect.bind(this)}>确定</div>
            </div>
        )
    }
}
//一些商品提示信息
class Prompt extends Component {
    render() {
        let { searchData, correction, coupon } = this.props;
        return <div className="prompt">
            {coupon ? <p>以下商品可以使用<span className="coupon-info">满{coupon.limit_money}减{coupon.deduct_money}</span>的优惠券</p> : ""}
            {correction ? <p>没找到“<span className="good-name">{searchData.search_keywords}</span>”相关商品，已为您推荐“<a href={`/searchResult?key=${correction}`}><span className="good-name">{correction}</span></a>”相关商品</p> : ""}
        </div>
    }
}
//商品列表 DropDownLoad以高阶组件的形式为商品列表添加下拉分页
@DropDownLoad
class GoodsList extends Component {
    componentDidMount() {
        this.setMinListHeight();
        this.changeScrollHeightByGoodsStyle();
    }
    //应急措施，需优化
    setMinListHeight() {
        document.getElementsByClassName('goods-list')[0].style.minHeight = ($(window).height() - $(".prompt").height() - 174) + 'px';
        document.getElementsByClassName('goods-list')[0].minHeight = ($(window).height() - $(".prompt").height() - 174) + 'px';
    }
    changeScrollHeightByGoodsStyle() {
        let oldGoodHeight = this.props.goodHeight,
            newGoodHeight = $(".goods-list .good-item").height(),
            scrollTop = $(window).scrollTop(),
            goodStyle = oldGoodHeight > newGoodHeight;//暂时先通过高度的不同判断商品类型，可优化为通过商品类型（goodStyle）判断
        let positionNum = goodStyle ? 2 * parseInt(scrollTop / oldGoodHeight) : parseInt(scrollTop / oldGoodHeight);
        //控制筛选栏的位置
        $(window).scrollTop((goodStyle ? positionNum : Math.ceil(positionNum / 2)) * newGoodHeight);
        this.props.setGoodHeight(newGoodHeight);
    }
    promotionTags = () => {
        let { promotion } = this.props;
        if (promotion.type === 'FullDiscount') {//满折
            let tips = promotion.rules.map((item, index) => {
                return <span className="proTips" key={index}> <span className="pro_x">{item.full}</span>件<span className="pro_y">{item.percent}</span>折,</span>
            })
            return <p className="promotionTitle">以下商品{tips}</p>
        } else if (promotion.type === 'FullMinus') {//满减
            let tips = promotion.rules.rule.map((item, index) => {
                return <span className="proTips" key={index}>满<span className="pro_x">{item.limit_money}</span>减<span className="pro_y">{item.deduct_money},</span></span>
            })
            return <p className="promotionTitle">以下商品{tips}上不封顶</p>
        } else if (promotion.type === 'OptionBuy') {//N元任选
            return <p className="promotionTitle">以下商品<span className="pro_x">{promotion.rules.amount}</span>元任选<span className='pro_y'>{promotion.rules.quantity}</span>件</p>
        } else if (promotion.type === 'ExchangeBuy') {//换购
            return <p className="promotionTitle">以下商品满<span className="pro_x">{promotion.rules.exchange_full}</span>元加价可换购<span className='pro_y'>{promotion.rules.exchange_count}</span>件热销商品,请前往购物袋换购</p>
        } else {
            return;
        }
    }

    render() {
        let { goodsList, setFrom, promotion } = this.props;
        let style = this.props.listStyle == 1 ? 'style1' : 'style2';
        return (
            <div className={`goods-list ${style}`}>
                {promotion && this.promotionTags()}
                {goodsList.map(function (item, index) {
                    return <GoodItem key={index} data={item} index={index} setFrom={setFrom} />
                })}
            </div>
        )
    }
}
//单个商品
class GoodItem extends Component {
    constructor(props) {
        super(props);
        this.tradeTypeObj = {
            Domestic: { name: '国内贸易', style: 'hide-tag' },
            Overseas: { name: '海外直邮', style: 'yellow-tag' },
            Bonded: { name: '跨境保税', style: 'blue-tag' },
            Direct: { name: '海外直邮', style: 'yellow-tag' }
        };
    }
    //促销标签
    showPromotionDetail(list) {
        return list.map(function (item, index) {
            return <span className="promotion-tag" key={index}>{item}</span>
        })
    }
    //按优先级展示左上角标签
    showTopTagsByLevel(list) {
        let text = '';
        if (list) {
            if (list.is_new_group) {
                text = '新人团';
            } else if (list.is_hot) {
                text = '热销';
            } else if (list.is_new) {
                text = '新品';
            } else {
                text = '';
            }
        } else {
            text = '';
        }
        return text ? <span className="new-hot-tag">{text}</span> : ""
    }
    render() {
        let { item_id, primary_image, title, sell_price, market_price, activity_price, support_ecard, item_tag, top_tags, trade_type, promotionDetail, store, valid } = this.props.data;
        return (
            <div className="good-item" onClick={this.props.setFrom.bind(this, 'item')}>
                <a href={RNDomain+"/item?item_id="+item_id}>
                    <div className="good-image">
                        <img className="primary-image" data-echo={primary_image ? (primary_image + "_m.jpg") : "/src/img/search/no-goods-image.png"} src="/src/img/icon/loading/default-watermark.png" />
                        {store && valid ? "" : <img className="no-goods-count-image" src="/src/img/search/no-goods-count.png" />}
                    </div>
                    <div className="good-content">
                        <div className="good-title">{title}</div>
                        <div className="good-price"><span className="sell-price"><span className="money-icon">￥</span>{activity_price || sell_price}</span> {support_ecard ? <img className="support-ecard" src="/src/img/common/support-ecard.png" /> : ""}</div>
                        <div className="good-bottom-tag">
                            {trade_type ? (<span className={`trade-tag ${this.tradeTypeObj[trade_type].style}`}>{this.tradeTypeObj[trade_type].name}</span>) : ''}
                            {promotionDetail && promotionDetail.length ? this.showPromotionDetail(promotionDetail) : ''}
                        </div>
                    </div>
                    <div className="good-top-tag">{item_tag.square_tag_image ? (<img src={item_tag.square_tag_image} />) : this.showTopTagsByLevel(top_tags)}</div>
                </a>
            </div>
        )
    }
}
//回到顶部的按钮
class JumpTopButton extends Component {
    jumpToTop() {
        scrollTo(0, 50);
    }
    render() {
        return <div className="jump-top-button" onClick={this.jumpToTop.bind(this)}>
            <i className="jump-top-icon"></i>
        </div>
    }
}
export function searchResultState(state) {
    return { ...state.searchResult3 }
}
export function searchResultDispatch(dispatch) {
    return {
        dispatch,
        setFrom(str) {
            dispatch(createActions('setFrom', { from: str }));
        },
        setFilterState(filterState) {
            dispatch(createActions('setFilterState', { filterState: filterState }));
        },
        setFilterUpdate(filterUpdate) {
            dispatch(createActions('setFilterUpdate', { filterUpdate: filterUpdate }));
        },
        setWindowHeight(height) {
            dispatch(createActions('windowHeight', { windowHeight: height }));
        },
        setGoodHeight(height) {
            dispatch(createActions('goodHeight', { goodHeight: height }));
        },
        setSearch(data) {
            dispatch(createActions('setSearch', { searchData: data }));
        },
        setSearchService(data) {
            dispatch(createActions('setSearchService', { service: data }));
        },
        setCorrection(data) {
            dispatch(createActions('setCorrection', { correction: data }));
        },
        setData(data, init, filterUpdate) {
            dispatch(createActions('isLoad', { load: false }));
            currentApi.search(data).then(result => {
                if (result.data.code !== 0) {
                    dispatch(createActions('setInit', { init: true }));
                    dispatch(createActions('isError', { errorState: true }));
                    return;
                } else {
                    dispatch(createActions('isError', { errorState: false }));
                }
                if (!result.data.data) { return; }
                if (!init) {
                    dispatch(createActions('setInitItem', { result: result.data }));
                    dispatch(createActions('setInit', { init: true }));
                }
                dispatch(createActions('setCurrentPage', { current: result.data.data.page ? result.data.data.page.current_page : 1 }));
                dispatch(createActions('setTotalPage', { total: result.data.data.page ? result.data.data.page.total_page : 1 }));
                dispatch(createActions('setData', { result: result.data, filterUpdate: filterUpdate }));
                dispatch(createActions('isLoad', { load: true }));
            }).catch(error => {
                dispatch(createActions('setInit', { init: true }));
                tip.show({ msg: error.message || error.response.data.message || "服务器繁忙" })
                // console.error( error );
            });
        },
        toggleQuickSelect(isSelect) {
            dispatch(createActions('toggleQuickSelect', { isQuickSelect: isSelect }));
        }
    }
}
export default connect(searchResultState, searchResultDispatch)(SearchResult);