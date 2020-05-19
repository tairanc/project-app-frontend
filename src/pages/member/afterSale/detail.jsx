import React, {Component} from 'react';
import {Link,browserHistory} from 'react-router';
import Popup from 'component/modal';
import {CustomerService,LoadingRound, Shady} from 'component/common';
import {connect} from 'react-redux';
import Clipboard from "clipboard";
import axios from 'js/util/axios';
import {MALLAPI} from 'config/index'
import {LogicBlock} from './list'
import {timeUtils} from 'js/common/utils.js';
import {actionAxios, concatPageAndType} from 'js/actions/actions';
import {asProcess, asReminder, asStatus, asTypes} from 'js/filters/orderStatus.js';
import {base64encode, utf16to8} from "js/util/index";



const ctrlAPI = {
    init: {url: `${MALLAPI}/user/sold/info`, method: "get"},
    logistics: {url: `${MALLAPI}/user/sold/send`, method: "post"}
};

const createActions = concatPageAndType('afterSaleDetail');
const axiosCreator = actionAxios("afterSaleDetail");


class AfterSaleDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            update: false,
            error: false,
            data: ""
        }
    }
    //校验按钮
    handelBtn = () => {
        let {companycode, dispatch} = this.props;
        $("#logiCode").val($("#logiCode").val().replace(/[^a-zA-Z0-9]/g, ''));
        let logiCode = $("#logiCode").val();
        if (companycode && logiCode && logiCode.length>=6 ) {
            dispatch(createActions('changebtnFlag', {btnFlag: false}))
        } else {
            dispatch(createActions('changebtnFlag', {btnFlag: true}))
        }

    };
    componentWillMount() {
        document.title = "售后申请单详情";
        window.location.href = "jsbridge://set_title?title=售后申请单详情";
        this.props.resetData();
        this.props.getData();
    }

    componentWillUnmount() {
        const msgTip = document.querySelector("#msgTip");
        msgTip && msgTip.parentNode && msgTip.parentNode.removeChild(msgTip);
    }

    render() {
        if (this.props.load) {
            return <LoadingRound/>;
        }
        let {companyname = "", companycode = "",corpid="",data} = this.props;
        return (
            <div data-page="after-sale-detail">
                <Afterstatus data={data}/>
                {data.status > 10 && <InfoBlock data={data}/>}
                {data.status == 40 && <Logicmsg data={data} handelBtn={this.handelBtn} corpid={corpid}
                                                companyname={companyname} companycode={companycode}/>}
                {!!data.nod_remark && <Infostroemsg data={data}/>}
                <InfoList data={data}/>
                <Consultmsg bn={data.bn}/>
                <InfoDetail data={data}/>
                <div className="bottom-blank"></div>
                {data.status == 40 && <SubLoginbtn {...this.props} />}
            </div>
        )
    }
}

class SubLoginbtn extends Component {
    //提交函数
    sublogMsg = () => {
        let {data, companyname,corpid} = this.props;
        let {bn} = data;
        let logiCode = $("#logiCode").val();
        axios.request({
            ...ctrlAPI.logistics, data: {
                after_sale_bn: bn,
                delivery: {
                    corp_name: companyname,
                    delivery_no: logiCode,
                    corp_id:corpid
                }
            }
        }).then(result => {
            Popup.MsgTip({msg: "保存成功"});
            setTimeout(() => {
                browserHistory.push('/afterSale/list');
            }, 1000);
        }).catch(error => {
            Popup.MsgTip({msg: "服务器繁忙"});
        })
    };

    render() {
        let {btnFlag} = this.props;
        return (
            <div className="subLoginbtn">
                <button className={btnFlag ? "btm-btn" : "btm-btn  colour-btn"} onClick={this.sublogMsg}
                        disabled={btnFlag}>
                    提交
                </button>
            </div>
        )
    }
}

class Afterstatus extends Component {
    render() {
        let {status,extra,now} = this.props.data;
        return (<div className="afterstatus">
            <div className="after-step">
                {asProcess[status]}
            </div>
            <div className="after-remind">
                {asReminder[status]}
            </div>
            {status == 40 && extra&&
            <div className="remind-logic">
                <LogicBlock timeout = {extra.delivery_due} now={now}/><span>逾期未填写物流信息将自动关闭售后申请</span>
            </div>}
        </div>)
    }
}

class Infostroemsg extends Component {
    render() {
        let { data: { shop:{attr}, nod_remark}} = this.props;
        return (
            <div className="info-stroe">
                <div className="info-list">
                    <h3 className="c-pr">商家留言
                        <CustomerService className="save" shopAttr={attr}>
                            <button className="c-pa server"></button>
                        </CustomerService>
                    </h3>
                    <div className="text">{nod_remark}</div>
                </div>
            </div>
        )
    }
}

class Consultmsg extends Component {
    render() {
        let {bn} = this.props;
        return (
            <div className="info-stroe">
                <div className="info-list">
                    <h3 className="c-pr">协商记录
                        <Link to={`/afterSale/consultrecord?oid=${bn}`}><img src="/src/img/icon/arrow/arrow-right-m-icon.png" width="10" height="15"/></Link>
                    </h3>
                </div>
            </div>
        )
    }
}

const InfoList = ({data}) => (
    <div className="info-list">
        <h3>售后信息</h3>
        <div className="list">
            <div className="left">售后单号：</div>
            <div className="right">{data.bn}</div>
        </div>
        <div className="list">
            <div className="left">申请时间：</div>
            <div className="right">{data.created_at}</div>
        </div>
        <div className="list">
            <div className="left">售后类型：</div>
            <div className="right">{asTypes[data.type]}</div>
        </div>
        <div className="list">
            <div className="left">退款金额：</div>
            <div className="right amount">¥{data.refund_amount?(+data.refund_amount).toFixed(2):(+data.apply_amount).toFixed(2)}</div>
        </div>
        </div>
);

class Logicmsg extends Component {
    render() {
        let {data, companyname, handelBtn} = this.props;
        return (
            <div className="info-list">
                <h3>退货物流信息</h3>
                <div>
                    <div className="logic logic-company">
                        <span>物流公司：</span>
                        <input type="text" placeholder="请选择" maxLength="20" defaultValue={companyname} disabled/>
                        <Link to={`/afterSale/logicompany`}><img src="/src/img/icon/arrow/arrow-right-m-icon.png"
                                                                 width="10"/></Link>
                    </div>
                    <div className="logic logic-order">
                        <span>物流单号：</span>
                        <input type="text" id="logiCode" placeholder="请填写物流单号"
                               onChange={() => {
                                   handelBtn()
                               }} maxLength="20"/>
                    </div>
        </div>
    </div>
        )
    }
}

class InfoDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: "",
            bigShow: false
        }
    }

    showBigPicture = (e) => {
        this.setState({
            imgSrc: e.target.src,
            bigShow: true
        });
    };
    hideBigPicture = () => {
        this.setState({
            imgSrc: "",
            bigShow: false
        })
    };

    render() {
        const {data} = this.props;
        let imgArr = [];
        if (data.images) {
            imgArr = data.images;
        }
        return (
            <div className="info-detail">
                <div className="detail-explain">
                    <h3>问题描述</h3>
                    <div className="text">
                        退款原因 ：{data.reason}
                    </div>
                    {!!data.user_remark&&<div className="text">
                        详细描述：{ data.user_remark}
                    </div>}
                {data.images ?
                        <div className="img">
                            {imgArr.map((item, i) => {
                                return <img src={item} key={i} width="75" height="75" onClick={this.showBigPicture}/>
                            })
                            }
                    </div> : ""
                }
                </div>
                {imgArr && this.state.bigShow ?
                    <div>
                        <Shady clickHandle={this.hideBigPicture}/>
                        <div onClick={this.hideBigPicture} className="big-picture">
                            <img src={this.state.imgSrc}/>
                        </div>
                    </div> : ""
                }
            </div>
        )
    }
}

class InfoBlock extends Component {
    //复制功能
    copyConent = () => {
        let  clipboard = new Clipboard('#copy');
        let value = $('#copyname').text()+$('#copymobile').text()+$('#copyaddress').text();
        $('#copy').attr('data-clipboard-text', value);
        let  copynum = 0;
        clipboard.on('success', function () {
            //优雅降级:safari 版本号>=10,以及部分安卓机，提示复制成功;否则提示需在文字选中后，手动选择“拷贝”进行复制
            Popup.MsgTip({msg: "退货地址复制成功!"});
            copynum++;
            if(copynum >= 1){
                clipboard.destroy();
                clipboard = new Clipboard('#copy');
            };
        });
        clipboard.on('error', function () {
            Popup.MsgTip({msg: "请长按进行复制"});
        });
    };
    render() {
        let {data, data: {delivery}} = this.props;
        let{status} = data;
        return (
            <div className="info-block">
                {asTypes[data.type] !== "仅退款" && delivery && status==40&&
                <div className="info-list">
                    <h3>{/*<i className="location-address-icon"> </i>*/}退货寄回信息
                        <button className="copy" id="copy" data-clipboard-text="复制内容"  onTouchStart={() => {this.copyConent()}}>复制</button>
                    </h3>
                    <div className="text">
                        <p>收货人：<span id="copyname">{delivery.receiver.name}</span></p>
                        <p>联系电话：<span id="copymobile">{delivery.receiver.mobile}</span></p>
                        <p>收货地址：<span id="copyaddress">{delivery.receiver.address}</span></p>
                    </div>
                </div>
                }
                {data.type === 20 && (data.status == 50 || data.status == 20 || data.status == 30) && delivery &&
                <div className="info-list">
                    <h3>{/*<i className="black-car-icon"> </i>*/}退货物流信息</h3>
                    <div className="text">
                        {!!delivery.sender && <p>物流公司：{delivery.sender.corp_name}</p>}
                        {!!delivery.sender && <p>货运单号：{delivery.sender.delivery_no}</p>}
                        {!!delivery.created_at && <p>退货时间：{delivery.created_at}</p>}

                    </div>
                </div>
                }
            </div>)
    }
};

function afterSaleDetailState(state, props) {
    return {
        companycode: state.logicompany.companycode,
        companyname: state.logicompany.companyname,
        corpid:state.logicompany.corpid,
        ...state.afterSaleDetail
    }
}

function afterSaleDetailDispatch(dispatch, props) {
    let {oid} = props.location.query;
    return {
        dispatch,
        resetData: () => {
            dispatch(createActions('resetData'));
        },
        getData: () => {
            dispatch(axiosCreator('getData', {...ctrlAPI.init, params: {after_sale_bn: oid}}))
        }
    }
}

export default connect(afterSaleDetailState, afterSaleDetailDispatch)(AfterSaleDetail);