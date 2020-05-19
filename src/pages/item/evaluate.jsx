import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {render} from 'react-dom';
import {LoadingRound, NoMore} from 'component/common';
import Popup from 'component/modal';
import axios from 'js/util/axios';
import {MALLAPI} from 'config/index'

import 'src/scss/evaluate.scss';


const ctrlAPI = {
    listRate: {url: `${MALLAPI}/rate/list`, method: "get"},   //评价列表
    likeRate: {url: `${MALLAPI}/rate/like`, method: "post"} //点赞评价
};

//评价页
export default class EvaluateList extends Component {
    constructor(props, context) {
        super(props);
        let {item_id} = props.location.query;
        this.state = {
            itemID: item_id,
            evaluateData: [],
            listData: [],
            page: 1,
            update: false,
            hasMore: true,
            Sending: false
        }
    };

    static contextTypes = {
        store: React.PropTypes.object,
        router: React.PropTypes.object
    };

    componentWillMount() {
        if (!this.state.itemID) {
            browserHistory.push("/");
        }
        this.getList();
    };

    componentWillUnmount() {
        $(window).unbind('scroll');
    }

    getInitdata = (itemID, id, page) => {
        axios.request({
            ...ctrlAPI.listRate, params: {
                item_id: itemID,
                rate_tag_id: id,
                page: page,
                page_size: 10
            }
        }).then(({data}) => {
            let hasMore = data.data.total_pages > page;
            this.setState({
                evaluateData: data.data,
                listData: data.data.rates,
                update: true,
                hasMore: hasMore
            });
            document.title = '评价（' + data.data.total + "）";
            window.location.href = 'jsbridge://set_title?title=评价（' + data.data.total + "）";

        }).catch(err => {
            console.log(err);
            Popup.MsgTip({msg: "服务器繁忙"});
        })
    };
    getList = (id, tag) => {
        let {page, itemID} = this.state;
        if (tag === 'clickTag') {
            this.setState({
                listData: [],
                page: 1,
                hasMore: true,
                Sending: false
            }, () => {
                let {page} = this.state;
                this.getInitdata(itemID, id, page)
            })
        } else {
            this.getInitdata(itemID, id, page)
        }


    };
    addList = (id) => {
        this.setState({
            Sending: true
        }, () => {
            let {page, itemID, listData} = this.state;
            axios.request({
                ...ctrlAPI.listRate, params: {
                    item_id: itemID,
                    rate_tag_id: id,
                    page: page + 1,
                    page_size: 10
                }
            }).then(({data}) => {
                let hasMore = data.data.total_pages > page;
                let arr = listData.concat(data.data.rates);
                this.setState({
                    page: page + 1,
                    listData: arr,
                    Sending: false,
                    hasMore: hasMore
                });
            }).catch(err => {
                Popup.MsgTip({msg: "服务器繁忙"});
            })
        })

    };

    componentDidMount() {
        let self = this;
        $(window).bind('scroll', function () {
            let {hasMore, Sending,update} = self.state;
            let $this = $(this);
            let scrollH = $this.scrollTop();
            let scrollHeight = $(".list").height() - $(window).height() - 30;
            if (scrollH > scrollHeight && !Sending && hasMore &&update) {
                let id = $('.active-label').attr('id');
                self.addList(id);
            }
        })

    };

    render() {
        let {evaluateData, listData, page, itemID, hasMore, Sending} = this.state;
        let {isLogin} = this.props;
        return (
            this.state.update ?
                <div data-page="evaluate-list">
                    <section id="evaluate-list" ref="evaluate">
                        <ItemMsg dataList={evaluateData}/>
                        <Evaluate isLogin={isLogin} dataList={evaluateData} page={page} listData={listData}
                                  itemID={itemID} fn={this.getList} addFn={this.addList}
                                  hasMore={hasMore} Sending={Sending}/>
                    </section>
                </div>
                : <LoadingRound/>
        )
    }
}

//商品简介
class ItemMsg extends Component {
    render() {
        let {dataList} = this.props;
        return (
            <div className="item-msg">
                <img src={dataList.image} className="item-img"/>
                <p className="item-title c-c666">{dataList.title}</p>
                <span className="item-price c-cdred c-fs14"><span
                    className="c-fs10">￥</span>{dataList.sell_price}</span>
            </div>
        )
    }
}

//评价整体
class Evaluate extends Component {
    render() {
        let {dataList, itemID, listData, page, fn, addFn, isLogin, hasMore, Sending} = this.props;
        return (
            <div className="item-evaluate">
                {dataList.total ?
                    <HasEvaluate isLogin={isLogin} dataList={dataList} page={page} listData={listData} itemID={itemID}
                                 fn={fn} addFn={addFn} hasMore={hasMore} Sending={Sending}/> : <NoneEvaluate/>}
            </div>
        )
    }
}

//无评价
class NoneEvaluate extends Component {
    render() {
        return (
            <div>
                <img src="/src/img/evaluate/no-item.png" className="none-img"/>
            </div>
        )
    }
}

//有评价
class HasEvaluate extends Component {
    render() {
        let {dataList, itemID, listData, page, isLogin, hasMore, Sending} = this.props;
        let {fn, addFn} = this.props;
        return (
            <div style={{width: '100%', overflow: 'hidden'}}>
                <ListHeader dataList={dataList} fn={fn}/>
                <List listData={listData} isLogin={isLogin} hasMore={hasMore}/>
                {Sending &&
                <div style={{textAlign: 'center'}}><img src="src/img/icon/loading/loading-round.gif" alt=""/></div>}
                {!hasMore && <NoMore/>}
            </div>
        )
    }
}


//评价header
class ListHeader extends Component {
    render() {
        let {dataList} = this.props;
        let {fn} = this.props;
        return (
            <div className="list-header" style={{width: '100%'}}>
                <div className="stars c-fs14">
                    <span className="c-fl c-mr10">商品评价</span>
                    <div className="c-fl c-mr20 stars-bg">
                        <img className="stars-img" src="/src/img/evaluate/stars.png"
                             style={{backgroundSize: dataList.praise_rate + ' 100%'}}/>
                    </div>
                    <span className="c-cdred c-fl">{dataList.praise_rate}好评</span>
                </div>
                <ListLabels labelArr={dataList.tags} fn={fn}/>
            </div>
        )
    }
}

//标签
class ListLabels extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isOpen: false,
            fn: this.props.fn
        }
    };

    componentDidMount() {
        let lstHeight = $(this.refs.listLabels).height();
        if (lstHeight > 71) {
            //..
        } else {
            $('.open-labels').css({'display': 'none'});
        }
        ;
        let self = this;
        $('.list-label').click(function (e) {
            if ($(this).attr('class') === "list-label active-label") {
                //..
            } else {
                let id = $(this).attr('id');
                self.state.fn(id, 'clickTag');
                $(this).css({
                    'color': '#fff',
                    'background-color': '#f88'
                }).addClass('active-label').siblings().css({
                    'color': '#353535',
                    'background-color': '#fff2f5'
                }).removeClass('active-label');
            }
            e.preventDefault();
        })
    };

    openClose = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        let labels = this.props.labelArr.map(function (item, i) {
            return <EachLabel data={item} key={i}/>
        });
        return (
            <div className="labels-outter">
                <div className={this.state.isOpen ? "labels-inner-open" : "labels-inner"}>
                    <div ref="listLabels" className="list-labels">
                        <EachLabel data={{text: '全部', rate_tag_id: ''}}/>
                        {labels}
                    </div>
                </div>
                <OpenLabels openClose={this.openClose}/>
            </div>
        )
    }
}

//展开
class OpenLabels extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isClose: true
        }
    };

    static contextTypes = {
        store: React.PropTypes.object,
        router: React.PropTypes.object
    };
    changeImg = () => {
        this.setState({
            isClose: !this.state.isClose
        });
        this.props.openClose();
    };

    render() {
        return <div onClick={this.changeImg}
                    className={this.state.isClose ? "open-labels to-open" : "open-labels to-close"}></div>
    };
}

//单个标签
class EachLabel extends Component {
    render() {
        let babelChose = false,
            {data} = this.props;
        if (data.text === '全部') {
            babelChose = true;
        }
        ;
        return (
            <button className={babelChose ? "list-label active-label" : "list-label"}
                    id={data.rate_tag_id}>{data.text}{data.count ? '(' + data.count + ')' : ''}</button>
        )
    }
}

//评价列表
class List extends Component {
    render() {
        let {isLogin} = this.props;
        var list = this.props.listData.map(function (item, i) {
            return <OneInList isLogin={isLogin} data={item} key={i}/>
        });
        return (
            <div className="list c-fs14">
                {list}
            </div>
        )
    }
}

//单个评价+点赞
class OneInList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isThumbsUp: this.props.data.liked,
            zanCount: this.props.data.like_count,
            isSending: false
        }
    };

    static contextTypes = {
        store: React.PropTypes.object,
        isLogin: React.PropTypes.bool
    };
    zanClick = () => {
        if (this.context.isLogin) {
            let self = this;
            let {data} = self.props;
            let {isThumbsUp, zanCount, isSending} = self.state;
            if (!isSending) {
                self.setState({isSending: true});
                if (isThumbsUp) {
                    axios.request({
                        ...ctrlAPI.likeRate, data: {
                            rate_id: data.rate_id,
                            liked: 0
                        }
                    }).then(result => {
                        self.setState({
                            isThumbsUp: !isThumbsUp,
                            zanCount: parseInt(zanCount) - 1,
                            isSending: false
                        });
                    })
                } else {
                    axios.request({
                        ...ctrlAPI.likeRate, params: {
                            rate_id: data.rate_id,
                            liked: 1
                        }
                    }).then(result => {
                        self.setState({
                            isThumbsUp: !isThumbsUp,
                            zanCount: parseInt(zanCount) + 1,
                            isSending: false
                        });

                    })
                }
            }
        } else {
            window.location.href = "trmall://to_login";
        }
    };

    render() {
        let {data} = this.props;
        let {zanCount} = this.state;
        //data.liked用户是否点赞
        return (
            <div className="one-evaluate" id={data.rate_id}>
                {data.amazing ? <Amazing/> : ''}
                <UserMsg data={data}/>
                <ContentTxt data={data}/>
                <div className="thumbs-up">
                    <div className={this.state.isThumbsUp ? "zan zan-already c-fr c-tc" : "zan zan-yet c-fr c-tc"}
                         onClick={this.zanClick}>{zanCount ? zanCount : '点赞'}</div>
                </div>
            </div>
        )
    }
}

//头像+用户名+商品参数(用户信息)
class UserMsg extends Component {

    render() {
        let {data} = this.props;
        let defaultSrc = '/src/img/evaluate/user-img.png';
        return (
            <div>
                <div className="user-msg">
                    <div className="user-photo">
                        <img src={data.head_portrait ? data.head_portrait : defaultSrc}/>
                    </div>
                    {!data.anonymous&&<span>{data.user_name}</span>}
                    {data.anonymous&&<span>{data.user_name}[匿名]</span>}

                </div>
                <div className="date-type">
                    <span>{data.create_time ? data.create_time : ''}</span>
                    <span className="c-fs12">{data.sku_text || ''}</span>
                </div>
            </div>
        )
    }
}

//精彩评论
class Amazing extends Component {
    render() {
        return <img className="amazing" src="src/img/evaluate/amazing.png"/>
    }
}

//评价内容
class ContentTxt extends Component {
    render() {
        let {data} = this.props;
        let obj = {
            GOOD: '好评！',
            NEUTRAL: '中评！',
            BAD: '差评！'
        };
        let evaluateTxt = obj[data.experience];
        return (
            <div className="content-txt"
                 style={{overflowWrap: 'break-word', wordBreak: 'break-all', wordWrap: 'break-word'}}>
                <p className="c-mb14 c-lh25">{data.content ? data.content : evaluateTxt}</p>
                {data.image_list.length ? <ContentImg data={data.image_list} rateID={data.rate_id}/> : ''}
                {data.replied ? <Reply data={data.reply_content}/> : ''}
                {data.add ? <AddEvaluate data={this.props.data.add}/> : ''}
            </div>
        )
    }
}

//评价图片
class ContentImg extends Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            openImg: false,
            largeImgs: []
        }
    };

    static contextTypes = {
        store: React.PropTypes.object,
        router: React.PropTypes.object
    };

    componentDidMount() {
        let self = this;
        let {data, rateID} = this.props;
        $(self.refs.imgs).css({height: '135px'});
        if (data.length > 2) {
            let imgsSwiper = new Swiper('.swiper1' + rateID, {
                observer: true,
                freeMode: true,
                slidesPerView: 'auto'
            });
        }
        ;
        let timer = null;//定时器
        let largeSwiper = new Swiper('.swiper2' + rateID, {
            observer: true,
            pagination: '.swiper-pagination',
            initialSlide: 0
        });
        let newTime = 0, oldTime = 0, enlarge = false;
        let relativeX = 0, relativeY = 0, x1 = 0, x2 = 0;
        let startX = 0, endX = 0, wid = 0, hei = 0, lef = 0, to = 0;
        //点击、放大、拖拽、双指事件
        $('.swiper2' + rateID + ' img').on('touchstart', function (event) {
            event.preventDefault();
            //记录触摸开始位置
            x1 = event.touches[0].pageX;
            if (event.touches.length == 2) {
                x2 = event.touches[1].pageX;
                startX = Math.abs(x1 - x2);
                wid = $(this).width();
                hei = $(this).height();
                lef = $(this).offset().left;
                to = $(this).offset().top - $(window).scrollTop();
            }
            relativeX = x1 - $(this).offset().left;//获取手指在容器中的位置
            relativeY = event.touches[0].pageY - ($(this).offset().top - $(window).scrollTop());
            clearTimeout(timer);
            oldTime = newTime;
            newTime = new Date().getTime();
            let ele = $(this), eleID = ele.attr('id');
            //单击、双击事件
            timer = setTimeout(function () {
                if (newTime - oldTime > 300) {//单击
                    ele.css({width: '100%'});
                    ele.parent().parent().parent().parent().css({display: 'none'});
                    largeSwiper.unlockSwipeToNext();
                    largeSwiper.unlockSwipeToPrev();
                    enlarge = false;
                } else {//双击
                    if (enlarge === false) {
                        ele.css({width: '200%', left: -relativeX + 'px', top: 0, margin: 0});
                        largeSwiper.lockSwipeToNext();//放大时禁止swiper
                        largeSwiper.lockSwipeToPrev();
                        enlarge = true;
                    } else {
                        ele.css({width: '100%', top: 0, left: 0, right: 0, bottom: 0, margin: 'auto'});
                        largeSwiper.unlockSwipeToNext();
                        largeSwiper.unlockSwipeToPrev();
                        enlarge = false;
                    }
                }
            }, 300);
            //放大事件
            let moveBox = document.getElementById(eleID);
            let handler = function (event) {
                event.preventDefault();
                if (event.targetTouches.length == 1) {
                    let touch = event.targetTouches[0];
                    if (enlarge) {
                        ele.css({margin: 0});
                        moveBox.style.left = touch.pageX - relativeX + 'px';
                        moveBox.style.top = touch.pageY - relativeY + 'px';
                    }
                    if (Math.abs(touch.pageX - x1) > 2) {
                        clearTimeout(timer);
                    }
                } else if (event.targetTouches.length == 2) {
                    clearTimeout(timer);
                    let touch1 = event.targetTouches[0],
                        touch2 = event.targetTouches[1];
                    endX = Math.abs(touch1.pageX - touch2.pageX);
                    let newWidth = wid + (endX - startX), winWidth = $(window).width();
                    newWidth = newWidth > winWidth * 2 ? winWidth * 2 : newWidth;
                    newWidth = newWidth < winWidth ? winWidth : newWidth;
                    if (newWidth > winWidth) {
                        ele.css({margin: 0});
                        enlarge = true;
                        largeSwiper.lockSwipeToNext();
                        largeSwiper.lockSwipeToPrev();
                    } else {
                        enlarge = false;
                        largeSwiper.unlockSwipeToNext();
                        largeSwiper.unlockSwipeToPrev();
                    }
                    ele.css({
                        width: newWidth + 'px',
                        left: lef - (endX - startX) / 2,
                        top: to - (endX - startX) / 2
                    });
                }
            };
            moveBox.addEventListener('touchmove', handler, false);
            $(moveBox).on('touchend', function (event) {//手指离开时移除监听
                moveBox.removeEventListener('touchmove', handler, false);
                if (ele.width() == $(window).width()) {
                    ele.css({width: '100%', top: 0, left: 0, right: 0, bottom: 0, margin: 'auto'});
                }
            });
        });
        $('.swiper1' + rateID + ' img').click(function () {
            $(this).parent().parent().parent().parent().next().css({display: 'block'}).find('img').css({
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto'
            });
        });
    };

    render() {
        let {openImg} = this.state;
        let {data, rateID} = this.props;
        let self = this;
        let imgs = data.map(function (item, i) {
            return (
                <div className="swiper-slide img-outter" key={i}>
                    <div className="content-img c-fl">
                        <img onClick={self.changeOpen} src={item}/>
                    </div>
                </div>
            )
        });
        let larges = this.props.data.map(function (item, i) {
            return (
                <div className="swiper-slide" key={i}>
                    <div style={{width: "100%", height: "100%", overflow: 'scroll', position: 'raletive'}}>
                        <img id={'img' + rateID + i} style={{width: '100%'}} src={item}/>
                    </div>
                </div>
            )
        });
        return (
            <div data-plugin="swiper" className="content-imgs c-mb14" ref="imgs">
                <div className={"swiper-container small-imgs swiper1" + rateID}>
                    <div className="swiper-wrapper">
                        {imgs}
                    </div>
                </div>
                <div style={{display: (0 ? 'block' : 'none')}}
                     className={"swiper-container large-img swiper2" + rateID}>
                    <div className="swiper-wrapper">
                        {larges}
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
            </div>
        )
    };
}

//客服回复
class Reply extends Component {
    render() {
        return (
            <div className="content-reply">
                <p className="c-mb14 c-lh25">客服回复：{this.props.data}</p>
            </div>
        )
    }
}

//追加评价
class AddEvaluate extends Component {
    render() {
        let dateTime = this.props.data.setDate;
        return (
            <div className="content-add">
                <p className="c-mb14 c-lh25 c-cdred">用户{dateTime}追评</p>
                <p className="c-mb14 c-lh25">{this.props.data.addEvaluate}</p>
                {this.props.data.reply ? <Reply data={this.props.data.reply}/> : ''}
            </div>
        )
    }
}