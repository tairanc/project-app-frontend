/**
 * Created by Administrator on 2017/8/10.
 */
import React, { Component } from 'react';
import axios from 'axios';

import './detail.scss';


let CancelToken = axios.CancelToken;
let cancel;

const pageApi = {
    data:{ url:"/originapi/shop/shopLicense" , method:"get"}
};
export default class StoreDetail extends Component {
    constructor(props,context){
        super(props);
        this.state = {
            image:""
        };
        document.title="店铺营业执照";
        if( context.isApp ) window.location.href = "jsbridge://set_title?title=店铺营业执照";
    };
    componentDidMount(){
        let self = this;
        axios.request({
            ...pageApi.data,
            params: {
                shop_id:this.props.location.query.shop
            },
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        }).then((value)=>{
            if(value.data.code==200){
                self.setState({image:value.data.data.license_img});
            }
        }).catch((err)=>{
            console.log(err);
        })
    };
    render(){
        var image = this.state.image;
        return (
            <div data-page="store-detail" style={{minHeight:$(window).height()}}>
                <div className="licenseTitle">店铺营业执照</div>
                <div className="licenseDesc">
                    <h1>泰然城网店经营者营业执照信息</h1>
                    <p> 根据国家工商总局《网络交易管理办法》要求对网店营业执照信息公示如下：</p>
                </div>
                <LicenseImage image={image}/>
                <p className="licenseImageDesc">（经营者信息以营业执照为准）</p>
            </div>
        )
    }
}
class LicenseImage extends Component{
    render(){
        return (
            <div className="licenseImage">
                <img src={this.props.image}/>
            </div>
        )
    }
}