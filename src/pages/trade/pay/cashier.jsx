import React, { Component } from 'react';
import { ownAjax } from 'js/common/ajax.js';
import { MALLAPI, PAYURL } from 'config/index'
import axios from 'js/util/axios';
import Popup from 'component/modal';
import { LoadingRound } from 'component/common';

const pageApi = {
  GroupBuy: { url: `${MALLAPI}/promotion/checkGroupBuy`, method: "post" },   //拼团校验
  cashier: { url: `${MALLAPI}/payment/intentions`, method: "get" },
  payQuery: { url: `${MALLAPI}/payment/status`, method: "get" },
};

export default class Cashier extends Component {
  constructor(props) {
    super(props);
    this.promotionId = props.location.query.promotionId;
    this.isGroupBuy = props.location.query.isGroupBuy === 'true';
    this.tid = props.location.query.oid;
    this.from = props.location.query.from;
    this.host = window.location.origin;
    this.payment_no = "";
  }

  componentWillMount () {
    document.title = "订单支付";
    window.location.href = "jsbridge://set_title?title=订单支付";
    const host = window.location.protocol + "//" + window.location.host;
    const { oid, zeroBuy, from } = this.props.location.query;
    window.onTRCPayResult = (state) => {
      if (state === 'true') {
        //支付状态
        axios.request({
          ...pageApi.payQuery, params: {
            payment_no: this.payment_no
          }
        }).then(({ data }) => {
          /*if (data.data.status !== 3) {
              window.location.href = 'jsbridge://open_link_at_stack_root?url=' + window.btoa(host + `/payResult?status=${data.data.status}`);
          }*/
          window.location.href = 'jsbridge://open_link_at_stack_root?url=' + window.btoa(host + `/vipPayOk`);
        }).catch(err => {
          Popup.MsgTip({ msg: err.response.data.message });
          setTimeout(() => {
            window.location.href = 'jsbridge://open_link_at_stack_root?url=' + window.btoa(host + "/vipPage");
          }, 2000);
        })
      } else {
        window.location.href = 'jsbridge://open_link_at_stack_root?url=' + window.btoa(host + "/vipPage");
      }
    };
    //拼团校验
    if (this.isGroupBuy) {
      if (this.promotionId) {
        axios.request({
          ...pageApi.GroupBuy,
          data: {
            promotion_id: this.promotionId,
            object_id: 0,
            order_no: this.tid
          }
        }).then(({ data }) => {
          if (data.data.status) {
            this.cashierFun();
          }
        }).catch(err => {
          Popup.MsgTip({ msg: err.response.data.message || "服务器繁忙" });
          setTimeout(() => {
            browserHistory.replace('/tradeList/0');
          }, 2000)
        })
      } else {
        //this.promotionId为0
        Popup.MsgTip({ msg: "活动已结束" });
        setTimeout(() => { browserHistory.replace('/tradeList/0') }, 2000)
      }

    } else {
      this.cashierFun();
    }
    /*axios.request({
        ...pageApi.cashier, params: {
            order_no: oid
        }
    }).then(({data}) => {
        this.payment_no = data.data.payment_no;
        if (data.data.business.pay_mode === 3) {
            if (from === "list") {
                window.location.replace(`${ window.location.protocol }//pay.tairanmall.com/checkstand_wx/#/successByOffline?payId=${ data.data.business.pay_id }` +
                    `&orderId=${ oid }` +
                    `&from=trc` +
                    `&successUrl=${ encodeURIComponent(this.host + '/payResult?status=3') }` +
                    `&errorUrl=${ encodeURIComponent(this.host + '/tradeList/0') }`
                );
            } else {
                window.location.replace(`${ window.location.protocol }//pay.tairanmall.com/checkstand_wx/#/loading?payId=${ data.data.business.pay_id }` +
                    `&orderId=${ oid }` +
                    `&from=trc` +
                    `&successUrl=${ encodeURIComponent(this.host + '/payResult?status=3') }` +
                    `&errorUrl=${ encodeURIComponent(this.host + '/tradeList/0') }`
                );
            }
            return;
        }
        window.location.href = `jsbridge://pay_by_trcpay?payid=${data.data.business.pay_id}&appid=${data.data.business.app_id}&from=${data.data.business.from}`;
    }).catch(err => {
        console.log(err);
        Popup.MsgTip({msg: "跳转收银台失败"});
        setTimeout(() => {
            window.location.href = 'jsbridge://open_link_at_stack_root?url=' + window.btoa(host + "/tradeList/0")
        }, 1000);
    })*/
  }

  componentWillUnmount () {
    window.onAlipayPayResult = null;
    const msgTip = document.querySelector("#msgTip");
    msgTip && msgTip.parentNode && msgTip.parentNode.removeChild(msgTip);
  }
  cashierFun = () => {
    axios.request({
      ...pageApi.cashier, params: {
        order_no: this.tid
      }
    }).then(({ data }) => {
      let { business, payment_no } = data.data;
      this.payment_no = payment_no;
      if (business.pay_mode === 3) {
        window.location.replace(
            `${PAYURL}/checkstand_wx/#/${this.from === "list" ? 'successByOffline' : 'loading'}?`+
          `payId=${business.pay_id}` +
          `&orgId=${business.org_id}` +
          `&successUrl=${encodeURIComponent(this.host + '/payResult?status=3')}` +
          `&errorUrl=${encodeURIComponent(this.host + '/tradeList/0')}`
        );
        return;
      }
      window.location.href = `jsbridge://pay_by_trcpay?payid=${business.pay_id}&appid=${business.app_id}&orgId=${business.org_id}&payment_no=${payment_no}`;
    }).catch(err => {
      console.log(err);
      Popup.MsgTip({ msg: "跳转收银台失败" });
      setTimeout(() => {
        window.location.href = 'jsbridge://open_link_at_stack_root?url=' + window.btoa(host + "/tradeList/0")
      }, 1000);
    })
  };
  render () {
    return <LoadingRound />
  }
}
