import React, {Component} from 'react';
import {browserHistory, connect} from 'react-redux';
import {actionAxios, concatPageAndType} from 'js/actions/actions';
import {LoadingRound, Shady,CustomerService} from 'component/common';
import {MALLAPI} from 'config/index';
import {asProcess, asReminder, asStatus, asTypes} from 'js/filters/orderStatus';


const createActions = concatPageAndType("consultrecord");
const axiosCreator = actionAxios("consultrecord");


const pageApi = {
    init: {url: `${MALLAPI}/user/sold/info`, method: "get"}
};


class Consultrecord extends Component {
    componentWillMount() {
        this.props.resetData();
        this.props.getData();
    }

    render() {
        let {load, data} = this.props;
        let {type, status, updated_at} = data;
        return (
            <div data-page="after-consult-record">
                {load ? <LoadingRound/>
                    : <div>
                        <h5 className="newest-info">最新消息来源于 {updated_at}</h5>
                        {status == 70 && <Abandonmen/>}
                        {status == 80 && <Refundtimeout/>}
                        {type == 20 && /20|30/.test(status) && <Secondstore data={data}/>}
                        {type == 20 && /20|30|50/.test(status) && <Firuserrespons data={data}/>}
                        {status != 70 && status != 10&& <Firstmerchart data={data}/>}
                        <ApplyInfo data={data}/>
                        <Concatxn data={data}/>
                    </div>}
            </div>
        )
    }
}

class Concatxn extends Component{
    render(){
        let {shop:{attr}, goods_order} = this.props.data;
        /*let {customer_service_id} = shop;
        let serverId = customer_service_id;
        let itemId = goods_order.item_id;
        let config = {
            "itemid": (itemId + ''),
            "pageURLString": location.href,
            "settingid": serverId ? serverId : "xt_1000_1498530991111",
            "pageTitle": "售后详情"
        };*/
        return(
            <div>
	            <CustomerService className="save" shopAttr={attr}>
                    <button className="btm-btn  colour-btn">
                        联系客服
                    </button>
                </CustomerService>
            </div>
        )
    }
}
class Firstmerchart extends Component {
    render() {
        let {status, type, refund_amount,nod_remark,delivery} = this.props.data;
        return (
            <div className="common-container">
                <h2>商家</h2>
                {type == 10 && /20|30/.test(status) &&
                <div>
                    <h3>同意售后申请</h3>
                    <div className="aftersale-text">
                        退款金额 ：￥{refund_amount}
                    </div>
                </div>}
                {/10|20/.test(type)&&status == 10&&
                    <div className="aftersale-text">
                        待审核
                    </div>}
                {type == 20 && /20|30|40|50|80/.test(status) && !!delivery &&
                <div>
                    <h3>同意售后申请并给出回寄信息</h3>
                    <div className="aftersale-text">
                        收货人 ：{delivery.receiver.name}
                    </div>
                    <div className="aftersale-text">
                        联系电话 ：{delivery.receiver.mobile}
                    </div>
                    <div className="aftersale-text">
                        收货地址 ：{delivery.receiver.address}
                    </div>
                </div>}
                {status == 60 && <div>
                    <h3>商家驳回售后申请</h3>
                </div>}
                {nod_remark && <div className="aftersale-text">
                    商家留言 ：{nod_remark}
                </div>}
            </div>
        )
    }
}

//用户寄回信息
class Firuserrespons extends Component {
    render() {
        let {delivery, status} = this.props.data;
        let {sender} = delivery;
        let {corp_name, delivery_no} = sender;
        return (
            <div className="common-container">
                <h2>用户</h2>
                <h3>寄回商品</h3>
                {/30|50|20/.test(status)&&<div>
                    <div className="aftersale-text">
                        物流公司 ：{corp_name}
                    </div>
                    <div className="aftersale-text">
                        物流单号 ：{delivery_no}
                    </div>
                </div>}

            </div>
        )
    }
}

//用户撤销售后
class Abandonmen extends Component {
    render() {
        return (
            <div className="common-container">
                <h2>用户</h2>
                <h3>用户撤回售后申请</h3>
            </div>
        )
    }
}
//用户超时填写物流
class Refundtimeout extends Component {
    render() {
        return (
            <div className="common-container">
                <h2>用户</h2>
                <h3>用户超时填写物流</h3>
            </div>
        )
    }
}

//商家收货
class Secondstore extends Component {
    render() {
        let {refund_amount} = this.props.data;
        return (
            <div className="common-container">
                <h2>商家</h2>
                <h3>收到货并操作退款</h3>
                <div className="aftersale-text">
                    退款金额 ：￥{refund_amount}
                </div>
            </div>
        )
    }
}

class ApplyInfo extends Component {

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
        let {images, user_remark, reason, type, apply_amount} = data;
        let imgArr = [];
        if (images) {
            imgArr = images;
        }
        return (
            <div className="common-container" style={{paddingBottom:"80px"}}>
                <h2>用户</h2>
                <h3>发起售后申请</h3>
                <div className="aftersale-text">
                    售后类型 ：{asTypes[type]}
                </div>
                <div className="aftersale-text">
                    退款金额 ：￥{apply_amount}
                </div>
                <div className="aftersale-text">
                    退款原因 ：{reason}
                </div>
                {user_remark && <div className="aftersale-text">
                    详细说明：{user_remark}
                </div>}
                {images ?
                    <div className="img">
                        {imgArr.map((item, i) => {
                            return <img className="img-voucher" src={item} key={i} width="75" height="75" onClick={this.showBigPicture}/>
                        })
                        }
                    </div> : ""
                }
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


function consultrecordState(state, props) {
    return {
        ...state.consultrecord
    }
}

function consultrecordDispatch(dispatch, props) {
    let {oid} = props.location.query;
    return {
        dispatch: dispatch,
        getData: () => {
            dispatch(axiosCreator('getData', {...pageApi.init, params: {after_sale_bn: oid}}))
        },
        resetData: () => {
            dispatch(createActions('resetData'));
        },
    }
}

function consultrecordProps(stateProps, dispatchProps, props) {
    let {dispatch} = dispatchProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...props
    }
}

export default connect(consultrecordState, consultrecordDispatch, consultrecordProps)(Consultrecord);