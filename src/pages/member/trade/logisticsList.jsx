import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import axios from 'js/util/axios';
import Popup from 'component/modal';
import {RNDomain,MALLAPI} from 'src/config/index'
import Clipboard from "clipboard";
import {LoadingRound} from 'component/common';
import './logisticsList.scss';

const ctrlAPI = {
    tracking: { url: `${MALLAPI}/user/orderTracking/get`, method: "get" },//物流数据
    packageInfo: { url: `${MALLAPI}/user/deliveryList` },//包裹信息
};

export default class LogisticsList extends Component {
    constructor(props) {
        super(props);
        let { tid } = props.location.query;
        this.state = {
            tid: tid,
            update: false,
            total: '',
            logisticsData: [],
            is_express: false
        }
    };
    componentWillMount() {
        if (!this.state.tid) {
            browserHistory.push("/");
        }
        let self = this;
        axios.request({
            ...ctrlAPI.packageInfo,
            params: { order_shop_no: this.state.tid }
        }).then(({ data }) => {
            if (data.code === 0) {
                let newArr = data.data.list;
                let is_express = data.data.is_express;
                self.setState({
                    total: data.data.total_count,
                    update: true,
                    logisticsData: newArr,
                    is_express: is_express
                });
            } else {
                Popup.MsgTip({ msg: "订单号错误" });
            }
        }).catch(err => {
            
            Popup.MsgTip({ msg: "订单号错误" });
            // setTimeout(() => {
            //     browserHistory.push("/");
            // }, 2000);
        })
    }
    render() {
        let {logisticsData, update, total, is_express} = this.state;
        let packItem = logisticsData.map((item, i) => {
            window.localStorage.setItem(item.deliveries.express_no, JSON.stringify(item.deliveries_params))
            return <Eachpackage data={item} key={i} />
        })
        return (
            update ?
                <div className="LogisticsList" data-page='LogisticsPageList' style={{ minHeight: $(window).height() }}>
                    {is_express?
                    <div><p className="count">{total}个包裹已发出</p>
                        {packItem}</div>
                    :<Emptydeliver/>}
                </div>
                : <LoadingRound />
        )
    }
}

class Eachpackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            update: false,
            dataList: '',
            error: false,
        }
    };

    checkLogistic = (code, no,phone) => {
        axios.request({
            ...ctrlAPI.tracking, params: {
                code: code,
                no: no,
                phone:phone
            }
        }).then(({ data }) => {
            if (data.code === 0) {
                this.setState({
                    update: true,
                    dataList: data.data
                })
            } else {
                this.setState({
                    error: true
                })
            }
        }).catch(err => {
            console.log(err)
            Popup.MsgTip({ msg: "服务器繁忙" });
        })
    };

    componentWillMount() {
        let { data } = this.props;
        let express_no = data.deliveries.express_no
        let corp_code = data.deliveries.corp_code;
        let phone=data.deliveries_params.phone;
        this.checkLogistic(corp_code, express_no,phone)
    }
    componentDidMount() {
        let clipboard = new Clipboard('.express_no_copy');
        clipboard.on('success', function (e) {
            Popup.MsgTip({ msg: "物流单号复制成功" });
        });
        clipboard.on('error',function(e){
            Popup.MsgTip({ msg: "当前手机端不支持复制，请手动复制~" });
        })
    }
    render() {
        let { corp_code, corp_name, express_no } = this.props.data.deliveries;
        let { data } = this.props;
        let { dataList, error, update } = this.state;
        let state = dataList.state == 0 ? '在途' : dataList.state == 1 ? '揽件' : dataList.state == 2 ? '疑难' : dataList.state == 3 ? '签收'
            : dataList.state == 4 ? '退签' : dataList.state == 5 ? '派件' : dataList.state == 6 ? '退回' : '暂无物流状态';
        return (
            update &&
            <div className="eachPackage" >
                <p className="packageTop clearfix">
                    <span className="packageStatus">{state}</span>
                    {express_no && <button className="express_no_copy" data-clipboard-text={express_no}></button>}
                    {express_no ? <input id='copy_text' className="express_no" value={express_no} readOnly /> : <span className="express_no">等待上传</span>}
                    {corp_name && <span className="express_name">{corp_name}: </span>}
                </p>
                <Link to={`/logisticDetail?code=${corp_code}&no=${express_no}`}>
                    <div className="main" >
                        {dataList.length != 0 ? <div>
                            <p className="location">{dataList.data[0].context}</p>
                            <p className="time">{dataList.data[0].time}</p>
                        </div> :
                            <p className="location">暂无物流详细状态  </p>
                        }
                    </div>
                    <ScrollImg data={data} />
                </Link>

            </div>
        )
    }
}

class ScrollImg extends Component {
    getSlide() {
        let data = this.props.data.goods_info || [];
        return data.map((item, i) => {
            return <div className="swiper-slide goods_img c-fl" key={i}>
                <img src={item.primary_image} className="imgshow" />
                <span className="goods_count">x{item.num}</span>
            </div>
        })
    }

    componentDidMount() {
        new Swiper(this.refs.banner, {
            // autoplay:true,
            freeMode: true,
            slidesPerView: 'auto',
            observer: true,
        });
    }

    render() {
        return <section data-plugin="swiper">
            <div className="swiper-container banner" ref="banner" style={{ width: '100%' }} >
                <div className="swiper-wrapper clearfix">
                    {this.getSlide()}
                </div>
            </div>
        </section>
    }
}

class Emptydeliver extends Component {
    render() {
        return <div className='empty'>
            <div className="bg"></div>
            <p className="info">您的包裹无需配送~</p>
        </div>
    }
}
