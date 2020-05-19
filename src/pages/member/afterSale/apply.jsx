import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import Popup from 'component/modal';
import {Shady,LoadingRound} from 'component/common';
import axios from 'js/util/axios';
import {addImageSuffix} from "js/util/index";
import {MALLAPI} from 'config/index'

import {concatPageAndType,actionAxios} from 'js/actions/actions';
import {popupData} from 'js/filters/orderStatus';

const ctrlAPI = {
    submit: {url: `${MALLAPI}/user/sold/apply`, method: "post"},
    soldorder: {url: `${MALLAPI}/user/sold/goods-order`, method: "get"},

};
const createActions = concatPageAndType("afterSaleApply");
const popupActions = concatPageAndType("popup");
const axiosCreator = actionAxios("afterSaleApply");


const typeText = {
    "SELECT": "请选择",
    "restore": "退货退款",
    "refund": "仅退款"
};
const reasonText = {
    "restore": {
        "0": "请选择",
        "1": "商品与描述不符",
        "2": "商品错发漏发",
        "3": "收到商品破损",
        "4": "商品质量问题",
        "5": "个人原因退货",
        "6": "其他"
    },
    "refund": {
        "0": "请选择",
        "1": "商品与描述不符",
        "2": "商品错发漏发",
        "3": "收到商品破损",
        "4": "商品质量问题",
        "5": "个人原因退货",
        "6": "未收到货",
        "7": "商品问题已拒签",
        "8": "退运费",
        "9": "其他"
    }
};

let request = false;

class ApplyPage extends Component {
    componentWillMount() {
        document.title = "售后申请单";
        window.location = "jsbridge://set_title?title=售后申请单";
        request = false;
        this.props.resetData();
        let {dispatch} = this.props;
        let {tid} = this.props.location.query;
        dispatch(axiosCreator('getData', {...ctrlAPI.soldorder, params: {order_good_no:tid}}))
    }

    componentWillUnmount() {
        this.props.resetData();
    }

    render() {
        let {tid, refund,listType,typeChange,load,reason,reasonChange,
            moneyChange,data,ctrlPopup,dispatch,describeChange,applySubmit,hidePopup,popup,popupShow }
            = this.props;
        let {payment, is_gift} = data;
        return (
            <div data-page="after-sale-apply">
                {load ? <LoadingRound/>:
                <form id="applyForm">
                    <input type="hidden" name="order_good_no" value={tid}/>
                    <ApplyType refund={refund} typeChange={typeChange}
                               listType={listType}
                               reason={reason} reasonChange={reasonChange}/>
                    <ApplyReason payment={payment} refund={refund} ctrlPopup={ctrlPopup}
                                 listType={listType} reason={reason} data={data} dispatch={dispatch}
                                 is_gift={is_gift}/>
                    <ApplyDetail changeHandle={describeChange}/>
                    <ApplyVoucher dispatch={dispatch}/>
                    <SubmitBtn submitHandle={applySubmit}/>
                    <ApplyPopups popup={popup} listData={popupData[popup]}
                                 listType={listType}
                                 reason={reason}
                                 hidePopup={hidePopup}
                                 show={popupShow}
                                 reasonChange={reasonChange}
                                 typeChange={typeChange}/>
                </form>}
            </div>
        )
    }
}
class ApplyType extends Component {
    //选择售后类型
    checkAftertype = (e) => {
        //待发货时为仅退款可选
        let {typeChange, reasonChange, refund} = this.props;
        if ($(e.target).text() == "退货退款" && refund == 1) {
            return;
        }
        //处理再次点击都变为请选择
        $(e.target).hasClass('current-yesround') ? null : reasonChange(0);
        $(e.target).addClass('current-yesround').siblings().removeClass('current-yesround');
        let type = $(e.target).attr('data-type');
        typeChange(type);
    };

    componentDidMount() {
        let {refund, typeChange} = this.props;
        if (refund == 1) {
            typeChange('refund');
            $(".current-noround").addClass('current-yesround');
        }
    }

    render() {
        let {refund} = this.props;
        let afterType;
        afterType = refund == 0 ? popupData.type.list : popupData.type.onlylist;
        return (
            <section className="apply-section">
                <div className="type-container">
                    <div>售后类型</div>
                    <div className="after-type">
                        {afterType.map((item, i) => {
                            return (
                                <i key={item.select} data-type={item.select} className="current-noround"
                                   onClick={(e) => {
                                       this.checkAftertype(e)
                                   }}>
                                    {item.method}
                                </i>
                            )
                        })}
                    </div>
                </div>
            </section>
        )
    }
}
class ApplyReason extends Component {
    constructor(props) {
        super(props)
        this.state = {
            num: this.props.payment
        }

    }

    changeAmout = (event) => {
        let str = event.target.value;
        let {dispatch} = this.props;
        this.setState({
            num: (str.match(/^(\d)*\.?\d*$/) || [''])[0]
            },()=>{
            dispatch(createActions("changeMoney", {money: $("#logiCode").val()}))
        });
    };

    render() {
        //退货退款可编辑退款金额
        let {refund, ctrlPopup, reason, listType, data} = this.props;
        let {num,primary_image,spec_nature_info,title,payment,freight,is_gift} = data;
        return (
            <section className="apply-section">
                <div className="list-body">
                    <div className="list-img">
                        <Link>
                            <img
                                src={primary_image ? addImageSuffix(primary_image, '_s') : require('../../../img/icon/loading/default-no-item.png')}/>
                        </Link>
                    </div>
                    <div className="list-body-ctt">
                        <div className="order-info-detail">
                            <div className="order-info-top">
                                <Link
                                      className="order-info-title">{title}
                                </Link>
                                <div className="info-price">
                                    <div className="order-info-type">{spec_nature_info}</div>
                                    <div className="right">×{num}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="logic logic-company">
                        <span>退款原因：</span>
                        <input type="text" placeholder="请选择" maxLength="20"
                               value={listType === "SELECT" ? "请选择" : reasonText[listType][reason]} disabled={true}/>
                        <span onClick={ctrlPopup.bind(null, "reason", true)}>
                            <img src="/src/img/icon/arrow/arrow-right-m-icon.png"
                                 width="10"/></span>
                    </div>
                    <div className="logic logic-order">
                        <span>退款金额：￥</span>
                        <input type="text" id="logiCode" readOnly={(refund == 1)|| is_gift}
                               value={this.state.num}
                               onChange={(event) => {
                                   this.changeAmout(event)
                               }}
                               placeholder={`最多可退￥${payment}元`} maxLength="9"
                               name="amount"/>
                    </div>
                    <div className="limit-money">{`最多可退￥${payment}元`}{`含运费￥${freight}`}</div>
                </div>
            </section>
        )
    }

}
function afterSaleApplyState(state, props) {
    return {
        ...state.popup,
        ...state.afterSaleApply
    }
}

function afterSaleApplyDispatch(dispatch, props) {
    let {tid, refund} = props.location.query;
    return {
        dispatch: dispatch,
        resetData: () => {
            dispatch(createActions('resetData', {
                query: {
                    tid: tid,
                    listType: Number(refund) ? "SELECT" : "SELECT",
                    refund: refund !== undefined ? Number(refund) : ""
                }
            }));
            //dispatch(createActions('changeMoney', {money: Number(payment.trim())}));
        },
        moneyChange: (e) => {
            dispatch(createActions("changeMoney", {money: e.target.value.trim()}));
        },
        describeChange: (e) => {
            dispatch(createActions("changeDescribe", {description: e.target.value.trim()}))
        },
        ctrlPopup: (type, show) => {
            if (type === "reason") {
                dispatch((dispatch, getState) => {
                    let state = getState().afterSaleApply;
                    if (state.listType === "SELECT") {
                        Popup.MsgTip({msg: "请选择售后类型"});
                    } else {
                        dispatch(createActions("ctrlPopup", {popup: type, show: show}));
                    }
                })
            } else {
                dispatch(createActions("ctrlPopup", {popup: type, show: show}));
            }
        },
        reasonChange: function (reason) {
            dispatch(createActions("reasonChange", {reason: reason}));
        },
        typeChange: function (type, reason) {
            dispatch(createActions("typeChange", {listType: type, reasonList: reason}))
        },
        hidePopup: () => {
            dispatch(createActions('hidePopup', {show: false}));
        },
        promptClose() {
            dispatch(popupActions('ctrlPrompt', {prompt: {show: false, msg: ""}}));
        },
    }
}

function afterSaleApplyProps(stateProps, dispatchProps, props) {
    let request = false;
    let {dispatch} = dispatchProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...props,
        applySubmit: () => {
            if (request) return;
            if (stateProps.listType === "SELECT") {
                Popup.MsgTip({msg: "请选择售后类型"});
                return;
            }
            if (stateProps.reason == 0) {
                Popup.MsgTip({msg: "请选择退款原因"});
                return;
            }
            if (!(/^(\d)*\.?\d*$/).test(stateProps.money) || !stateProps.money) {
                Popup.MsgTip({msg: "请输入正确的退款金额"});
                return;
            }
            if(parseFloat(stateProps.money)>parseFloat(stateProps.paymentLarg)){
                Popup.MsgTip({msg: "超出最多可退金额"});
                return;
            }
            if (!stateProps.data.is_gift) {
                if (parseFloat(stateProps.money) < 0.01) {
                    Popup.MsgTip({msg: "退款金额不能小于0.01"});
                    return;
                }
            }else{
                if (parseFloat(stateProps.money) < 0) {
                    Popup.MsgTip({msg: "退款金额不能小于0.00"});
                    return;
                }
            }

            request = true;
            axios.request({
                ...ctrlAPI.submit,
                data: {
                    order_good_no: stateProps.tid,
                    type: stateProps.listType,
                    reason: reasonText[stateProps.listType][stateProps.reason],
                    amount: stateProps.money,
                    remark: stateProps.description,
                    images: stateProps.subArr
                }
            }).then(result => {
                Popup.MsgTip({msg: "申请成功"});
                setTimeout(() => {
                    browserHistory.replace('/afterSale/list');
                }, 1000)
            }).catch(error => {
                Popup.MsgTip({msg: error.response.data.message || "网络繁忙！"});
                request = false;
                throw new Error(error);
            })
        }
    }
}

export default connect(afterSaleApplyState, afterSaleApplyDispatch, afterSaleApplyProps)(ApplyPage);

class ApplyDetail extends Component {
    render() {
        return (
            <div className="apply-section">
                <section className="apply-detail">
                    <h3>详细说明</h3>
                    <div className="area">
                        <textarea name="remark" placeholder="最多200字" maxLength="200" onBlur={this.props.changeHandle}/>
                    </div>
                </section>
            </div>
        )
    }
}

class ApplyVoucher extends Component {
    render() {
        return (
            <section className="apply-section">
                <div className="apply-detail">
                    <h3>申请凭证</h3>
                    <MultiImgChoose maxLength={3} inputName={"evidence_pic[]"} dispatch={this.props.dispatch}/>
                </div>
            </section>
        )
    }
}

//凭证选择
class MultiImgChoose extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgArr: []
        };
        this.maxLength = props.maxLength || 3;
        this.selectIndex = 0;
        this.inputName = this.props.inputName;
    }

    componentDidMount() {
        window.onImageSelected = (jsonData) => {
            /*const objData = JSON.parse(jsonData);
            if (objData.success) {
                this.changePhoto(objData.data.image.url);
            }
            if (objData.error) {
                Popup.MsgTip({msg: "选择图片失败"});
            }*/
            let objData = jsonData;
            this.changePhoto(objData);
        }
    }

    choosePhoto = (index) => {
        this.selectIndex = index;
        let url = 'https://appapi.tairanmall.com/image/upload?from=user&type=aftersales';
        let bridgeUrl = 'jsbridge://choosePic?maxSize=2000&size=0&crop=false&postUrl=' + window.btoa(url);
        window.location = bridgeUrl;
    };
    changePhoto = (url) => {
        let {dispatch} = this.props;
        let {imgArr} = this.state;
        if (this.selectIndex >= imgArr.length) {
            imgArr.push(url);
        } else {
            imgArr[this.selectIndex] = url;
        }
        this.setState({imgArr},() => {dispatch(createActions('setsubImgArr', {subArr: imgArr}))});
    };
    deletePhoto = (index) => {
        const {imgArr} = this.state;
        let {dispatch} = this.props;
        imgArr.splice(index, 1);
        this.setState({imgArr},() => {dispatch(createActions('setsubImgArr', {subArr: imgArr}))});

    };

    componentWillUnmount() {
        window.onImageSelected = null;
    }

    render() {
        return (
            <div className="multi-img-choose c-clrfix">
                {this.state.imgArr.map((item, i) => {
                    return <div className="photo" key={i}>
                        <img src={item} onClick={e => this.choosePhoto(i)}/>
                        <input type="hidden" class="subimgArr" name={this.inputName} value={item}/>
                        <i className="red-delete-icon" onClick={e => this.deletePhoto(i)}> </i>
                    </div>
                })
                }
                {this.state.imgArr.length < this.maxLength &&
                <div className="photo" onClick={e => this.choosePhoto(this.state.imgArr.length)}>
                    <img src="/src/img/afterSale/voucher-img.png"/>
                </div>
                }
            </div>
        )
    }
}

class SubmitBtn extends Component {
    render() {
        return (
            <div className="btm-btn colour-btn" onClick={this.props.submitHandle}>提交申请</div>
        )
    }
}

//弹窗选择
class ApplyPopups extends Component {
   /* typeChangeHandle = (select) => {
        if (select == this.props.listType) {
            this.props.typeChange(select, this.props.reason);
        } else {
            this.props.typeChange(select, 0);
        }
    };*/

    render() {
        const {listData, popup, listType, reason, show} = this.props;
        let listHtml = "";
        if (popup === "reason") {
            listHtml = listData.list[listType].map((item, i) => {
                return (
                    <div className="list" key={`reason-${i}`} onClick={(e) => this.props.reasonChange(item.select)}>
                        <div className="one">{item.content}</div>
                        {item.select == reason && <i className="current-yesround-icon"> </i>}
                    </div>
                )
            });
        }
        return (
            <div>
                {show && <Shady clickHandle={this.props.hidePopup}/>}
                <div className={`total-popup ${show ? "active" : ""}`}>
                    <div className="popup-top">{show && listData.title}<i className="black-close-icon"
                                                                          onClick={this.props.hidePopup}> </i></div>
                    <div className="popup-body">
                        {listHtml}
                    </div>
                </div>
            </div>
        )
    }
}