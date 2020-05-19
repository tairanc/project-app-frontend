import React, { Component } from 'react';
import { LoadingRound } from 'component/common.jsx';
import {createAction} from 'filters/index';
import {base64encode, utf16to8} from "../../js/util/index"
import axios from 'axios';
import { tip } from 'component/module/popup/tip/tip';
import './invitation.scss';

const pageApi = {
    getInviter: { url: "/newapi/user/getInviteCode", method: "get" }    //获取邀请人邀请码和号码
};

export default class Invitation extends Component {
    constructor(props){
        super(props);
        this.state = {
            inviteCode: "",
            tel: "",
            update: false
        }
    }
    
    componentWillMount() {
        axios.request({
            ...pageApi.getInviter
        }).then(({data}) => {
            console.log('data',data);
            this.setState({
                inviteCode: data.inviteCode,
                tel: data.loginAccount,
                update: true
            });
        }).catch(({response}) => {
            tip.show({ msg: response.data.error.description || "服务器繁忙" });
        });
    }
    
    //获取分享信息
    shareMsg = ()=> {
        let { tel } = this.state;
        tel = "TRC_"+(parseInt(tel)*7);
        let config = {
            title: "我发现了一个低价采购平台",
            content: "专人跟进采购无忧，快和我一起加入吧",
            icon: "https://image.tairanmall.com/FjUK1xqNWiNhHC_ZUpxy6fkSwnER",
            link: window.location.origin+'/enterprise/register?inviter='+tel,
        };
        let params = base64encode(utf16to8(JSON.stringify(config)));
        window.location.href = "trmall://share?params=" + params;
    };
    
    render(){
        let { inviteCode,update } = this.state;
        return(
            update?
                <div data-page="invitation" className="c-tc">
                    <header className="invite-text">
                        <img src="/src/img/enterpriseBuy/invitation/inviteFriend.png"/>
                    </header>
                    
                    <div className="invite-code c-dpib">
                        <h3>邀请码</h3>
                        <p>{inviteCode}</p>
                        <span className="copy-code">（长按复制分享给好友）</span>
                        <div className="invite-btn" onClick={this.shareMsg}>
                            <button>邀请企业好友</button>
                        </div>
                    </div>
                    
                    <div className="activity-rule">
                        <span className="little-circle"></span>
                        <h4>活动规则</h4>
                        <span className="little-circle"></span>
                        <ul>
                            <li>
                                <img src="/src/img/enterpriseBuy/invitation/icon-share.png"/>
                                分享邀请码或邀请链接
                            </li>
                            <li className="inviteCode-li">
                                <img src="/src/img/enterpriseBuy/invitation/icon-inviteCode.png"/>
                                <span className="inviteCode-txt">企业通过【邀请码】<br/>直接【邀请企业好友】</span>
                            </li>
                            <li>
                                <img src="/src/img/enterpriseBuy/invitation/icon-profit.png"/>
                                企业采购我拿分红
                            </li>
                        </ul>
                    </div>
                    
                    <footer>
                        <p>奖励发放形式咨询客服<br/>400-669-6610</p>
                    </footer>
                </div>
                :
                <LoadingRound />
        );
    }
}