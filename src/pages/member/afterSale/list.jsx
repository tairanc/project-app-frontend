import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import Popup, {ModalAComp} from 'component/modal';
import axios from 'js/util/axios';
import {MALLAPI, RNDomain} from 'config/index'
import {asProcess, asStatus, asTypes, ordersubStatusAndIconMap, storeIcon} from 'js/filters/orderStatus.js';
import {timeUtils} from 'js/common/utils.js';
import {LoadingRound, NoMore, NoMorePage} from 'component/common';
import {addImageSuffix, dateUtil} from "js/util/index";
import result from "../../search/result";



const ctrlAPI = {
    init: {url: `${MALLAPI}/user/sold/list`, method: "get"},
    revoke: {url: `${MALLAPI}/user/sold/recall`, method: "post"}
};

class AfterSaleList extends Component {
    constructor(props) {
        super(props);
        document.title = "退款/售后";
        window.location.href = "jsbridge://set_title?title=退款/售后";
        this.state = {
            data: [],
            update: false,
            hasMore: true,
            Sending: false,
            status: false,
            msg: ""
        };
        this.page = 1;
    }
    getData = ()=>{
        axios.request({
            ...ctrlAPI.init, params: {page: 1, page_size: 10}
        }).then( ({data}) =>{
            let {list,pager} = data.data;
            this.setState({
                update: true,
                data:list,
                hasMore:pager.current_page<pager.total_page
            })
        }).catch(err => {
            console.log(err);
            Popup.MsgTip({msg: "网络错误，请稍后再试"});
        })
    };
    addData = () => {
        let {hasMore} = this.state;
        if(hasMore){
            this.page++;
            axios.request({
                ...ctrlAPI.init, params: {page: this.page, page_size: 10}
            }).then( ({data}) =>{
                let {list,pager} = data.data;
                this.setState({
                    data:this.state.data.concat(list),
                    hasMore:pager.current_page<pager.total_page,
                    Sending:false
                })
            }).catch(err => {
                console.log(err);
                Popup.MsgTip({msg: "网络错误，请稍后再试"});
            })
        }else{
            this.setState({Sending:false})
        }

    }

    componentWillMount() {
        this.getData();
    }

    componentDidMount() {
        let self = this;
        let {Sending, hasMore} = this.state;
        $(window).bind('scroll.loadmore', function () {
            let $this = $(this);
            let scrollH = $this.scrollTop();
            let scrollHeight = $(".order-list").height() - $(window).height() - 30;
            if (scrollH > scrollHeight) {
                if (hasMore && (!Sending)) {
                    self.setState({Sending:true},()=>{
                        self.addData();
                    });

                }
            }
        })
    }

    componentWillUnmount() {
        $(window).unbind('scroll.loadmore');
        const msgTip = document.querySelector("#msgTip");
        msgTip && msgTip.parentNode && msgTip.parentNode.removeChild(msgTip);
    }

    reminderKnow = (status, msg) => {
        this.setState({
            status: status,
            msg: msg
        })
    };

    render() {
        const {update, data, Sending, hasMore,status,msg} = this.state;
        return (
            <div data-page="after-sale-list">
                {update && data ?
                    (data && data.length) ?
                        <div className="order-list">
                            <OrderList data={data} reminderKnow={this.reminderKnow}/>
                            {Sending && <div style={{"textAlign":"center"}}><img src={ require("../../../img/icon/loading/loading-round.gif")} alt=""/></div>}
                            {!hasMore && <NoMore/>}
                            <ModalAComp active={status}
                                        msg={msg}
                                        btns={[{
                                            text: "我知道了", cb: () => {
                                                this.setState({
                                                    status: false,
                                                })
                                            }
                                        }]}/>
                        </div> :
                        <NoMorePage text={"您还没有售后记录哦"}/> :
                    <LoadingRound/>
                }
            </div>
        )
    }
}

class OrderList extends Component {
    render() {
        let {data, reminderKnow} = this.props;
        return <div> {
            data.map((item, i) => {
                return <OneOrderGrid data={item} key={i} reminderKnow={reminderKnow}/>
            })
        }</div>
    }
}

const OneOrderGrid = ({data, reminderKnow}) => {
    return (
        <div className="one-order-grid">
            <StripTop data={data}/>
            <OneOrder data={data}/>
            <Dealstatus data={data}/>
            {!(data.status == 50 || data.status == 30) && <OrderCtrl data={data} reminderKnow={reminderKnow}/>}
        </div>
    )
}

//一个订单头部
class StripTop extends Component {
    render() {
        let {shop, type} = this.props.data;
        let {is_open, id, alias, name, shop_icon} = shop;
        return (
            <div className="order-info-time">
                <div className="shop-name">
                    {storeIcon(shop_icon)}
                    <a href={is_open === 1 ? `/store/home?shop=${id}` : 'javascript:void(0)'}>
                        <span className="left">{alias ? alias : name}</span>
                    </a>
                </div>
                {is_open === 1 &&
                <div className="arrow-right">
                    <a href={is_open === 1 ? `/store/home?shop=${id}` : 'javascript:void(0)'}>
                        <img src="/src/img/icon/arrow/arrow-right-m-icon.png"/>
                    </a>
                </div>}
                <span className="right order-status">{asTypes[type]}</span>
            </div>

        )
    }
}

//订单处理状态
class Dealstatus extends Component {
    render() {
        let {status, extra, now} = this.props.data;
        return (
            <div className="order-ctrl deal-status">
                <span>{asProcess[status]}</span>
                {status == 40 && extra && <LogicBlock timeout={extra.delivery_due} now={now}/>}
            </div>
        )
    }
}

//一件商品订单
class OneOrder extends Component {
    render() {
        let {data} = this.props;
        // let {bn, gifts = []} = data;
        return (
            <div className="one-order">
                <OneOrderInfo data={data}/>
                {/*{!!gifts.length && gifts.map((item, i) => {
                    return <Gifts data={item} key={i} bn={bn}/>
                })}*/}
            </div>
        )
    }

};

class Gifts extends Component {
    render() {
        let {data, bn} = this.props;
        let {} = data;
        return (
            <div className="one-order">
                <div className="order-info">
                    <div className="list-body">
                        <div className="list-img">
                            <Link to={`/afterSale/detail?oid=${bn}`}>
                                <img src={data.primary_image}/>
                            </Link>
                        </div>
                        <div className="list-body-ctt">
                            <div className="order-info-detail">
                                <div className="order-info-top">
                                    <Link to={`/afterSale/detail?oid=${bn}`}
                                          className="order-info-title">{data.title}</Link>
                                    <div className="order-info-type">{data.spec_nature_info}</div>
                                    <span className="gifts-lable">赠品</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="gifts">
                            <span className="tag">【赠品】</span>
                            <div className="gTitle">{data.title}</div>
                            <span className="price">× {data.num}</span>
                        </div>*/}
                </div>
            </div>
        )
    }
}

//一件商品订单信息
const OneOrderInfo = ({data}) => {
    let {bn, goods_order,item_type} = data;
    return (
        <div className="order-info">
            <div className="list-body">
                <div className="list-img">
                    <Link to={`/afterSale/detail?oid=${bn}`}>
                        <img
                            src={goods_order.primary_image ? addImageSuffix(goods_order.primary_image, '_s') : require('../../../img/icon/loading/default-no-item.png')}/>
                    </Link>
                </div>
                <div className="list-body-ctt">
                    <div className="order-info-detail">
                        <div className="order-info-top">
                            <Link to={`/afterSale/detail?oid=${data.bn}`}
                                  className="order-info-title">{goods_order.title}
                            </Link>
                            <div className="info-price">
                                <div className="order-info-type">{goods_order.spec_nature_info}</div>
                               {/* <div className="right">×{data.num}</div>*/}
                            </div>
                            {item_type==20&&<div>
                                <span className="gifts-lable">赠品</span>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

class OrderCtrl extends Component {
    cancelDelete = () => {
        Popup.Modal({
            isOpen: true,
            msg: "您最多可以在售后保障期内发起3次申请，确定撤销？"
        }, () => {
            axios.request({
                ...ctrlAPI.revoke,
                params: {after_sale_bn: this.props.data.bn}
            }).then(result => {
                Popup.MsgTip({msg: "撤销成功"});
                window.location.reload();
            }).catch(err => {
                Popup.MsgTip({msg: err.response.data.message || "小泰发生错误，请稍后再试~"});
            })
        })
    };
    btnOrlink = (isTimeout, isCountout) => {
        let {data, reminderKnow} = this.props;
        if (isTimeout) {
            reminderKnow(true, "商品无法申请售后，可能已经超过售后保障期");
        } else if (isCountout) {
            reminderKnow(true, "最多可以发起3次售后申请");
        } else {
            browserHistory.push(`/afterSale/apply?tid=${data.order_good_no}&refund=${ordersubStatusAndIconMap[data.goods_order.order_shop.status]['status'] === "待发货" ? 1 : 0}`)
        }

    };

    render() {
        let {data, reminderKnow} = this.props;
        let {type, status, bn, is_timeout, is_count_run_out} = data;
        return <div className="order-ctrl">
            {status == 10
            && <Link onClick={this.cancelDelete} className="btn-red">撤销退款</Link>}
            {status == 40 &&
            <Link to={`/afterSale/detail?oid=${bn}`} className="btn">填写物流</Link>}
            {/60|70|80/.test(status) && <a className="btn" onClick={() => {
                this.btnOrlink(is_timeout, is_count_run_out)
            }}>
                申请售后
            </a>}
        </div>
    }
}


function afterSaleListState(state) {
    return {
        ...state.afterSaleList
    }
}

//物流超时倒计时
export class LogicBlock extends Component {
    constructor(props) {
        super(props);
        let retime;
        let {timeout, now} = this.props;
        //retime = parseInt(new Date(timeout.replace(/-/g, '/')).getTime() / 1000) - (parseInt(new Date().getTime() / 1000));
        retime = timeout - now;
        if (retime > 0) {
            this.state = {
                retime: retime
            }
        } else {
            this.state = {
                retime: 0
            }
        }

    }


    componentDidMount() {
        let {retime} = this.state;
        retime > 0 && this.intervalreTime();
    }

    componentWillUnmount() {
        window.clearInterval(this.retimer);
    }

    intervalreTime = () => {
        this.retimer = setInterval(() => {
            let t = --this.state.retime;
            if (t < 0) {
                window.clearInterval(this.retimer);
                this.setState({retime: 0})
            } else {
                this.state.retime = t;
                this.setState(this.state)
            }
        }, 1000)
    };

    formatTime(time) {
        return dateUtil.formatNum(parseInt(time))
    }
    dealTime = (retime) => {
        let html='';
        let day,hours,min,sec;
        day=this.formatTime(retime / 3600 / 24);
        hours=this.formatTime(retime / 3600 % 24);
        min=this.formatTime(retime % 3600/60);
        sec=this.formatTime(retime %60);
        html=day!=0? `${day}天${hours}时`: (hours!=0? `${hours}时${min}分`:`${min}分${sec}秒`);
        return html;
    };
    render() {
        let {retime} = this.state;
        return (
            <span className="block-time">
                <span>还剩{this.dealTime(retime)}</span>
            </span>
        );

    }
}


function afterSaleListDispatch(dispatch) {
    return {
        dispatch,
        getData: () => {
            dispatch(axiosCreator('getData', {...pageApi.init, params: {page: 1, page_size: 10}}, {page: 1}));
        },
        addData: (page) => {
            dispatch(axiosCreator('addData', {...pageApi.init, params: {page: page, page_size: 10}}, {page: page}));
        },
        changeSending: (tof) => {
            dispatch(createActions('changeSending', {value: tof}));
        }
    }
}

export default connect(afterSaleListState, afterSaleListDispatch)(AfterSaleList);