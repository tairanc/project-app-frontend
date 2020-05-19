/**
 * Created by Administrator on 2017/8/10.
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router';
import {NoMore,LoadingRound,NoMoreOrder,SearchBarA} from 'component/common';
import { DropDownLoad } from 'component/HOC';
import {base64encode, utf16to8,subArray,truncateByte} from "src/js/util/index";
import axios from 'axios';
import {RNDomain} from 'src/config/index'

import  './index.scss';


let CancelToken = axios.CancelToken;
let cancel;


export default class StoreResult extends Component {
    constructor(props,context){
        super(props);
        this.state = {
            data:[],
            update:false
        };
        document.title="店铺搜索结果页";
        if( context.isApp ) window.location.href = "jsbridge://set_title?title=店铺搜索结果页";
    };
    componentWillMount(){
        let self = this;
        let {shop,cat} = this.props.location.query;
        let params = {
            shop_id:shop,
            cat_id: cat,
            pages: 1
        };
        axios.request({
            url:"/shop/shopCategory/itemList",
            method:'get',
            params: params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        }).then( result =>{
            self.setState({
                data:result.data.data.items,
                update: true
            })
        }).catch( error =>{
            console.error( error );
        });
    };
    render(){
        let {update,data} = this.state;
        return (
            <div data-page="search-page" id="storeResult">
                <SearchBarA />
                {update?(<ListInfoCtrl data={data}/>):(<LoadingRound/>)}
            </div>
        )
    }
}
//列表内容控制
export class ListInfoCtrl extends Component{
    dropDown(){
        console.log(111);
    };
    render(){
        const { data } = this.props;
        return(
            <div className="list-center" ref="itemList">
                { ( data && data.length ) ?
                    <DropDownList data={data} scrollArea={window} dropDown={this.dropDown}/>:
                    <SearchNone />
                }

            </div>
        )
    }
}
//内容列表
class ListInfo extends Component{
    getHtml(){
        return this.props.data.map( (item,i)=>{
            return <OneItem key={i} data={item}/>
        });
    }
    render(){
        return(
            <div className="list-main">
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
        let { item_id,sell_price,market_price,trade_type, primary_image, installment,title,promotionDetail,activity_price,activity_store,store,valid } = this.props.data;
        let saleOut = null;
        activity_store !== undefined ?  saleOut = activity_store<=0 : saleOut = store <=0;
        if( !valid  ) saleOut = true;
        return(
            <div className="one-item-grid">
                <div className="one-item">
                    <a href={RNDomain + "/item?item_id="+item_id}>
                        <div className="item-img">
                            <img src={primary_image+"_m.jpg"} />
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
                            <span>¥{ activity_price?(+activity_price).toFixed(2):(+sell_price).toFixed(2) }</span> {market_price?<del>¥{(+market_price).toFixed(2)}</del>:""}
                            {installment?<span className="c-cfff stage-sign">分期</span>:""}
                        </div>
                        <div className="item-promotion">
                            { promotionDetail && <span className="promotion-label">{promotionDetail.join(" | ")}</span>}
                        </div>
                    </a>
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