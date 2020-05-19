import React, { Component } from 'react';
import ReactDOM,{ render } from 'react-dom';
import { Link } from 'react-router';
import 'src/scss/item.scss';
import { connect } from 'react-redux';
import { concatPageAndType, actionAxios, actionAxiosAll } from 'js/actions/actions'
import {FilterTrade, FilterTradeType,createMSG, createAction,PurchaseLimit,FilterTradeClass, TradeFade} from 'filters/index'
import {dateUtil,RHOST} from "../../../js/util/index"
import {LoadingRound,EmptyPage,ShareAndTotop, LinkChange,OpenInAppGuide} from 'component/common';
import { browserHistory } from 'react-router';
import {onAreaResultJSBrige} from "../../../js/jsbrige/index"
import Popup , {Modal, Fix,PopupModal, ModalTips} from 'component/modal';
import axios from 'axios';

import {
  SeverArea, // 配送区域
  ScrollImageState, // 滚动图片
  GoodsTit,
  PriceArea,
  Tag,
  Collect,
  ToCart,
  Specs,
  FreePostage,
  createShareData,
  CouponWrap,
  GoodsDetail,
  EvaluateArea,
  createBuyAction,
  ExpectTax,
  getPrice,
  PromotionInfo,
  PromotionWrap,
  Action,
  getDefaultSku,
  ShopArea
} from "./detail.jsx"



const createActions = concatPageAndType('seckill');
const axiosActions = actionAxios('seckill');



class BuyModalTitle extends Component {

  initList() {
    let {clickList, data, getSpec} = this.props;
    let defaultSku = getDefaultSku(data.item) || {};
    let keys = $.isEmptyObject(clickList) ? Object.keys(defaultSku) : Object.keys(clickList);
    let list = [], spec;

    if (!keys) {
      return
    } else {
      keys.forEach((val, keys) => {
        spec = $.isEmptyObject(clickList) ? getSpec(val, defaultSku[val]) : getSpec(val, clickList[val]);
        list.push(<span key={keys}>{spec.text}</span>)
      });
      return (
        <p className="text-price-sel" style={{display: "block"}}>已选
          {list}
        </p>
      )
    }
  }

  getImg() {
    let {clickList, getSpec, data} = this.props;
    let defaultSku = getDefaultSku(data.item);
    let keys = Object.keys(defaultSku || clickList).reverse();
    let ret, spec;
    keys.some((val, keys) => {
      spec = getSpec(val, (defaultSku && defaultSku[val] || clickList[val]));
      ret = spec.image;
      return ret
    });
    if (!ret) {
      return this.props.data.item.primary_image
    } else {
      return ret
    }
  }
  render() {
    let {item } = this.props.data;
    let  strfilterTrade = FilterTrade(item.trade_type);
    let tradeClass = FilterTradeClass(item.trade_type);
    return (
      <ul className="ui-table-view">
          <li className="ui-table-view-cell">
                <span className="posit-img"><img className="ui-media-object ui-pull-left" src={this.getImg()}
                                                 width="80" height="80"/></span>
              <div className="ui-media-body window-head">
                {
                  strfilterTrade ?
                    <p style={{position: "relative", height: "18px"}}>
                        <span className={tradeClass}>{strfilterTrade}</span>
                    </p>:null
                }
                  <div className="price-tag">
                      <p className="ui-ellipsis text-price action-update-price">
                          ¥{getPrice(this.props)}</p>
                      <p className="free-postage-tag-wrap">
                          <FreePostage {...this.props} />
                      </p>
                  </div>
                {this.initList()}
              </div>
          </li>
      </ul>
    )
  }
}


class BuyModalInfo extends Component {

  initList() {
    let {specs} = this.props.data.item;
    let specsKeys = Object.keys(specs);
    let ret = [];
    specsKeys.forEach((val, keys) => {
      ret.push(<Specs spec={specs[val]} {...this.props} key={keys}/>)
    });
    return ret
  }

  getLimit() {
    let {activity_type} = this.props.data;
    let {itemRules} = this.props
    if (activity_type == PromotionInfo.seckill.name) {
      return (
        <span className="limit_buy">限购{itemRules.user_buy_limit}件
          {itemRules.user_buy_count ? `(已购${itemRules.user_buy_count}件)` : ""}
                </span>
      )
    }
    return null
  }


  render() {
    let {addMinNum, num} = this.props;

    return (
      <div className="attr-wrap">
          <div className="standard-area stable-standard cur">
              <div className="standard-info">
                {this.initList()}
              </div>
          </div>
          <div className="buy-amount">
              <span className="amount-tit">数量：</span>{/* <span>库存:{this.props.getStore()}</span>*/}
              <span className="number-increase-decrease" style={{position: "relative"}}>
                <a href="javascript:void(0);" className="btn action-decrease"
                   onTouchTap={() => addMinNum(-1)}>-</a>
                <input type="number" readOnly className="action-quantity-input"
                       value={num}/>
                <span className="input_bak"></span>
                <a href="javascript:void(0);" className="btn action-increase"
                   onTouchTap={() => addMinNum(1)}>+</a>
                </span>
            {this.getLimit()}
              <div className="clearfix"></div>
          </div>
          <ExpectTax {...this.props} />
      </div>
    )
  }
}

class BuyModalButton extends Component {
  noop() {}
  render() {
    let {active, onClickCart, onClickBuy, getStore,purchaseLimit,seckillSure} = this.props;
    let isPurchaseLimit = purchaseLimit();

    return (
      <div className="buy-option-btn">
        {  getStore() ? active === "cart" ? <div className="btn-addcart" onTouchTap={onClickCart}>加入购物袋</div> :
          <div>
            { isPurchaseLimit ? <span className="purchase-limit">抱歉，海外直邮类商品和跨境保税类商品总价超过限额￥2000，请分次购买。</span>: null}
              <div className={isPurchaseLimit ? "c-bgc9" : "" + " btn-tobuy "} onClick={isPurchaseLimit || !seckillSure? this.noop : onClickBuy}>确定</div>
          </div>
          : <div className="buy_fast_no has_sellout" style={{color: "#fff", zIndex: 15, background:"#FF8888"}}>已售罄</div>
        }
      </div>
    )
  }
}


class BuyModal extends Component {
  constructor() {
    super();
    this.state = {
      captchaObj: {},
      seckillSure:false
    };
  }

  componentWillMount() {
    this.state = this.initState();
    this.loadCaptchas();
  }

  isOn = (id, spec)=> {
    return this.state.clickList[spec] == id ? "on" : ""
  }

  changeOn = (id, spec)=> {
    if (this.state.clickList[spec] === id) {
      return
    }
    this.state.clickList[spec] = id;
    if (this.updateSpec())
      this.updateNum(this.state.num);
    this.setState(this.state);
  }

  updateNum(num) {
    let {store} = this.props.data.item;
    let {activity_type} = this.props.data
    let {nowSpec, nowPromotionSpec} = this.state
    let snum, fn;
    if (num < 1) {
      return false
    }
    if (PromotionInfo[activity_type] && (fn = PromotionInfo[activity_type].getNum)) {
      snum = fn(this.props, this.state)
    } else {
      snum = nowPromotionSpec && nowPromotionSpec.real_store || (nowSpec ? nowSpec.store : store.total - store.freeze);
    }

    this.changeState({
      num: num > snum ? snum == 0 ? 1 : snum : num
    });

    return num > snum ? snum : true
  }

  changeState(obj) {
    this.setState(Object.assign(this.state, obj));
  }

  initState(num) {
    let ret = {
      isValid: this.state && this.state.isValid,
      nowSpec: null,
      clickList: {},
      nowSpecKey: null,
      nowPromotioinSpec: null,
      num: num || 1
    }

    let {specs} = this.props.data.item;
    this.specList = Object.keys(specs);

    if (!this.specList.length) {
      let nowSpec = ret.nowSpec = this.props.specs[0];
      ret.nowPromotioinSpec = this.props.itemRules[nowSpec.sku_id]
    }

    return ret
  }

  getSpec = (id, specId)=> {
    let {specs} = this.props.data.item;

    return specs[id].values[specId];
  }

  addMinNum = (num)=> {
    let cnum = this.state.num + num;
    let v = this.updateNum(cnum);

    if (v !== true) {
      Popup.MsgTip({
        msg: num < 0 ? createMSG("MINNUM") : createMSG("MAXNUM", v)
      })
    }
  }

  getStore = () => {
    let {activity_type} = this.props.data;
    let fn;
    if (PromotionInfo[activity_type] && (fn = PromotionInfo[activity_type].getStore)) {
      return fn(this.props, this.state)
    } else if (this.state.nowSpec) {
      return this.state.nowSpec.store > 0
    } else {
      return true
    }
  }

  purchaseLimit = ()=> {
    let {trade_type} = this.props.data.item;
    if (this.state.num > 1 && this.state.nowSpec && PurchaseLimit(trade_type)) {
      return this.state.num * this.state.nowSpec.price > 2000
    }
  }

  getActionData(flag) {
    let ret = {
      "item[item_id]": this.props.itemId,
      "item[quantity]": this.state.num,
      "item[sku_id]": this.state.nowSpec.sku_id,
      "in_promotion_time": this.props.promotion[0].in_promotion_time,
      "obj_type": "seckill"
    }, {user_id} = this.props.location.query;

    // 添加分佣用户id
    if (user_id) {
      ret.commission_user_id =user_id
    }

    flag && (ret.mode = "fast_buy");
    return ret
  }

  closeAndClear() {
    this.props.toggleModal();
    this.setState(this.initState());
  }

  onClickBuy = () => {
    let {captchaObj} = this.state;
    let defaultSku = getDefaultSku(this.props.data.item);
    if (Object.prototype.toString.call(defaultSku) === "[object Object]") {
      this.state.clickList = defaultSku ? defaultSku : {};
      this.updateSpec();
    }
    if (!this.checkSpec()) {
      Popup.MsgTip({
        msg: createMSG("SELECTSPEC")
      });
      return
    } else {
      captchaObj.verify();
    }
  };

  toCart = (result) => {
    let loading = false;
    if (!loading) {
      loading = true;

      let data = this.getActionData(true);
      data['geetest_challenge'] = result.geetest_challenge;
      data['geetest_validate'] = result.geetest_validate;
      data['geetest_seccode'] = result.geetest_seccode;

      $.ajax(Action("toCart", {
        data: data,
        success: (data) => {
          loading = false;
          if (!data.status) {
            Popup.MsgTip({
              msg: data.msg
            });
            return
          }
          let buy_type = data.data.buy_type;
          location.href = '/orderConfirm?mode=fast_buy&buy_type=' + buy_type;
        }
      }))
    }
  };

  loadCaptchas = () => {
    let self = this;
    $.ajax({
      url: "/originapi/item/loadCaptcha?t=" + (new Date()).getTime(), // 加随机数防止缓存
      type: "get",
      dataType: "json",
      success: function (res) {
        var data = eval("(" + res.data + ")");
        initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          new_captcha: data.new_captcha,
          offline: !data.success,
          product: "bind"
        }, self.handlerEmbed);
      }
    });
  };


  handlerEmbed = (captchaObj) => {
    let self = this;
    captchaObj.onError(function () {
      Popup.MsgTip({
        msg: "验证错误"
      });
    }).onSuccess(function () {
      let result = captchaObj.getValidate();
      if (!result) {
        Popup.MsgTip({
          msg: "请完成验证"
        });
      }
      $("input[name='mode']").val("fast_buy");
      self.toCart(result);
    });
    if (captchaObj) {
      this.setState({
        captchaObj: captchaObj,
        seckillSure:true
      });
    }
  };

  updateSpec() {
    if (!this.checkSpec()) {
      return false;
    }
    let key = this.specList.join("_").replace(/\d+/g, (key) => this.state.clickList[key]);
    let nowSpec
    if (key !== this.state.nowSpecKey) {
      nowSpec = this.props.specs[key];
      this.changeState({
        nowSpec,
        nowSpecKey: key,
        nowPromotioinSpec: this.props.itemRules[nowSpec.sku_id]
      });
    }

    return this.state.nowSpec;
  }

  checkSpec() {
    if (Object.keys(this.state.clickList).length === this.specList.length) {
      return true
    }
  }

  render() {
    let props = {
      addMinNum: this.addMinNum,
      isOn: this.isOn,
      getStore: this.getStore,
      changeOn: this.changeOn,
      getSpec: this.getSpec,
      onClickCart: this.onClickCart,
      onClickBuy: this.onClickBuy,
      purchaseLimit: this.purchaseLimit.bind(this),
      ...this.state,
      ...this.props
    };

    return (
      <Modal isOpen={this.props.modal} onClose={() => this.closeAndClear()}
             className="action-buy-modal action-buy-seckill">
          <div className="in-panel">
              <div className="in-panel">
                  <div className="close-btn-wrap">
                      <span className="close-btn"><i className="icon icon-close"></i></span>
                  </div>
                  <BuyModalTitle {...props} />
                  <BuyModalInfo {...props} />

                  <BuyModalButton {...props} />
              </div>
          </div>
      </Modal>
    )
  }
}

export class Buy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      active: null,
    }
  }

  active(tab) {
    this.setState({
      modal: true,
      active: tab
    })
  }

  toggleModal = ()=> {
    this.setState(Object.assign(this.state, {
      modal: false
    }))
  }
  isShelves = () => {
    return this.props.data.item.status === "Shelves"
  }
  isSaleOut() {
    let {promotion} = this.props;
    let {item} = this.props.data;
    let realStore =  promotion && promotion.itemRules && promotion.itemRules.real_store;
    if (realStore == null) {
      realStore =  +item.realStore
    }
    return !! realStore
  }
  isLimit() {
    let {promotion} = this.props;

    return promotion.itemRules.user_buy_limit >  promotion.itemRules.user_buy_count
  }
  isCharge() {
    let {item} = this.props.data;
    return item.is_charge
  }
  popTips(msg) {
    Popup.MsgTip({
      msg: msg
    });
  }
  render() {
    let props = {
      ...this.props,
      ...this.state,
      toggleModal: this.toggleModal
    }

    return (
      this.isCharge() ? null :
        this.isShelves() ?
          this.isSaleOut() ?
            <div className="action-btn-group  c-fr">
                <BuyModal {...props} />
              {
                this.props.state == 2 ? this.isLimit() ?
                  <LinkChange className="ui-btn  action-addtocart  action-btn-seckill-in c-fl" onClick={(e) => {	Modal.close();
                    this.active("buy")}}>立即秒杀</LinkChange> :
                  <LinkChange className="ui-btn  action-addtocart  action-btn-seckill-disable c-fl">立即秒杀</LinkChange> :
                  this.props.state == 1 ?
                    <LinkChange className="ui-btn  action-notify" >秒杀结束</LinkChange> :
                    <LinkChange className="ui-btn  action-notify" onTouchTap= {() => this.popTips("秒杀还未开始")}>即将开始</LinkChange>
              }
            </div>
            :
            <div className="action-btn-group c-fr">
                <LinkChange type="button" className="ui-btn action-notify action-btn-seckill-disable">已秒完</LinkChange>
            </div>:
          <div className="action-btn-group c-fr">
              <LinkChange type="button" className="ui-btn action-notify">暂不销售</LinkChange>
          </div>

    )
  }
}


let BuyAction = createBuyAction({Buy})

class Notice extends Component {


  formatTime (time) {
    return dateUtil.formatNum(parseInt(time))
  }

  render () {
    let state = this.props.state;
    let toend = this.props.toend;

    return (

      state == 1 ? null :
        <div className="detail-seckil-state-area">
            <div className="seckil-state-area-l c-fl">
                <h2 className=" c-fl">秒杀</h2>{state == 2 ? <span className="in-seckil c-tc c-dpib">抢购中</span>:null}
            </div>

          {
            !state ?

              <div className="seckil-state-area-r-no c-fr">预计{dateUtil.format(this.props.start_time*1000, "M月D日H:F:S")}开始</div>
              :
              <div className="seckil-state-area-r-in c-fr">
                  <div>
                      <div className="c-dpb c-tc">离结束还剩</div>
                      <div className="time-remain c-tc">
                          <div className="c-dpib">
                              <font>{this.formatTime(toend/3600)}</font>
                              :
                              <font>{this.formatTime(toend%3600/60)}</font>
                              :
                              <font>{this.formatTime(toend%60)}</font>
                          </div>
                      </div>
                  </div>
              </div>
          }
        </div>

    )
  }
}

/*class CheckWrap extends Component {
 render () {
 return <div className="seckill-code-content">
 <h2>请输入验证码</h2>

 <div className="code-input-area">
 <input type="text" value={this.props.inputVal} onChange={(e) => this.getInput(e)}/><img  className="get-code" src={this.props.valid.primary_image} />
 {this.props.validError ? <span className="error">{this.props.errorVal}</span> : null }

 </div>
 </div>
 }

 }*/

/*class PromoteWrap extends Component {

 getInput(e) {
 this.props.validVal(e.target.value)
 }
 createMsg() {
 return <div className="seckill-code-content">
 <h2>请输入验证码</h2>

 <div className="code-input-area">
 <input type="text" value={this.props.inputVal} onChange={(e) => this.getInput(e)}/><img  className="get-code" src={this.props.valid.primary_image} />
 {this.props.validError ? <span className="error">{this.props.errorVal}</span> : null }

 </div>
 </div>
 }
 closeModal() {
 this.setState({});
 this.props.PopupModal(false)
 }

 onSure() {
 if (!this.props.inputVal) {
 return  this.props.validError("请输入验证码")
 } else {
 this.props.checkCaptcha(this.props.inputVal)
 }
 }
 resetScroll() {
 setTimeout(function () {
 document.body.scrollTop +=1
 }, 100)
 }

 render () {
 return (
 <ModalTips isOpen= {this.props.popupModalCtrl.show} msg = {this.createMsg() } onClose={ () => {this.closeModal(); this.resetScroll(); } } onSure = {() => {this.onSure(); this.resetScroll();}} className="modal-seckill-code"/>
 )
 }
 }*/

// 活动
class ActiveArea extends Component {
  render() {
    return( <div className="active-area">
        <PromotionWrap {...this.props} />
    </div>)
  }
}


class detail extends Component {

  componentWillMount() {
    let {now_time, end_time, start_time} = this.props.promotion[0]
    this.props.initData({now_time, end_time, start_time});
    this.timer = setInterval( () => {
      this.props.observeState();
    }, 1000)
  }

  componentWillReceiveProps(props) {

    if (props.state == 1) {
      location.reload();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
    this.props.clearData()
  }
  render() {
    let {data} = this.props;

    return (
      <div data-page="item-details" id="itemDetails">
          <ScrollImageState data={data.item.images}/>
          <Notice {...this.props} />
          <PriceArea {...this.props} />
          <div className="gap bgf4"></div>
          <ActiveArea {...this.props} />
          <SeverArea data={data}/>
          <div className="gap bgf4"></div>
          <ShopArea {...this.props}/>
          <div className="gap bgf4"></div>
          <EvaluateArea {...this.props}/>
          <div className="gap bgf4"></div>
          <GoodsDetail data={data}/>
          <BuyAction {...this.props} />
          <ShareAndTotop config={createShareData(data)}/>
          <OpenInAppGuide />
        {/*<PromoteWrap {...this.props} />*/}
      </div>
    )
  }
}
function seckillState ( state ) {
  return {
    ...state.seckill
  }
}

function seckillDispatch(dispatch) {
  let loading = false;
  let rCom
  return {
    clearData() {
      dispatch(createActions("clearData", {}))
    },
    initData(props) {
      dispatch(createActions("initData", props))
    },
    observeState() {
      dispatch(createActions("observeState", {}))
    },
      /*PopupModal(show) {
       dispatch(createActions("popupModalCtrl", {popupModalCtrl: {show}}));
       dispatch(createActions("clearCaptcha", {}))
       loading = false
       },*/
      /*loadCaptcha(ref) {
       if (ref) rCom = ref
       dispatch(axiosActions("loadCaptcha", {
       url: "/originapi/item/loadCaptcha"
       }))
       },*/

      /*validError(str) {
       dispatch(createActions("validError", {errorVal: str}))
       },*/
      /*validVal (str) {
       dispatch(createActions("validVal", {inputVal: str}))
       },*/
      /*checkCaptcha(code) {
       if (!loading) {
       loading = true;

       let data = rCom.getActionData(true);
       data.captcha_code = code;

       $.ajax(Action("toCart", {
       data: data,
       success: (result) => {
       loading = false;
       rCom.closeAndClear();

       if (result.biz_code == 1001) {
       //	this.validError(res.data.msg);
       dispatch(createActions("validVal", {inputVal: ""}))
       this.loadCaptcha()
       return ;
       }
       this.PopupModal(false)
       if (!result.status) {
       return
       }

       let buy_type = result.data.buy_type;
       // browserHistory.push('/orderConfirm?mode=fast_buy&buy_type=' + buy_type);
       location.href='/orderConfirm?mode=fast_buy&buy_type=' + buy_type;
       }
       }))

       }
       }*/

  }
}
export default connect( seckillState, seckillDispatch )( detail );