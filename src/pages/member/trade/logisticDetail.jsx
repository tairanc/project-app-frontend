import React, { Component } from 'react';
import axios from 'js/util/axios';
import {RNDomain,MALLAPI} from 'src/config/index'
import Popup from 'component/modal2';
import Clipboard from "clipboard";
import './logisticsList.scss';

const ctrlAPI = {
    tracking: { url: `${MALLAPI}/user/orderTracking/get`, method: "get" },//物流数据
};

export default class LogisticsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
            overseasData: [],
            localData: []
        }
    }
    checkLogistic = (code, no,phone, str) => {
        axios.request({
            ...ctrlAPI.tracking, params: {
                code: code,
                no: no,
                phone:phone
            }
        }).then(({ data }) => {
            if (data.code == 0 && data.data.data) {
                if (str == 'overseas') {
                    this.setState({
                        overseasData: data.data.data
                    })
                } else {
                    this.setState({
                        localData: data.data.data
                    })
                }
            }
        }).catch(err => {
            Popup.MsgTip({ msg: "服务器繁忙" });
        })
    };
    componentWillMount() {
        let { code, no } = this.props.location.query;
        let params = JSON.parse(window.localStorage.getItem(no));
        this.setState({
            params: params
        })
        let overseas_code = params.overseas_corp_code;
        let overseas_no = params.overseas_express_no;
        let local_code = params.local_corp_code;
        let local_no = params.local_express_no;
        let phone = params.phone;
        overseas_code && this.checkLogistic(overseas_code, overseas_no,phone, 'overseas');
        local_code && this.checkLogistic(local_code, local_no,phone, 'local');
    }

    componentWillUnmount() {
        let { no } = this.props.location.query;
        window.localStorage.removeItem(no)
    }

    render() {
        let { overseasData, localData, params } = this.state;
        return <div className='logisticDetail' data-page='logisticDetail' style={{ minHeight: $(window).height() }}>
            <p className="logisticDomestic c-fs14">国内物流</p>
            <Sketch name={params.local_corp_name} no={params.local_express_no} />
            {localData.length != 0 ?
                <Details data={localData} />
                : <Empty />}
            {params.overseas_express_no && <div>
                <p className="logisticInterInter c-fs14">国际物流</p>
                <Sketch name={params.overseas_corp_name} no={params.overseas_express_no} />
                {overseasData.length != 0 ?
                <Details data={overseasData} />
                : <Empty />}
            </div>}
        </div>
    }
}

class Sketch extends Component {
    componentDidMount() {
        let clipboard = new Clipboard('.copy');
        clipboard.on('success', function (e) {
            Popup.MsgTip({ msg: "物流单号复制成功" });
        });
        clipboard.on('error',function(e){
            Popup.MsgTip({ msg: "当前手机端不支持复制，请手动复制~" });
        })
    }
    render() {
        let { name, no } = this.props;
        return (
            <div className='sketch c-fs14 c-c35 c-lh18'>
                <p className="name">物流公司：{name}</p>
                <p className="no">物流单号：<input id='copy_text' className='express_no' readOnly value={no ? no : '等待上传'} /> {no && <button className="copy" data-clipboard-text={no}>复制</button>}</p>
            </div>
        )
    }
}

class Details extends Component {
    render() {
        let { data } = this.props;
        let dom = data.map((item, i) => {
            return <li key={i}>
                <p className="c-fs14">{item.context}</p>
                <p className="c-fs12">{item.time}</p>
                <span></span>
            </li>
        })
        return (
            <div className='details'>
                <ul className="list">
                    {dom}
                </ul>
            </div>
        )
    }
}

class Empty extends Component {
    render() {
        return <div className='empty'>
            <div className="bg"></div>
            <p className="info">暂无相关物流信息，请您耐心等待~</p>
        </div>
    }
}