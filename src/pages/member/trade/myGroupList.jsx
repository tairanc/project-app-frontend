import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {LoadingRound, NoMoreOrder} from 'component/common';
import {ListNav} from 'src/pages/member/trade/tradeList';
import {DropDownLoad} from 'component/HOC.jsx';
import {groupStatus} from '../../../js/filters/orderStatus';
import axios from 'js/util/axios';
import {MALLAPI} from 'config/index'
//import 'plugin/zepto-touch';
import 'src/scss/tradeAll.scss';

const pageAPI = {
    initgroup: {url: `${MALLAPI}/promotion/myGroupBuy`, method: "get"},   //拼团列表
};

let navData = [
    {text: "全部", status: 0, url: "/myGroupList/0"},
    {text: "拼团中", status: 1, url: "/myGroupList/1"},
    {text: "拼团成功", status: 2, url: "/myGroupList/2"},
    {text: "拼团失败", status: 3, url: "/myGroupList/3"}
];
let orderStatus = [4, 1, 2, 0];

//swiper 的tab切换
let tradeListSwiper = {};

//我的拼团列表
export default class MyGroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {status: this.props.params.status};
    };

    static contextTypes = {
        store: React.PropTypes.object,
        router: React.PropTypes.object
    };

    componentDidMount() {
        let self = this;
        let {store} = this.context;
        //设置高
        $(self.refs.list).css({minHeight: $(window).height()});
        //绑定整个滑块
        let defaultStatus = this.props.params.status;
        let navList = $(".trade-list-nav .nav-list");
        let listSwiper = new Swiper("#group-list", {
            initialSlide: defaultStatus,
            //initialSlide: 3,
            autoHeight: true,
            onSlideChangeStart: function (swiper) {
                self.context.router.replace(navData[swiper.activeIndex].url);
                let action = {type: "MY_GROUP_LIST", listNum: orderStatus[swiper.activeIndex]};
                store.dispatch(action);
            },
            onTouchStart: function (swiper, even) {
                if (swiper.activeIndex == 0) {
                    swiper.lockSwipeToPrev();
                } else {
                    swiper.unlockSwipeToPrev();
                }
                if (swiper.activeIndex >= swiper.slides.length - 1) {
                    swiper.lockSwipeToNext();
                } else {
                    swiper.unlockSwipeToNext();
                }
            }
        });
        if (listSwiper.activeIndex == 0) {
            let action = {type: "MY_GROUP_LIST", listNum: orderStatus[0]};
            store.dispatch(action);
        }
        tradeListSwiper = listSwiper;
        navList.each(function (i, item) {
            $(item).on("click", function (e) {
                listSwiper.slideTo(i, 300, true);
            });
        });
    };

    render() {
        return (
            <div data-plugin="swiper" data-page="trade-list my-group-list">
                <section className="trade-list swiper-container" ref="list" id="group-list">
                    <ListNav data={navData} status={this.props.params.status}/>
                    <ListInfo listLength="4" status={this.props.params.status}/>
                </section>
            </div>
        )
    }
}

//内容列表栏
export class ListInfo extends Component {
    static contextTypes = {
        store: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let html = [];
        let l = this.props.listLength;
        for (let i = 0; i < l; i++) {
            html.push(<OneListInfoCtrl status={i} key={i}/>)
        }
        return (
            <div className="swiper-wrapper list-main">
                {html}
            </div>
        )
    }
}

//列表内容控制
export class OneListInfoCtrl extends Component {
    componentWillMount() {
        document.title = "我的拼团";
        location.href = "jsbridge://set_title?title=我的拼团";
        this.count = 10;
        this.total = 100;
        this.state = {
            dataList: [],
            update: false,
        };
    };

    static contextTypes = {
        store: React.PropTypes.object
    };
    loadDownHandle = (me) => {
        const self = this;
        let {status} = self.props;
        if (this.count < 10) {
            me.lock();
            me.noData();
            me.resetload();
            return;
        }
        this.pages++;
        /*const sources = "/originapi/user/group_buys?orderType=" + orderStatus[status] + '&pages='+ this.pages;
        $.ajax({
            url:sources,
            type:'get',
            success:function(result){
                let {dataList} = self.state;
                dataList = dataList.concat( result.message.order);
                self.setState({
                    dataList: dataList,
                    update:true
                });
                me.resetload();

            },
            error:function(xhr){
                me.resetload();
            }
        })*/
        axios.request({
            ...pageAPI.initgroup,
            params: {
                group_status: orderStatus[status],
                page: this.pages,
                page_size: 10
            }
        }).then(result => {
            if (result.data.code === 0) {
                let {dataList} = self.state;
                dataList = dataList.concat(result.data.data.group.data);
                self.total = result.data.data.group.total_count;
                self.count = result.data.data.group.count;
                self.setState({
                    dataList: dataList,
                    update: true
                });
                me.resetload();
            }

        }).catch(err => {
            console.log(err);
            me.resetload();
        })
    }

    componentDidMount() {
        let self = this;
        let {status} = self.props;
        let {store} = self.context;
        let unSubscribe = store.subscribe(() => {
            let state = store.getState().initial;
            if (state.type == "MY_GROUP_LIST" && state.listNum == orderStatus[status]) {
                self.pages = 1;
                self.setState({update: false});
                /*$.ajax({
                    url: "/originapi/user/group_buys?orderType=" + orderStatus[status]+'&pages='+self.pages,
                    type: "get",
                    success: function ( result ) {
                        let dataList =  result.message.order;
                        self.pages =  result.message.pages;
                        self.total =  result.message.total;
                        self.setState({
                            dataList: dataList,
                            update:true
                        });
                    }
                });*/
                axios.request({
                    ...pageAPI.initgroup,
                    params: {
                        group_status: orderStatus[status],
                        page: self.pages,
                        page_size: 10
                    }
                }).then(result => {
                    if (result.data.code === 0) {
                        let dataList = result.data.data.group.data;
                        //self.pages = 1;
                        self.total = result.data.data.group.total_count;
                        self.count = result.data.data.group.count;
                        self.setState({
                            dataList: dataList,
                            update: true
                        });
                    }

                }).catch(err => {
                    console.log(err);
                })
            }
        });
        self.setState({
            unSubscribe: unSubscribe
        });
    }

    componentDidUpdate() {
        tradeListSwiper.update();
    }

    componentWillUnmount() {
        this.state.unSubscribe();
    }

    render() {
        const {update, dataList} = this.state;

        return (
            <div className="swiper-slide list-container" ref="pageTop"
                 style={{overflow: 'scroll', height: document.body.clientHeight - 40}}>
                {update ?
                    (dataList && dataList.length) ?
                        <DropDownList dataList={dataList} update={update} dropDown={this.loadDownHandle}
                                      scrollArea={$(this.refs.pageTop)}/> :
                        <NoMoreOrder/> :
                    <LoadingRound/>
                }
            </div>
        )
    }
}

//列表内容
export class OneListInfo extends Component {
    render() {
        let {dataList} = this.props;
        dataList = this.props.update ? (dataList instanceof Array ? dataList.map((item, i) => {
            return <OneGroupList data={item} key={i}/>
        }) : <NoMoreOrder/>) : <LoadingRound/>;
        return (
            <div className="list-data">
                {dataList}
            </div>
        )
    }
}

export class OneGroupList extends Component {
    getContext() {
        const {data} = this.props;
        let {order_shop_no, object_id, pic_path, title, spec_nature_info, group_status, payment, required_person} = data;
        return (<div>
                {group_status == 2 || group_status == 0 ?
                    <div className="list-body">
                        <div className="list-img">
                            <Link to={`/tradeDetail?tid=${order_shop_no}&orderflag=2`}>
                                <img src={pic_path}/>
                            </Link>
                        </div>
                        <div className="list-body-ctt">
                            <div className="order-info-detail">
                                <div className="order-info-top">
                                    <Link className="order-info-title" to={`/groupDetail?object_id=${object_id}`}>
                                        {title}
                                    </Link>
                                    <div className="order-info-type">{spec_nature_info}</div>
                                </div>
                                <div className="order-status-wrap">
                                    {group_status == 2 || group_status == 0 ?
                                        <div className="order-status">{groupStatus[group_status]}</div> : null
                                    }
                                </div>
                            </div>
                            <div className="order-total">
                                实付款：<span className="order-total-pay">￥{(+payment).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    : <div>
                        <div className="list-body">
                            <div className="list-img">
                                <Link to={`/tradeDetail?tid=${order_shop_no}&orderflag=2`}>
                                    <img src={pic_path}/>
                                </Link>
                            </div>
                            <div className="list-body-ctt">
                                <div className="order-info-detail">
                                    <div className="order-info-top">
                                        <Link className="order-info-title" to={`/groupDetail?object_id=${object_id}`}>
                                            {title}
                                        </Link>
                                        <div className="order-info-type">{spec_nature_info}</div>
                                    </div>
                                    <div className="order-status-wrap">
                                        <div className="order-status">{groupStatus[group_status]}</div>
                                        <div className="order-person" style={{marginTop: '5px'}}>差{required_person}人
                                        </div>
                                    </div>
                                </div>
                                <div className="order-total">
                                    实付款：<span className="order-total-pay">￥{(+payment).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="order-status"
                                 style={{visibility: 'hidden'}}>{groupStatus[group_status]}</div>
                            <div className="order-person"
                                 style={{marginTop: '5px', visibility: 'hidden'}}>差{required_person}人
                            </div>
                            <div className="order-ctrl order-alt c-tr">
                                <Link className="ctrl-red cancel-order" key="1"
                                      to={`/groupDetail?object_id=${object_id}`}>邀请好友参团</Link>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }

    render() {
        let html = this.getContext();
        return (
            <div>
                <li className="one-order">
                    <div className="order-info">
                        {html}
                    </div>
                </li>
            </div>
        )
    }
}

const DropDownList = DropDownLoad(OneListInfo);



