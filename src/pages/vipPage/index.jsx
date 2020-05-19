import React, { Component } from 'react';
import { Link } from 'react-router';
import { PopupModal, PopupTip } from 'component/modal';
import styles from '../../scss/vipPage.scss';
import { TransShady } from 'component/common';
import axios from 'js/util/axios';
import { MALLAPI, RNDomain } from 'config/index'
import ItemSwipe from './ItemSwipe';
import { getCookie, setCookie, clearCookie } from 'js/common/cookie';
import { browserHistory } from 'react-router';
import { UCENTER } from 'config/index';

const pageApi = {
  recommend: { url: `${MALLAPI}/vip/recommend`, method: "GET" }, // 会员推荐：http://dsapi.fengdai.org/#/home/project/inside/api/detail?groupID=51&childGroupID=247&apiID=2034&projectName=电商接口&projectID=20
  getVipInfo: { url: `${MALLAPI}/vip/info`, method: "GET" },
  applyVipUser: { url: `${MALLAPI}/vip/applyVipUser`, method: "POST" },
  updateVipUser: { url: `${MALLAPI}/vip/updateVipUser`, method: "POST" },
  checkVipInviter: { url: `/vipcenter/inviter/check`, method: "GET" },
};

const tipActionCreator = function (msg) {
  return {
    type: "POPUP",
    popType: "msgTip",
    data: { msg: msg }
  }
};

export default class SelectedPage extends Component {
  constructor(props, context) {
    super(props);
    document.title = "泰享会员";
    if (context.isApp) location.href = "jsbridge://set_title?title=泰享会员";
    this.state = {
      moduleId: props.location.query.module_id,
      load: true,
      dataList: [],
      title: "",


      data: "",
      recommendList: [],     // vip商品列表
      isagreement: false,   // 是否同意开通会员
      tabList: [            // 特权列表
        { icon: '/src/img/vipPage/tab1.png', name: '超值畅饮', index: '1' },
        { icon: '/src/img/vipPage/tab2.png', name: '全场9折', index: '2' },
        { icon: '/src/img/vipPage/tab3.png', name: '书吧VIP', index: '3' },
        { icon: '/src/img/vipPage/tab4.png', name: '精品沙龙', index: '4' },
        { icon: '/src/img/vipPage/tab5.png', name: '生日特权', index: '5' }
      ],
      contentList: [
        {
          index: '1', title: '价值360元超值畅饮', texts: [
            '内含10张小泰咖啡任意饮品券',
            '每张券可兑换小泰咖啡任意饮品一杯',
            '有效期自开卡日起一年',
          ]
        },
        {
          index: '2', title: '线上线下全场9折', texts: [
            '优惠可叠加，折上9折',
            '买越多，赚越多，轻松省回288',
            '线下特殊商品除外，线上仅限自营商品'
          ]
        },
        {
          index: '3', title: '会员专享空间', texts: [
            '数千本书籍免费阅读',
            '专享安静舒适空间',
            '会员可将图书外带'
          ]
        },
        {
          index: '4', title: '会员专属门店精品沙龙活动', texts: [
            '每月至少8场精品沙龙任意选择'
          ]
        },
        {
          index: '5', title: '会员生日送惊喜', texts: [
            '价值99元泰然城生日大礼包一份',
            '生日蛋糕一份'
          ]
        },
      ],
      tabIndex: 1,         // 点击对特权序号
      is_vip: false,       // 是否是vip
      member_name: '',      //会员名字
      phone: '',       //名字用手机号
      remain_days: 0,      // vip剩余天数
      member_level_end_time: "", //会员到期
      vip_discount: 0,     // 会员折扣
      inviter: "",         // 邀请人
      isOpening: false,     // 是否正在开通会员中
      inviteInput: false, //邀请人弹框
      latitude: "",      //纬度
      longitude: "",    //经度
    }
  }

  static contextTypes = {
    store: React.PropTypes.object,
    isApp: React.PropTypes.bool,
    isLogin: React.PropTypes.bool,
  };


  componentDidMount () {
    const { inviter, latitude, longitude } = this.props.location.query
    let local_url_info = JSON.parse(getCookie('local_url_info'));
    let tr_vip_info = JSON.parse(getCookie('tr_vip_info'));

    let _inviter = ""
    let _latitude = ""
    let _longitude = ""
    if (tr_vip_info && tr_vip_info.inviter) {
      _inviter = tr_vip_info.inviter
    }
    if (inviter) {
      _inviter = inviter
    }
    if (_inviter.length > 0) {
      this.checkVipInviterFun(_inviter, false).then((res) => {
        _inviter = _inviter
      }).catch((err) => {
        _inviter = ""
      })
    }
    if (local_url_info && local_url_info.latitude) {
      _latitude = local_url_info.latitude
    }
    if (latitude != undefined) {
      _latitude = latitude
    }

    if (local_url_info && local_url_info.longitude) {
      _longitude = local_url_info.longitude
    }
    if (longitude != undefined) {
      _longitude = longitude
    }
    setTimeout(() => {
      this.setUrlStore(_latitude, _longitude);
      this.setInviter(_inviter)
      this.setState({
        inviter: _inviter,
        latitude: _latitude,
        longitude: _longitude
      }, () => {
        if (this.context.isLogin) {
          this.getVipInfo();
          this.getRecommend();
          this.getUserPhone();
        } else {
          window.location.href = "trmall://to_login"
        }
      })
    }, 500);
  }

  componentDidUpdate () {

  }

  setUrlStore (_latitude, _longitude) {
    // 存储url
    let { latitude, longitude } = this.props.location.query;
    if (latitude || longitude || this.state.inviter) {
      let _data = {
        latitude: _latitude,
        longitude: _longitude,
        phone: this.state.phone
      }
      clearCookie('local_url_info');
      setCookie('local_url_info', JSON.stringify(_data))
    }
  }

  setInviter (newinviter) {
    let _datas = {
      inviter: newinviter
    }
    clearCookie('tr_vip_info');
    setCookie('tr_vip_info', JSON.stringify(_datas))
  }


  /**
   * 跳转到门店-预约项目列表
   */
  turnActivity () { }

  /**
   * 跳转到门店-我的卡券
   */
  turnCard () { }
  /**
   * 点击特权
   */
  tapTab (index) {
    this.setState({
      tabIndex: +index
    })
  }
  /**
   * 开通会员
   */
  openVip () {
    if (this.state.isagreement) {
      this.openVipRequest()
    } else {
      const { store } = this.context;
      store.dispatch(tipActionCreator("请先阅读并同意《泰享会员(付费)服务协议》"));
    }
  }

  /**
   * 请求开通会员接口
   * @param tude：{latitude, longitude}  纬度， 经度
   */
  openVipRequest () {
    if (this.state.isOpening) {
      return;
    }
    let local_url_info = JSON.parse(getCookie('local_url_info'));
    let { latitude, longitude } = this.state
    const locationLatitude = (latitude || latitude == "") ? latitude : (local_url_info && local_url_info.latitude ? local_url_info.latitude : "")
    const locationLongitude = (longitude || longitude == "") ? longitude : (local_url_info && local_url_info.longitude ? local_url_info.longitude : "")
    const _phone = this.state.phone ? this.state.phone : (local_url_info && local_url_info.phone ? local_url_info.phone : "")
    const _inviter = this.state.inviter ? this.state.inviter : (local_url_info && local_url_info.inviter ? local_url_info.inviter : "")
    this.setState({
      isOpening: true
    }, () => {
      axios.request({
        ...pageApi.applyVipUser,
        data: {
          phone: _phone, //手机号
          inviter: _inviter,
          locationLatitude: locationLatitude,
          locationLongitude: locationLongitude
        }
      }).then((res) => {
        this.setState({
          isOpening: false
        })
        browserHistory.push(`/cashier?oid=${res.data.data.order_no}`);
      }).catch((err) => {
        this.setState({
          isOpening: false
        })
        const { store } = this.context;
        store.dispatch(tipActionCreator('申请会员失败'));
      })
    })
    this.setUrlStore(locationLatitude, locationLongitude, _inviter);
  }

  /**
   * 获取推荐商品
   */
  getRecommend () {
    axios.request({
      ...pageApi.recommend
    }).then(res => {
      if (res.data.code === 0) {
        this.setState({
          recommendList: [].concat(res.data.data, [{ more: true, id: 'more' }])
        })
      }
    }).catch(error => {

    });
  }

  getUserPhone () {
    const token = getCookie('token');
    axios.request({
      url: `${UCENTER}/user`,
      headers: { 'Authorization': "Bearer " + token },
      params: { needPhone: true }
    }).then(({ data }) => {
      if (data.code === "200") {
        //登录用户跳转链接
        this.setState({
          phone: data.body.phone
        })
      }
    }).catch(err => {

    })
  }

  /**
   *  获取会员信息
   * */
  getVipInfo () {
    axios.request({
      ...pageApi.getVipInfo,
      params: {

      }
    }).then((result) => {
      if (result.data.code === 0) {
        const { is_vip, vip_discount, remain_days, member_level_end_time, inviter, member_name } = result.data.data;
        let user_avatar = JSON.parse(getCookie('tr_vip_info'));
        let _inviter = is_vip ? inviter : (this.state.inviter ? this.state.inviter : (user_avatar && user_avatar.inviter) ? user_avatar.inviter : "")
        this.setState({
          is_vip,
          vip_discount,
          remain_days,
          member_level_end_time,
          member_name,
          inviter: _inviter
        });
        if (is_vip) {
          this.setInviter(_inviter);
        }
      }
    }).catch((err) => {
      // const { store } = this.context;
      // store.dispatch(tipActionCreator('获取会员信息失败'));
    })
  }

  /**
   * 不同意协议
   */
  notAgree () {
    this.setState({
      isagreement: false
    })
  }
  /**
   * 同意协议
   */
  agree () {
    this.setState({
      isagreement: true
    })
  }
  setAgreement () {
    this.setState({
      isagreement: !this.state.isagreement
    })
  }

  goVipAgreement () {
    browserHistory.push(`/vipAgreement`);
  }

  changeHandle = (e) => {
    const value = e.target.value;
    let _test = /^[0-9]*$/;
    let _boolean = _test.test(value);
    if (_boolean) {
      this.setState({
        inviter: value
      });
    }
  };

  inviteClick () {
    let _inviter = this.state.inviter
    let _test = /^1\d{10}$/;
    let _boolean = _test.test(_inviter);
    if (_boolean) {
      this.checkVipInviterFun(_inviter, true)
    } else {
      const { store } = this.context;
      store.dispatch(tipActionCreator('请输入正确手机号'));
    }
  }

  checkVipInviterFun (_inviter, type = true) {
    return new Promise((resolve, reject) => {
      axios.request({
        ...pageApi.checkVipInviter,
        params: {
          phone: _inviter
        }
      }).then(res => {
        if (res.data.code == 200) {
          if (this.state.is_vip) {
            this.upInviterFun(_inviter);
          }
          this.closeInviteCard(false, false);
          this.setInviter(_inviter);
          if (type) {
            const { store } = this.context;
            store.dispatch(tipActionCreator("邀请码填写成功"));
          }
          resolve(res)
        } else {
          if (type) {
            const { store } = this.context;
            store.dispatch(tipActionCreator(res.data.message));
          }
          reject(res)
        }
      }).catch(error => {
        reject(error)
      });
    })
  }
  upInviterFun (_inviter) {
    axios.request({
      ...pageApi.updateVipUser,
      data: {
        inviter: _inviter
      }
    }).then(res => {
      if (res.data.code === 0) {

      }
    }).catch(error => {

    });
  }

  closeInviteCard (type = false, clear = true) {
    let inviter = clear ? "" : this.state.inviter
    this.setState({ inviteInput: type, inviter })
  }

  returnList () {
    let returnLists = []
    let _tabIndex = this.state.tabIndex
    this.state.tabList.map((item, index) => {
      returnLists.push(
        <div className="vip-rights-tab" onClick={this.tapTab.bind(this, item.index)} key={index}>
          <div className={_tabIndex == item.index ? 'vip-tab-icon active' : 'vip-tab-icon'}>
            <img src={item.icon}></img>
          </div>
          <text className="vip-tab-text">{item.name}</text>
        </div>)
    })
    return returnLists
  }

  returnContentList () {
    let returnContentList = []
    let _contentList = this.state.contentList
    let _tabIndex = this.state.tabIndex
    _contentList[_tabIndex - 1].texts.map((text, index) => {
      returnContentList.push(
        <div className="vip-rights-text-div" key={index}>
          <text className="vip-rights-text">{text}</text>
        </div>
      )
    })
    return returnContentList
  }

  returnInviteType () {
    let _inviter = this.state.inviter
    let _is_vip = this.state.is_vip
    if (_is_vip && _inviter === "" || (!_is_vip && _inviter === "")) {
      return <div className="vip-invite-mes">
        <span className="vip-invite-span">欢迎开通泰享会员，请完善好友邀请码</span>
        <button className="vip-show-invite" onClick={this.closeInviteCard.bind(this, true, true)}>去填写</button>
      </div>
    } else if (!_is_vip && _inviter != "") {
      let _phone = this.phoneToSec(_inviter);
      return <div className="vip-invite-mes">
        <span className="vip-invite-span">您的好友{_phone}邀请您开通泰享会员</span>
      </div>
    } else {
      return null
    }
  }

  phoneToSec (phone = "") {
    return phone == "" ? "" : phone.slice(0, 3) + "****" + phone.substr(phone.length - 4, 4)
  }

  userName () {
    let _member_name = this.state.member_name
    let _phone = this.state.phone
    if (_phone != "") {
      _phone = this.phoneToSec(_phone)
    }
    return _member_name != "" ? (_member_name.length > 8 ? _member_name.slice(0, 8) + "..." : _member_name) : _phone
  }


  render () {
    // if (this.state.load) return <LoadingRound />;
    let user_avatar = JSON.parse(getCookie('user_avatar'));
    const { is_vip, inviteInput, tabList, tabIndex, recommendList, isagreement, remain_days, contentList, inviter } = this.state;
    let { member_level_end_time } = this.state;

    if (member_level_end_time) {
      member_level_end_time = member_level_end_time.slice(0, 10).replace(/-/g, ".")
    }
    let _cssChange = (is_vip && inviter === "") || (!is_vip && inviter === "") || (!is_vip && inviter != "") ? true : false
    return (
      <div className="vip-page">
        {/* <div className={_cssChange ? 'vip-page-topbg vip-page-topbg-height' : 'vip-page-topbg'}>
          <img src="https://image.tairanmall.com/7073408cf0fa69bec82b9d64846fc1765d4d3ce75a0ac"></img>
        </div> */}
        <div className="vip-page-top">
          <div className="vip-user-info">
            <div className="vip-photo">
              <img className="vip-avatar" src={user_avatar && user_avatar.avatar ? user_avatar.avatar : '/src/img/evaluate/user-img.png'} alt="" />
              {is_vip ? <img className="vip-huangguan" src={'/src/img/vipPage/huangguan.png'} alt="" /> : null}
            </div>
            {is_vip ? <div className="vip-mes">
              <div className="vip-info">
                <div className="vip-name">{this.userName()}</div>
                <div className="vip-typelog">泰享会员</div>
              </div>
              <div className="vip-time">{member_level_end_time}  会员到期</div>
            </div> :
              <div className="vip-mes">
                <div className="vip-info">
                  <div className="vip-name">{this.userName()}</div>
                  <div className="vip-typelog">未开通</div>
                </div>
              </div>}

          </div>
          <div className="vip-page-top-relative">
            <div className="vip-top-card-box">
              <div className="vip-top-card">
                <div className="vip-card-title">
                  泰享品质好生活
                            </div>
                {is_vip ? <div className="vip-card-text">您已开通泰享会员，享5大特权 <div className="vip-remaining">剩{remain_days}天</div></div> : <div className="vip-card-text">开通泰享会员，享5大特权，仅需288元/年</div>}
              </div>
            </div>
            {this.returnInviteType()}
            <div className="vip-top-text">
              开通泰享会员 <img src="/src/img/vipPage/v.png" className="vip-v-image"></img>享5大特权
                    </div>
            <div className="vip-rights-tab-box">
              {this.returnList()}
            </div>
            <div className="vip-rights-content-box">
              <div className={'vip-rights-content vip-rights-content_' + tabIndex}>
                <div className="rights-content-title">{contentList[tabIndex - 1].title}</div>
                <div className="title-border"></div>
                <div className="vip-rights-texts">
                  {this.returnContentList()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="vip-activity" onClick={this.turnActivity}>
          <img className="vip-activity-img" src="/src/img/vipPage/vip-activity.png"></img>
          <text className="vip-activity-text">欢迎莅临泰然城线下门店</text>
        </div>

        {recommendList && recommendList.length > 0 ? <div className="vip-goods">
          <div className="vip-goods-title">
            <img className="title-line" src="/src/img/vipPage/line1.jpg"></img>
            <text>泰享会员优选商品</text>
            <img className="title-line" src="/src/img/vipPage/line2.jpg"></img>
          </div>
          <ItemSwipe data={this.state.recommendList} />
        </div> : null}
        {!is_vip ? <div className="agreement-box">
          <div className="agreement-icon-tap" onClick={this.setAgreement.bind(this)}>
            {!isagreement ? <div className="not-agreement-icon agreement-icon"></div> : <img className="agreement-icon" src="/src/img/vipPage/agreement.png"></img>}
          </div>
          <text className="agreement-text1" onClick={this.setAgreement.bind(this)}>已阅读并同意</text>
          <text className="agreement-text2" onClick={this.goVipAgreement.bind(this)}>《泰享会员(付费)服务协议》</text>
        </div> : null}
        {!is_vip ?
          <div onClick={this.openVip.bind(this)} className="open-btn">
            <text>立即开通 ¥288/年</text>
          </div> : null
        }
        {inviteInput ? <div className="invite-input">
          <div className="invite-content">
            <img className="invite-close" src="src/img/icon/close/close-icon.png" alt="" onClick={this.closeInviteCard.bind(this, false, true)} />
            <div className="invite-title">完善邀请人信息</div>
            <input className="invite-def invite-inputs" value={inviter} type="search" placeholder="请输入邀请码" maxLength="11" onChange={this.changeHandle} />
            <button className="invite-def invite-btn" onClick={this.inviteClick.bind(this)}>确定</button>
          </div>
        </div> : null}

        <PopupCtrl />
      </div>
    )
  }
}

//弹窗控制
class PopupCtrl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      data: ""
    }
  }
  static contextTypes = {
    store: React.PropTypes.object
  };
  typeChangeHandle () {
    this.setState({
      type: ""
    })
  };
  componentDidMount () {
    const { store } = this.context;
    this.unSubs = store.subscribe(() => {
      const state = store.getState().initial;
      if (state.type === "POPUP") {
        this.setState({
          type: state.popType,
          data: state.data
        });
      }
    });
  }
  componentWillUnmount () {
    this.unSubs();
  }
  render () {
    const { type, data } = this.state;
    return (
      <div>
        <PopupModal active={type === "modal"} msg={data.msg} onClose={this.typeChangeHandle.bind(this)} onSure={(close) => { data.cb && data.cb(); close(); }} />
        <PopupTip active={type === "msgTip"} msg={data.msg} onClose={this.typeChangeHandle.bind(this)} />
        {type === "load" && <TransShady />}
      </div>
    )
  }
}
