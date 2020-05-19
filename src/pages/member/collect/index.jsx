import React, { Component } from 'react';
import { Link, browserHistory} from 'react-router';
import ReactDOM,{ render } from 'react-dom';
import Popup from 'component/modal';
import {ownAjax} from '../../../js/common/ajax.js';
import {LoadingRound } from 'component/common';
import { DropDownLoad } from 'component/HOC.jsx';
import 'src/scss/collect.scss';
import {RNDomain} from 'src/config/index'

const ctrlAPI = {
    //获取收藏商品数据
    initGoods: {
        //url: "/api/user/collections?pages=1",
        url: "/originapi/user/getCollectionList?object_type=1&page=1"
    },
    //获取关注店铺数据
    initShop: {
        //url: "/originapi/user/collection/getShopFav?page=1", /*&limit=10*/
        url: "/originapi/user/getCollectionList?object_type=2&page=1",
        type: "get" 
    },
    //删除商品收藏
    del: { 
        url: '/originapi/user/collection/remove',
        type: "get" 
    },
    //取消关注店铺
    delShop: {
        url: '/originapi/subscribe/collection/removeShop?',
        type: "get"
    }
};

export default class Collect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsData: [],
            goodsPage: 1,
            goodsTotal: 100, //总页数
            updateGoods: false,
            
            shopData: [],
            shopPage: 1,
            shopTotal: 100,

            updateShop: false
        }
    }

    componentWillMount() {
        document.title = '我的收藏';
        location.href = "jsbridge://set_title?title=我的收藏";
    }

    componentDidMount() {
        this.loadData();
    }

    //离开本页面清除消息
    componentWillUnmount() {
        const modal = document.querySelector("#modal");
        modal && modal.parentNode && modal.parentNode.removeChild(modal);
        const msgTip = document.querySelector("#msgTip");
        msgTip && msgTip.parentNode && msgTip.parentNode.removeChild(msgTip);
    }

    //获取收藏的商品、关注的店铺数据
    loadData = () => {
        let { initGoods,initShop } = ctrlAPI;
        let { goodsPage,goodsTotal,shopPage,shopTotal } = this.state;
        let self = this;

        ownAjax(initGoods).then((res) => {
            console.log(res);
            if(res.code===0){
                self.setState({
                    goodsPage: res.data.collection.count,
                    goodsTotal: res.data.collection.total_count,
                    goodsData: res.data.collection.data,
                    selectGoods: true,
                    updateGoods: true
                });
            }
        }).then(()=>{
            return ownAjax(initShop);
        }).then((res)=>{
            if(res.code===0){
                self.setState({
                    shopTotal: res.data.collection.total_count/10,
                    shopData: res.data.collection.data,
                    updateShop: true
                });
            }
        })
        //.catch(()=>{
        //Popup.MsgTip({msg:"网络错误，请稍后再试"});
        //});
    }

    //商品收藏加载下一页数据
    loadGoodsHandle = (me) => {
        let { goodsData,goodsPage,goodsTotal } = this.state;
        if (goodsPage >= goodsTotal) {
            me.lock();
            me.noData();
            me.resetload();
            return;
        }
        this.setState({
            goodsPage: ++goodsPage
        });

        let self = this;
        $.ajax({
            //url: `/originapi/user/collections?pages=${goodsPage}`,
            url:`/originapi/user/getCollectionList?object_type=1&page=${goodsPage}`,
            type: 'get',
            success(result) {
                if (!result.data.fav_info) {
                    me.lock();
                    me.noData();
                    me.resetload();
                    return;
                }
                self.setState({
                    goodsData: goodsData.concat(result.data.fav_info),
                    updateGoods: true
                });
                me.resetload();
            },
            error(xhr) {
                me.resetload();
            }
        })
    }

    //店铺关注加载下一页数据
    loadShopHandle = (me) => {
        let { shopData,shopPage,shopTotal } = this.state;
        if (shopPage >= shopTotal) {
            me.lock();
            me.noData();
            me.resetload();
            return;
        }
        let self = this;
        this.setState({
            shopPage: ++shopPage
        });
        $.ajax({
            url: `/originapi/user/collection/getShopFav?page=${shopPage}`,/*&limit=10*/
            type: 'get',
            success(data) {
                if (!data.data.data) {
                    me.lock();
                    me.noData();
                    me.resetload();
                    return;
                }
                self.setState({
                    shopData: shopData.concat(data.data.data)
                });
                me.resetload();
            },
            error(xhr) {
                me.resetload();
            }
        })
    }
    
    //删除商品收藏
    onDelete = (id) => {
        let newData = this.state.goodsData;
        for (let i = 0, arr; arr = newData[i]; i++) {
            if (arr.item_id == id) {
                newData.splice(i, 1);
            }
        }
        this.setState({
            goodsData: newData
        })
    }

    //取消关注店铺
    onDelShop = (shop) => {
        let newData = this.state.shopData;
        for (let i = 0, arr; arr = newData[i]; i++) {
            if (arr.shop_id == shop) {
                newData.splice(i, 1);
            }
        }
        this.setState({
            shopData: newData
        })
    }

    //切换到商品收藏
    goodsHandle = ()=> {
        this.setState({ selectGoods: true });
    }

    //切换到店铺关注
    shopHandle = ()=> {
        this.setState({ selectGoods: false });
    }

    render() {
        const { goodsData,shopData,selectGoods,updateGoods,updateShop } = this.state;
        return (
            updateGoods ? 
                <div data-page = "collect-page" className="main">
                    <div className="nav">
                        <div className="collect-type" onClick={this.goodsHandle}>
                            <span className={`${selectGoods?"selected":""}`}>商品收藏</span>
                        </div>
                        <div className="split-line"></div>
                        <div className="collect-type" onClick={this.shopHandle}>
                            <span className={`${selectGoods?"":"selected"}`}>店铺关注</span>
                        </div>
                    </div>
                    {selectGoods?
                        <div className="showarea area">
                        {(goodsData && goodsData.length) ?
                            <section className="floor-bd">
                                <DropDownList data={goodsData} update={updateGoods} onDelete={this.onDelete} dropDown={this.loadGoodsHandle} scrollArea={window}/> 
                            </section> 
                            : 
                            <CollectEmpty />
                        }
                        </div>
                        :
                        <div>
                        {updateShop?
                            (shopData && shopData.length) ?
                                <ShopList data={shopData} onDelShop={this.onDelShop} dropDown={this.loadShopHandle} scrollArea={window}/>
                                :
                                <ShopEmpty />
                            :
                            <LoadingRound />
                        }
                        </div>
                    }
                </div>
                :
                <LoadingRound />
        )
    }
}

/*//商品收藏
class GoodsCollect extends Component {
    render(){
        let { goodsData,update,onDelete,loadGoodsHandle } = this.props;
        return(
            <div className="showarea area">
            {(goodsData && goodsData.length) ?
                <section className="floor-bd">
                    <DropDownList data={goodsData} update={update} onDelete={onDelete} dropDown={loadGoodsHandle} scrollArea={window}/> 
                </section> 
                : 
                <CollectEmpty />
            }
            </div>
        )
    }
}*/

//商品列表
export class CollectBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data,
            active: "edit",
            select: []
        }
    }
    componentWillReceiveProps( props){
        this.setState({ data: props.data });
    }

    //切换编辑、删除
    toggleActive = ()=> {
        let { active,select }= this.state;
        if (active == "edit") {
            this.state.active = "del";
        } else {
            if (!select.length) {
                this.state.active = "edit";
            } else{
                this.showModal();
            }
        }
        this.setState(this.state);
    }

    update() {
        let { data, select } = this.state;
        this.state.select.forEach((val) => {
            let index = data.indexOf(val)
            data.splice(index, 1)
        });
        select=[];
        this.setState({ select:select,data:data});
    }

    checkActive(str) {
        return str === this.state.active
    }

    onSelect(id) {
        if (this.checkActive("edit")) {
        return
        }else{
            let index;
            if (~(index = this.state.select.indexOf(id))) {
                this.state.select.splice(index, 1);
            } else {
                this.state.select.push(id);
            }
        }
        this.setState(this.state);
    }

    getSelectId() {
        return this.state.select.map((val) => val.item_id);
    }

    //删除商品确认框
    showModal = ()=> {
        let itemId = this.getSelectId();
        let {del} = ctrlAPI;
        let self = this;

        Popup.Modal({
            isOpen: true,
            msg: "确定删除收藏商品吗？",
        }, ()=> {
            ownAjax(del,{ item_id: itemId }).then((data) => {
                Popup.MsgTip({msg: data.msg});
                if (data.code === 200 && data.status === true) {
                    self.update();
                    self.props.onDelete(itemId)
                }
            });
        });
    };

    render() {
        let {data} = this.state;
        let CollectHtml = this.props.update?(data instanceof Array ? (data.map((item, i)=> {
            return (
                <CollectCtrl data={item} key={item.item_id+"_"+i} onSelect={() =>this.onSelect(item)}
                             checkActive={this.checkActive("edit")}/>
            )
        })) : ''):null;
        return (
            <div className="collect-control list-data">
                {CollectHtml}
                {
                    this.checkActive("edit") ?
                    <div className='edit' onClick={this.toggleActive}>
                        <button type="button" className="ui-btn edit-btn">编辑</button>
                    </div>
                    :
                    <div className='delete-action' onClick={this.toggleActive}>
                        <button type="button" className="ui-btn-warning">删 除</button>
                    </div>
                }
            </div>
        )
    }
}

let DropDownList = DropDownLoad(CollectBar);

//单个商品
class CollectCtrl extends Component {
    constructor(props) {
        super(props);
        this.state = { active: false }
    }
    changeHandle = () => {
        if (!this.props.checkActive) {
            this.setState({
                active: !this.state.active
            });
        }
        this.props.onSelect();
    };
    render() {
        const { data, checkActive } = this.props;
        return ( 
            <div className = "collect-box clearfix" onClick = { this.changeHandle } >
            <div className = "col-xs-6 single un-padding" >
            <div className = { `pro-pic pro-info list-item-pic un-padding ${this.state.active&&"cur"}` } >
               {/* <a className = "pro-link" href = {
                    (data.image_default_id || data.goods_name) && checkActive ? RNDomain + "/item?item_id=" + data.item_id : null } > {
                    (data.image_default_id || data.goods_name) ? 
                    <img src = {data.image_default_id}/> 
                    : 
                    <img src = {require("../../../img/collect/have-deleted.png")}/>    
                } 
                </a>*/}
                <a className = "pro-link" href = {
                    (data.primary_image || data.title) && checkActive ? RNDomain + "/item?item_id=" + data.item_id : null } > {
                    (data.primary_image || data.title) ?
                        <img src = {data.primary_image}/>
                        :
                        <img src = {require("../../../img/collect/have-deleted.png")}/>
                }
                </a>
                <div className = "info-g" style = {{ display: 'none' }} > {
                    data.promotion_tag instanceof Array ? 
                        data.promotion_tag.map((item, i) => {
                        return ( 
                            <div key = {i} style = {{float: 'left'}}>
                            {item != '拼团' ?
                                <span key={i}>{ item }</span> 
                                : 
                                null
                            }
                            </div>
                        )
                    }) : data.promotion_tag
                } 
                </div> 
                <div className = "info-n">
                    <a href = "javascript:;">
                        <p>{ data.brand_name }</p> 
                        <p>{ data.goods_name }</p> 
                    </a> 
                </div> 
                <div className = "info-p">
                   {/* <div className = "p-lf">
                    {data.min_promotion_price ? 
                        (+data.min_promotion_price).toFixed(2) 
                        : 
                        (+data.goods_price).toFixed(2)
                    } 
                    </div>*/}
                    <div className = "p-lf">
                        {data.min_promotion_price ?
                            (+data.min_promotion_price).toFixed(2)
                            :
                            (+data.sell_price).toFixed(2)
                        }
                    </div>
                </div> 
            </div> 
        </div> 
    </div>
    )}
}

//没有收藏商品
class CollectEmpty extends Component {
    render() {
        return (
            <div>
                <div className="empty-area" style={{marginTop:'3.5rem'}}>
                    <img src={require("../../../img/collect/no-collected.png")}/>
                    <span></span>
                    <a href="trmall://main?page=home" className="ui-btn-empty">去逛逛</a>
                </div>
                <div className="empty-mask"></div>
            </div>
        )
    }
}

//没有关注店铺
class ShopEmpty extends Component {
    render() {
        return (
            <div>
                <div className="empty-area" style={{marginTop:'3.5rem'}}>
                    <img src={require("../../../img/collect/no-shop.png")}/>
                    <span></span>
                    <a href="trmall://main?page=home" className="ui-btn-empty">去逛逛</a>
                </div>
                <div className="empty-mask"></div>
            </div>
        )
    }
}

//店铺关注
export class ShopCollect extends Component {
    render() {
        let {data,onDelShop} = this.props;
        return (
            <div style={{paddingTop:"1.2rem"}} >
            {data.map((item,index)=>{
                return (<Eachshop key={index} index={index} item={item} onDelShop={onDelShop}/>)
            })}
            </div>
        )
    }
}

let ShopList = DropDownLoad(ShopCollect);

//每个店铺
class Eachshop extends Component {
    constructor(props){
        super(props);
        this.state = {
            startX: 0,
            startY: 0
        }
    }
    //滑动开始事件
    touchStartHandle = (e)=> {
        this.setState({
            startX: e.touches[0].clientX,
            startY: e.touches[0].clientY
        });
    }

    //滑动结束事件
    touchEndHandle = (e)=> {
        let { startX,startY } = this.state;
        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;

       if(Math.abs(endY-startY)<30){ //Y位移较小且X位移为负，左移
            if(endX - startX < -5){
                $(e.target).parents(".shop-info").addClass("animationCancel1").removeClass("animationCancel2");
                ($(e.target).parents(".shop-info").siblings()).map((key,value)=>{
                    if($(value).hasClass("animationCancel1")){
                        $(value).removeClass("animationCancel1").addClass("animationCancel2");
                    }
                })
            }else if(Math.abs(endX - startX) < 5){ //X位移较小，点击事件
                //【取消关注】移出时，点击缩回
                if($(e.target).parents(".shop-info").hasClass("animationCancel1")){
                    $(e.target).parents(".shop-info").addClass("animationCancel2").removeClass("animationCancel1"); 
                    return false;
                }
                //【取消关注】移入时，点击未开放店铺不跳转
                let { item } = this.props;
                if (item.open_state==="open") {
                    browserHistory.push(`/store/home?shop=${item.shop_id}`);
                }else {
                    return false;
                }
            }else { //右滑取消关注移入
                if($(e.target).parents(".shop-info").hasClass("animationCancel1")){
                    $(e.target).parents(".shop-info").addClass("animationCancel2").removeClass("animationCancel1");                        
                }
            }
        }

    }

    //取消店铺关注
    closeAttention = (e)=>{ 
        //移入【取消关注】图标
        $(e.target).parents(".shop-info").addClass("animationCancel2").removeClass("animationCancel1");
        let { shop_id } = this.props.item;
        let { onDelShop } = this.props;
        let {delShop} = ctrlAPI;
        ownAjax(delShop,{ shopId: shop_id }).then((data) => {
            if(data.code === 200 && data.status === true){
                Popup.MsgTip({msg: "取消成功"});
                onDelShop(shop_id);
            }
        });
    }
    
    render() {
        let { item,index } = this.props;
        return (
            <div className="shop-info">
                <Link onTouchStart={this.touchStartHandle} onTouchEnd={this.touchEndHandle}>
                    <div className="shop-detail">
                        <div className="shop-logo">
                            <img src={item.shop_logo?item.shop_logo:require("../../../img/evaluate/goodsbg.png")}/>  
                        </div>
                        <div className="text-wrap">
                            <p className="title">{item.shop_alias?item.shop_alias:item.shop_name}</p>
                            <p className="sub-title">泰然城精选商家 服务保障</p>
                        </div>
                    </div>
                    <img className="arrow-right" src={require("../../../img/collect/arrow-right.png")}/>
                </Link>
                <div className="shop-cancel" onClick={this.closeAttention}>
                    <img src={require("../../../img/collect/close-attention.png")}/>
                    <p>取消关注</p>
                </div>
            </div>
        )
    }
}