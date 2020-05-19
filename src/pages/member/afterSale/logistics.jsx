import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import Popup from 'component/modal';
import {LoadingRound} from 'component/common';
import axios from 'js/util/axios';
import {MALLAPI} from 'config/index'

const ctrlAPI = {
    init: {url: `${MALLAPI}/user/sold/info`, method: "get"},
    logistics: {url: `${MALLAPI}/user/sold/send`, method: "post"}
};

export default class AfterSaleLogistics extends Component {
    constructor(props) {
        super(props);
        document.title = " 物流填写";
        window.location.href = "jsbridge://set_title?title=物流填写";
        this.state = {
            update: false,
            error: false,
            data: ""
        };
        this.req = false;
    }

    submitHandle = () => {
        let name = $("#logiName").val().trim();
        let num = $("#logiNum").val().trim();
        if (name == "") {
            Popup.MsgTip({msg: "请输入物流公司"});
            return;
        }
        if (num == "") {
            Popup.MsgTip({msg: "请输入货运单号"});
            return;
        }
        if (this.req) {
            return;
        }
        this.req = true;
        /*ownAjax(ctrlAPI.logistics,$("#logisticsForm").serialize() )
            .then( result =>{
                Popup.MsgTip({msg:result.msg });
                this.req = false;
                if( !result.status ) return;
                setTimeout(()=>{
                    browserHistory.push('/afterSale/list');
                },2000);
            })
            .catch( xhr =>{
                this.req = false;
                Popup.MsgTip({msg:"网络错误，请稍后再试"});
            });*/
        axios.request({
            ...ctrlAPI.logistics, data:
                {
                    after_sale_bn: this.props.location.query.asid,
                    delivery: {
                        corp_name: name,
                        delivery_no: num
                    }
                }
        }).then(result => {
            if (result.data.code === 0) {
                Popup.MsgTip({msg: "提交成功"});
                this.req = false;
                setTimeout(() => {
                    browserHistory.push('/afterSale/list');
                }, 2000);
            } else {
                return;
            }
        }).catch(err => {
            console.log(err);
            this.req = false;
            Popup.MsgTip({msg: "网络错误，请稍后再试"});
        })
    };

    componentDidMount() {
        /*ownAjax(ctrlAPI.init,{id:this.props.location.query.asid})
            .then(( result )=>{
                if( !result.status ){
                    Popup.MsgTip({msg:result.msg });
                    return;
                }
                this.setState({ data:result.data, update:true });
            })
            .catch((error)=>{
                Popup.MsgTip({msg:"网络错误，请稍后再试"});
            });*/
        axios.request({
            ...ctrlAPI.init,
            params: {after_sale_bn: this.props.location.query.asid}
        }).then(result => {
            this.setState({data: result.data.data.delivery, update: true});
        }).catch(err => {
            Popup.MsgTip({msg: "网络错误，请稍后再试"});
        })
    }

    render() {
        const {update, data} = this.state;
        if (!(update && data)) {
            return <LoadingRound/>
        }
        return (
            <form data-page="after-sale-logistics" id="logisticsForm">
                <input type="hidden" name="aftersales_bn" value={this.props.location.query.asid}/>
                <input type="hidden" name="corp_code" value="other"/>
                <InfoBlock data={data.receiver}/>
                <SubBtn onSubmit={this.submitHandle}/>
            </form>
        )
    }
}

const InfoBlock = ({data}) => (
    <div className="info-block">
        <div className="info-list">
            <h3><i className="location-address-icon"> </i>退货地址</h3>
            <div className="text">
                <div className="address">
                    <span>地址：</span>
                    <div className="g-col-1">{data.address}</div>
                </div>
                <p>收件人：{data.name}</p>
                <p>电话：{data.mobile}</p>
            </div>
        </div>
        <div className="info-list">
            <h3><i className="black-car-icon"> </i>退货物流信息</h3>
            <div className="text">
                <div className="top">请填写您回寄的物流信息</div>
                <div className="input-strip">
                    <div className="left">物流公司</div>
                    <div className="right"><input type="text" name="corp_name" id="logiName" maxLength="38"
                                                  placeholder="请填写物流公司"/></div>
                </div>
                <div className="input-strip">
                    <div className="left">货运单号</div>
                    <div className="right"><input type="text" name="delivery_no" id="logiNum" maxLength="38"
                                                  placeholder="请填写货运单号"/></div>
                </div>
            </div>
        </div>
    </div>
);

const SubBtn = ({onSubmit}) => {
    return <div className="btm-btn colour-btn" onClick={onSubmit}>提交</div>
};