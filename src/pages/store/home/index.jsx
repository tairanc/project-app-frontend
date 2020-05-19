/**
 * Created by Administrator on 2017/8/10.
 */
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {CustomerService, LoadingRound} from 'component/common';
import Popup from 'component/modal2';
import {concatPageAndType} from 'js/actions/actions';
import SearchResult, {ListFilterA, ListInfoCtrl, searchResultDispatch} from 'src/pages/search/result3';
import axios from 'js/util/axios';
import {MALLAPI, RNDomain} from 'config/index'
import './index.scss';

let CancelToken = axios.CancelToken;
let cancel;

const createActions = concatPageAndType('storeIndex');
const pageApi = {
    //data:{ url:"/wxapi/shop-decoration-get.api" , method:"get"},removeShopCollection
    data: {url: `${MALLAPI}/shop/shopIndex`, method: "get"},
    addShop: {url: `${MALLAPI}/user/saveShopCollection`, method: "post"},
    removeShop: {url: `${MALLAPI}/user/removeShopCollection`, method: "get"},
    coupon: {url: `${MALLAPI}/promotion/obtainCoupon`, method: "post"}
};

export class StoreIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        document.title = "店铺首页";
    };

    componentWillMount() {
        this.props.initialData();
    };

    componentWillUnmount() {
        $(window).scrollTop(1);
    }

    render() {
        let {update, open_status, sign, subscribeAllow} = this.props;
        return (
            update ? (open_status === 1 || open_status === '1') ? (
                <div data-page="store-index" style={{minHeight: $(window).height()}}>
                    <SearchBar query={this.props.location.query} {...sign}/>
                    <PartingLine/>
                    <StoreSignWrap query={this.props.location.query} subscribeAllow={subscribeAllow}/>
                    <StoreLeader {...this.props} />
                    <Footer {...this.props} />
                </div>
            ) : (
                <div data-page="store-index" style={{minHeight: $(window).height()}}>
                    <StoreNotOpen {...sign}/>
                </div>
            ) : (<LoadingRound/>)
        )
    }
}

export class StoreNotOpen extends Component {
    render() {
        let {shop_alias_name, shop_name} = this.props;
        return (
            <div className="storeNotOpen">
                <img src="../src/img/store/store-close-icon.png"/>
                <div className="notOpenDesc">
                    <p>抱歉，您访问的店铺：{shop_alias_name || shop_name}，</p>
                    <p>暂未开放，敬请谅解</p>
                </div>
                <div className="returnIndexButton"><Link to="/homeIndex">返回商城首页</Link></div>
            </div>
        )
    }
}

export class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            innerValue: props.defaultValue
        };
    }

    changeHandle = (e) => {
        this.value = e.target.value;
    };
    clearHandle = () => {
        if (this.value) {
            this.value = "";
        } else {
            this.setState({
                innerValue: ""
            })
        }
    };
    searchJump = () => {
        const _url = `${RNDomain}/searchResult?&module=TRMALL&page=searchResult&key=${this.value || ""}&shop=${this.props.query.shop}`
        window.location.href = _url;
    };

    render() {
        const {value} = this.props,
            {innerValue} = this.state;
        return (
            <form data-comp="search-bar-b" className="g-row-flex" action="javascript:;">
                <label className="g-col-1 search-label" ref="label">
                    <input ref="search" value={value !== undefined ? value : innerValue} type="search"
                           placeholder="搜索店铺内商品" onChange={this.changeHandle} className="search-input"/>
                    {(value !== undefined ? value : innerValue) != "" &&
                    <i ref="clear" onTouchTap={this.clearHandle} className="close-x-icon"> </i>}
                    <i className="search-icon"> </i>
                </label>
                <button className="search-btn" onClick={this.searchJump}>搜索</button>
            </form>
        )
    }
}

export class PartingLine extends Component {
    render() {
        return (
            <div className="partingLine">
                <img src="../src/img/store/bar-parting-line.png"/>
            </div>
        )
    }
}

export class StoreSign extends Component {
    constructor(props) {
        super(props);
    }

    concernClick = (state) => {
        this.props.subscribeAllow && this.props.subscribeStore(state);
    };
    concernRender = (state) => {
        if (state) {
            return (
                <div className="concerned">
                    <span>已关注</span>
                </div>
            );
        } else {
            return (
                <div className="noConcerned">
                    <img src="../src/img/store/follow-icon.png"/>
                    <span>关注</span>
                </div>
            );
        }
    };
    jumpDetail = (id, sign, shop_extend_info) => {
        if (sign.shop_type != 'self' && shop_extend_info && shop_extend_info.license_img) {
            browserHistory.push("/store/detail?shop=" + id);
        }
    };

    render() {
        let self = this;
        let {is_subscribe, sign, resultShow, shop_decoration_data, shop_extend_info,query, image_domain} = this.props;
        let {shop} = query;
        return (
            <div className="storeSign container">
                <div className="storeSignImage"
                     onClick={self.jumpDetail.bind(self, shop_decoration_data.shop_id, sign, shop_extend_info)}>
                    <img src={ sign.shop_logo ? `${image_domain}/${sign.shop_logo}` : "../src/img/temporary/store_logo.png"}/>
                </div>
                <div className="storeSignInfo"
                     onClick={self.jumpDetail.bind(self, shop_decoration_data.shop_id, sign, shop_extend_info)}>
                    <p className="storeSignInfoName">{sign.shop_alias_name || sign.shop_name}</p>
                    <p className="storeSignInfoDesc">泰然城精选商家 服务保障</p>
                </div>
                <div className="storeSignFollowButton" onClick={this.concernClick.bind(this, is_subscribe)}>
                    {this.concernRender(is_subscribe)}
                    <ConcernResult state={is_subscribe} resultShow={resultShow}/>
                </div>
            </div>
        )
    }
}

export class ConcernResult extends Component {
    constructor(props) {
        super(props);
    };

    chooseResult = (state) => {
        if (state) {
            return (
                <div className="concernSuccess">
                    <img src="../src/img/store/concern-result-icon.png"/><br/>
                    <span>关注成功</span>
                    <p>可到我的收藏内查看最新关注</p>
                </div>
            )
        } else {
            return (
                <div className="concernFailed">
                    <img src="../src/img/store/concern-result-icon.png"/><br/>
                    <span>取消关注</span>
                </div>
            )
        }
    };

    render() {
        let state = this.props.state;
        return (
            <div className={"concernResult" + " " + (this.props.resultShow ? "" : "hide")}>
                {this.chooseResult(state)}
            </div>
        )
    };
}

export class StoreLeader extends Component {
    constructor(props) {
        super(props);
        this.state = {nav: 1};
    };

    setNav = (index) => {
        this.setState({
            nav: index
        });
    };

    render() {
        return (
            <div className="storeLeader" data-plugin="swiper">
                <LeaderNav state={this.state} setNav={this.setNav}/>
                <LeaderInfo state={this.state} {...this.props}/>
            </div>
        )
    };
}

export class LeaderNav extends Component {
    constructor(props) {
        super(props);
    };

    handleClick = (index) => {
        this.props.setNav(index)
    };

    render() {
        let self = this;
        let nav = this.props.state.nav;
        return (
            <ul className="leaderNav">
                <li className={nav == 1 ? "activeNav" : ""} onClick={self.handleClick.bind(self, 1)}><span>店铺首页</span>
                </li>
                <li className={nav == 2 ? "activeNav" : ""} onClick={self.handleClick.bind(self, 2)}><span>全部商品</span>
                </li>
            </ul>
        )
    };
}

export class LeaderInfo extends Component {
    constructor(props) {
        super(props);
    };

    factoryComponent = (key, value, is_show_coupon, index) => {
        let { image_domain } = this.props;
        switch (key) {
            case 'slide':
                return (<AppBanner key={index} value={value} image={image_domain}/>);
            case 'coupon':
                return is_show_coupon ? (<CouponList key={index} value={value}/>) : "";
            case 'floor_single':
                return (<AdvertiseImage key={index} value={value} img={image_domain}/>);
            case 'floor':
                return (<GoodsList key={index} value={value} img={image_domain}/>);
        }
    };
    factoryArray = (keyArray, valueArray, is_show_coupon) => {
        if (keyArray.length == valueArray.length) {
            var componentArray = [];
            for (let i = 0; i < keyArray.length; i++) {
                componentArray.push(this.factoryComponent(keyArray[i], valueArray[i], is_show_coupon, i))
            }
            return componentArray;
        }
    };

    render() {
        let nav = this.props.state.nav;
        let {update, shop_decoration_data} = this.props;
        let {modules, is_show_coupon} = shop_decoration_data;
        let {shop_attr} = this.props.sign;
        let typeArray = modules && modules.map(function (item) {
            return item.module_type;
        });
        return (
            <div className="leaderInfo">
                {
                    nav == 1 ? update ? (modules && modules.length) ?
                        (
                            <div className="storeIndexItem">
                                { typeArray && this.factoryArray(typeArray, modules, is_show_coupon)}
                            </div>
                        ) : (
                            <div className="allGoodsItem">
                                <SearchResult {...this.props} storeHomeRequest='true' shop_attr={shop_attr}/>
                            </div>
                        ) : (<LoadingRound/>) : ""
                }
                {nav == 2 ? (
                    <div className="allGoodsItem">
                        <SearchResult {...this.props} storeHomeRequest='true' shop_attr={shop_attr}/>
                    </div>
                ) : ""}
            </div>
        )
    }
}

export class AppBanner extends Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {
        let swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationType: 'fraction',
            loop: true,
            autoplay: 2000,
            lazyLoading: true
        });
    };

    render() {
        let slide = this.props.value.module_data;
        let image = this.props.image;
        return (
            <div className="appBanner swiper-container">
                <ul className="swiper-wrapper">
                    {
                        /******模拟2  原来是subArray(slide,2)*/
                        slide.map(function (item, index) {
                            return <li className="swiper-slide" key={index}>
                                <a href={item.link}><img src={`${image}/${item.image}`}/></a>
                            </li>
                        })
                    }
                </ul>
                <div className="swiper-pagination custom-pagination"></div>
            </div>
        )
    }
}

export class CouponList extends Component {
    constructor(props) {
        super(props);
    };

    clickHandle = (coupon_id) => {
        axios.request({
            ...pageApi.coupon,
            data: {
                coupon_id:coupon_id,
                source:'activity',
                description:''
            }
        }).then((value) => {
            if (value.data.code === 0) {
                Popup.MsgTip({msg: "领取成功"});
            } else {
                if (value.data.code == 401) {
                    window.location.href = "/login";
                }
                Popup.MsgTip({msg: value.data.msg});
            }
        }).catch((err) => {
            Popup.MsgTip({msg: err.response.data.message});
        })
    };

    render() {
        let self = this;
        let dataList = this.props.value.module_data;
        let view = dataList.map(function (item, index) {
            return <li className="coupon" key={index}>
                <div className="couponLeft">
                    <p className="couponNum">￥<span>{item.deduct_money}</span></p>
                    <p className="couponLimit">满<span>{item.limit_money}</span>使用</p>
                </div>
                <div className="couponRight">
                    <p className="couponText">优惠券</p>
                    <span className="couponButton"
                          onClick={self.clickHandle.bind(self, item.id)}>点击领取</span>
                </div>
            </li>
        });
        return (
            <ul className="couponList">
                {view}
            </ul>
        )
    }
}

export class AdvertiseImage extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        let item_list = this.props.value.module_data;
        let img = this.props.img
        return (
            <div className="advertiseImage">
                {
                    item_list.map(function (item, index) {
                        return (<a key={index} href={item.link}><img src={`${img}/${item.image}`}/></a>)
                    })
                }
            </div>
        )
    }
}

export class GoodsList extends Component {
    constructor(props) {
        super(props);
        this.tradeTypeObj = {
            10: '国内贸易',
            20: '海淘',
            30: '跨境保税',
            40: '海外直邮'
        };
        this.tagStyleObj = {
            10: 'hide',
            20: 'tag_yellow',
            30: 'tag_blue',
            40: 'tag_yellow'
        };
    };

    componentDidMount() {
        $(window).scrollTop(1);
    }

    render() {
        let tradeTypeObj = this.tradeTypeObj;
        let tagStyleObj = this.tagStyleObj;
        let {module_name} = this.props.value;
        let item_list = this.props.value.module_data;
        let {img} = this.props;
        let view = item_list.map(function (item, index) {
            /* console.log('item',item);
             let {activity_store,store,valid} = item;
             let saleOut = null;
             activity_store !== undefined ?  saleOut = activity_store<=0 : saleOut = store <=0;
             //saleOut = (activity_store||store)<=0;
             if( !valid  ) saleOut = true;*/
            let {primary_image, id, current_store, promotion_tag, market_price, title} = item;
            let saleOut = current_store <= 0;
            return (
                <li className="goods" key={index}>
                    <a href={RNDomain+"/item?item_id="+id}>
                        <div className="goodsImage">
                            <img src={`${img}/${primary_image}`}/>
                            {saleOut ? <div className="float-label">
                                <img src="/src/img/search/sale-out-big.png"/>
                            </div> : ""}
                        </div>
                        <p className="goodsDesc">{title}</p>
                        <p className="goodsPrice"><span
                            className="nowPrice">￥{item.activity_price || item.sell_price}</span><span
                            className="oldPrice">￥{market_price}</span></p>
                        <ul className="goodsTag">
                            <li className={tagStyleObj[item.trade_type]} key="tagType1">
                                <span>{tradeTypeObj[item.trade_type]}</span></li>
                            {(promotion_tag || []).map(function (item, index) {
                                return <li className="tag_red" key={index}><span>{item}</span></li>
                            })}
                        </ul>
                    </a>
                </li>
            );
        });
        return (
            <div className="goodsList">
                <div className="title">{module_name || '今日特卖'}</div>
                <ul className="content container">
                    {view}
                </ul>
            </div>
        )
    }
}

export class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul className="footer">
                <CustomService {...this.props}/>
            </ul>
        )
    }
}

export class StoreType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hide: true
        };
    };

    clickHandle = () => {
        this.setState({
            hide: !this.state.hide
        });
    };

    render() {
        let {shop_cat_list, shop_decoration_data} = this.props;
        let hide = this.state.hide;
        return (
            <li className="storeType" onClick={this.clickHandle}>
                <img src="../src/img/store/store-type-icon.png"/>
                <span>商品分类</span>
                <div className={"storeList" + " " + (hide ? "hide" : "")}>
                    <ul className="storeListBody">
                        {shop_cat_list.map(function (item, index) {
                            return (<li key={index}><Link className="storeListLink"
                                                          to={"/searchResult?shop=" + shop_decoration_data.shop_id + "&category=" + item.cat_id}>{item.cat_name}</Link>
                            </li>)
                        })}
                    </ul>
                    <div className="storeListIcon"></div>
                </div>
            </li>
        )
    }
}

export class CustomService extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        let {sign:{shop_attr}} = this.props;
	    return (
            <li className="customService">
	            <CustomerService className="save" shopAttr={shop_attr}>
                    <img src="../src/img/store/custom-service-icon.png"/>
                    <span>联系客服</span>
                </CustomerService>
            </li>
        )
    }
}

export function storeIndexState(state) {
    return {
        ...state.searchResult3,
        ...state.storeIndex
    }
}

function storeIndexDispatch(dispatch, props) {
    return {
        ...searchResultDispatch(dispatch, props),
        initialData() {
            let {shop} = props.location.query;
            dispatch(createActions('dataUpdate', {update: false}));
            axios.request({
                ...pageApi.data,
                params: {
                    shop_id: shop
                },
                cancelToken: new CancelToken(function executor(c) {
                    cancel = c;
                })
            }).then((value) => {

                if (value.data.code === 0) {
                    dispatch(createActions('initialData', {value: value.data.data}));
                    dispatch(createActions('dataUpdate', {update: true}));
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }
}

function storeSignDispatch(dispatch, props) {
    return {
        subscribeStore(state) {
            dispatch(createActions('subscribeAllow', {state: false}));
            let ctrlApi;
            !state ? ctrlApi = {
                ...pageApi.addShop,
                data: {shop_id: props.query.shop}
            } : ctrlApi = {...pageApi.removeShop, params: {shop_id: JSON.stringify([(props.query.shop)])}};
            axios.request({
                ...ctrlApi,
                cancelToken: new CancelToken(function executor(c) {
                    cancel = c;
                })

            }).then((value) => {
                dispatch(createActions('subscribeAllow', {state: true}));
                if (value.data.code !== 0) {
                    if (value.data.code == 401) {
                        window.location.href = "/login";
                    }
                    Popup.MsgTip({msg: value.data.msg});
                } else {
                    dispatch(createActions('subscribeStore', {state: !state}));
                    dispatch(createActions('resultShow', {resultShow: true}));
                    setTimeout(() => {
                        dispatch(createActions('resultShow', {resultShow: false}));
                    }, 3000)
                }
            }).catch((err) => {
                dispatch(createActions('subscribeAllow', {state: true}));
                console.log(err);
            })
        }
    }
}

let StoreSignWrap = connect(storeIndexState, storeSignDispatch)(StoreSign);
export default connect(storeIndexState, storeIndexDispatch)(StoreIndex);