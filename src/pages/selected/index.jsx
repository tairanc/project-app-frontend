import React, {Component} from 'react';
import styles from '../../scss/collect.scss';
import echo from 'plugin/echo.js';
import {LoadingRound} from 'component/common';
import {DropRefresh} from 'component/module/HOC/dropRefresh';
import axios from 'js/util/axios';
import {MALLAPI, RNDomain} from 'config/index'

const pageApi = {
    init: {url: `${MALLAPI}/item/bests`, method: 'get'}
};

export default class SelectedPage extends Component {
    constructor(props, context) {
        super(props);
        document.title = "商品精选";
        if (context.isApp) location.href = "jsbridge://set_title?title=商品精选";
        this.state = {
            moduleId: props.location.query.module_id,
            load: true,
            dataList: [],
            title: "",
            totalNum: 0,
            pages: {
                total: 999,
                current: 1
            }

        }
    }

    static contextTypes = {
        isApp: React.PropTypes.bool
    };


    componentDidMount() {
        axios.request({
            ...pageApi.init,
            params: {
                page_size: 10,
                page: this.state.pages.current,
                module_id: this.state.moduleId,
            }
        }).then(({data}) => {

            let mainData = data.data;
            this.setState({
                load: false,
                dataList: mainData.item_list,
                title: mainData.title,
                totalNum: mainData.item_count,
                pages: {
                    total: +mainData.total_page,
                    current: +mainData.page
                }
            })

        }).catch(error => {
            this.setState({
                load: false
            });
            console.log(error);
        });
    }

    componentDidUpdate() {
        echo.init({offset: 1000, throttle: 0});
    }

    dropDown = (me) => {
        if (this.state.pages.total <= this.state.pages.current) {
            me.locked();
            return;
        }
        axios.request({
            ...pageApi.init,
            params: {
                page_size: 10,
                page: this.state.pages.current + 1,
                module_id: this.state.moduleId,
            }
        }).then(({data}) => {
            let mainData = data.data;
            this.setState({
                dataList: this.state.dataList.concat(data.data.item_list),
                pages: {
                    total: +mainData.total_page,
                    current: +mainData.page
                }
            });
            me.refresh();
        }).catch(error => {
            me.locked();
            console.log(error);
        });
    }

    render() {
        if (this.state.load) return <LoadingRound/>;
        if (!this.state.dataList.length) return <SelectEmpty/>;
        const {dataList, title, totalNum} = this.state;
        return (
            <div data-page="collect-page selected-page" className="main">
                <div className="area">
                    <DropRefresh dropEvent={this.dropDown} disBt={300}>
                        <section className="floor-bd">
                            <div className="title">
                                <div className="selected_title">
                                    {title}
                                </div>
                                <div className="select_subtitle">
                                    相关产品{totalNum}款
                                </div>
                            </div>
                            <SelectList data={dataList}/>
                        </section>
                    </DropRefresh>
                </div>
            </div>
        )
    }
}

export class SelectList extends Component {
    render() {
        const {data} = this.props;
        let html = this.props.data instanceof Array ? data.map((item, i) => {
            return <SelectBar data={item} key={i}/>
        }) : null;
        return (<div style={{background: '#fff', padding: '0 0.1rem'}}>
                {html}
            </div>
        )
    }
}

export class SelectBar extends Component {
    render() {
        const {data} = this.props;

        let trade_type = data.shop_tag && data.shop_tag.length ? data.shop_tag[0].title : "";
        let trade_type_color = data.shop_tag && data.shop_tag.length ? data.shop_tag[0].color : "";
        return (<div>
                <div className="col-xs-6 col-select single">
                    <div className="pro-pic list-item-pic" style={{border: 'none'}}>
                        <a className="pro-link" href={RNDomain + '/item?item_id=' + data.item_id}>
                            <img className="primary-image"
                                 data-echo={data.imgsrc || "/src/img/search/no-goods-image.png"}
                                 src="/src/img/icon/loading/default-watermark.png"/>
                            {!data.isSoldOut ? "" :
                                <img className="no-goods-count-image" src="/src/img/search/no-goods-count.png"/>}
                        </a>
                        <div className="info-n">
                            <p>{data.title}</p>
                        </div>
                        <div className="info-p" style={{marginTop: '5px', color: '#ff5555', paddingLeft: '2%'}}>
                            <div className="p-lf">
                                {data.price ? data.price : data.originPrice}
                            </div>
                            <div className='goods_store' style={{display: 'none'}}>
                                <span style={{border: '1px solid #ff5555'}}>{data.reposity}</span>
                            </div>
                        </div>
                        <div className="info-tag">
                            {data.shop_tag && data.shop_tag.length ?
                                <span className="label" style={{background: trade_type_color}}>{trade_type}</span> : ""}
                            {data.activityTagList && data.activityTagList.length ?
                                data.activityTagList.map(function (item, index) {
                                    return <span className="label" key={index}
                                                 style={{background: '#e60a30'}}>{item}</span>
                                }) : ""
                            }
                        </div>
						{data.item_tag.square_tag_image && <div className="good-top-tag"><img src={data.item_tag.square_tag_image} /> </div>}
						{/*<div className="good-top-tag"><img src="" /> </div>*/}
                    </div>
                </div>
            </div>
        )
    }
}

//精选商品不存在时
export class SelectEmpty extends Component {
    render() {
        return (
            <div>
                <div style={{paddingTop: '105px'}}>
                    <div className={styles.emptyBg}>
                        <p className={styles.emptySelect}>精选商品不存在</p>
                    </div>
                </div>
            </div>
        )
    }
}