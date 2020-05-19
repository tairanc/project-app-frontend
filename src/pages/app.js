// application's entry
require('es6-promise').polyfill();
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import reducers from 'reducers/index';
import $ from 'n-zepto'; //dom库
import { composeWithDevTools } from 'redux-devtools-extension';
import axios from 'axios';
import { setCookie, clearCookie } from 'js/common/cookie';

import { UCENTER, COLLECTURL } from 'config/index';

import createTapEventPlugin from 'react-tap-event-plugin';
createTapEventPlugin(); //添加touchTap事件

//公用scss
import '../scss/common.scss';
import '../scss/grid.scss';
import '../scss/animation.scss';
import '../scss/ReactTransition.scss';

//公用插件
import 'plugin/flexible.min.js';
import 'src/plugin/swiper/swiper.scss';

const pageApi = {
  uc_isLogin: { url: `${UCENTER}/user` }, //是否登录
};

// 设置ajax get全局缓存，兼容ios最新版框架
$.ajaxSettings.cache = false;

//获取cookie值中的origin，判断是否是在app中
function getCookie (name) {
  let cookie = document.cookie,
    objCookie = {},
    arrCookie = cookie.split(";");
  for (let i = 0, item; item = arrCookie[i++];) {
    let cookieVal = item.split("=");
    objCookie[cookieVal[0] && cookieVal[0].trim()] = cookieVal[1];
  }
  return objCookie[name];
}


const context = {
  isApp: !!getCookie("origin"),
  isLogin: !!getCookie("token")
	/*!!(getCookie("origin")==="ios"?
	 (getCookie("platform")==="mall"&&!getCookie("token")?
	 getCookie("trc_token")
	 :
	 getCookie("token")
	 )
	 :
	 getCookie("token"))*/
};

/*const getIsLogin=(handle)=>{
 axios.request(pageApi.isLogin).then(result =>{
 if(result.data.isLogined === "true"){
 handle(true)
 return true
 }else {
 handle(false)
 return false
 }
 })
 }
 getIsLogin ((flag) => context.isLogin = flag)*/

/*(()=>{
 axios.request(pageApi.isLogin).then(result =>{
 if(result.data.isLogined === "true"){
 context.isLogin=true
 }else {
 context.isLogin=false
 }
 })
 })()*/


//页面最外层
class Application extends Component {
  static childContextTypes = {
    isApp: React.PropTypes.bool,
    isLogin: React.PropTypes.bool
  };

  getChildContext () {
    return {
      isLogin: context.isLogin,
      isApp: context.isApp
    };
  }

  //通过token取userId
  getLogin = () => {
    let token = getCookie('token');
    if (!token) {
      loadScript(COLLECTURL, sdkUse, "");
    } else {
      //判断用户是否登录
      axios.request({
        ...pageApi.uc_isLogin,
        headers: { 'Authorization': "Bearer " + token }
      }).then(({ data }) => {
        if (data.code === "200") {
          //埋点存userId
          loadScript(COLLECTURL, sdkUse, data.body.userId);
          if (data.body && data.body.avatar) {
            clearCookie('user_avatar');
            setCookie('user_avatar', JSON.stringify(data.body))
          }
        } else {
          loadScript(COLLECTURL, sdkUse, "");
        }
      }).catch(error => {
        console.error(error);
      })
    }
  };

  componentWillMount () {
    this.getLogin()
  }

  render () {
    return (
      <section id="wap-main">
        {this.props.children}
      </section>);
  }
}
//动态创建js加载
function loadScript (url, callback, userId) {
  let w = document.getElementsByClassName("collect-name")[0]; //
  if (w != undefined) { //有collect资源
    if (w.readyState) { //IE
      w.onreadystatechange = function () {
        if (w.readyState == "loaded" || script.readyState == "complete") {
          w.onreadystatechange = null;
          callback(userId);
        }
      };
    } else { //Others
      w.onload = function () {
        callback(userId);
      };
    }

  } else { //没有collect资源
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.className = "collect-name";
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
    if (script.readyState) { //IE
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback(userId);
        }
      };
    } else { //Others
      script.onload = function () {
        callback(userId);
      };
    }
  }
}
//回调函数
function sdkUse (UserId) {
  sdk.storeUserId(UserId)
};

const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(thunk)));

const rootRoute = {
  childRoutes: [
    {
      path: "/",
      component: Application,
      indexRoute: {
        onEnter: (nextState, replaceState) => replaceState("/searchResult")
      },
      childRoutes: [
				/*/!*个人中心*!/
				 {
				 path:"/personCenter",
				 getComponent( nextState, callback ){
				 require.ensure([], (require)=> {
				 callback(null,require('./member/personCenter/index').default );
				 }, "Channel");
				 }
				 },*/
        /*普通订单列表*/
        {
          path: "tradeList/:status",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              callback(null, require('./member/trade/tradeList').default);
            }, "TradeList");
          }
        },
        /*查看物流页面*/
        // {
        // 	path: "logistics",
        // 	getComponent(nextState, callback){
        // 		require.ensure([], (require) => {
        // 			require('plugin/swiper/swiper.min.js');
        // 			callback(null, require('./member/trade/logistics.jsx').default);
        // 		}, "Logistics");
        // 	}
        // },
        //物流列表页
        { path: "logistics", getComponent: require('src/route/logisticsList').default, onEnter: () => { document.title = "订单跟踪"; } },
        //物流详情页
        { path: "logisticDetail", getComponent: require('src/route/logisticDetail').default, onEnter: () => { document.title = "物流详情"; } },
        /*拼团订单列表*/
        {
          path: "myGroupList/:status",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              callback(null, require('./member/trade/myGroupList').default);
            }, "MyGroupList");

          }
        },
        /*订单详情*/
        {
          path: "/tradeDetail",
          component: require('./member/trade/tradeDetail').default
        },
        /*取消订单页*/
        {
          path: "orderCancel",
          component: require('./member/trade/orderCancel.jsx').default
        },
        /*优惠券页面*/
        {
          path: "/couponList",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              callback(null, require('./member/coupon/index').default);
            }, "CouponList");
          }
        },
        /*订单售后列表页*/
        {
          path: "/afterSale",
          component: require('./member/afterSale/index').default,
          childRoutes: [
            /*订单售后列表页*/
            {
              path: "list",
              component: require('./member/afterSale/list').default
            },
            /*订单售后申请页*/
            {
              path: "apply",
              component: require('./member/afterSale/apply').default
            },
            /*售后订单详情页*/
            {
              path: "detail",
              component: require('./member/afterSale/detail').default
            },
            /*物流公司列表页*/
            { path: "logicompany", component: require('./member/afterSale/logicompany').default, onEnter: () => { document.title = "物流公司"; } },
            /*协商记录*/
            { path: "consultrecord", component: require('./member/afterSale/consultrecord').default, onEnter: () => { document.title = "协商记录"; } }
            /*售后填写物流页*/
						/*{
							path: "logistics",
							component: require('./member/afterSale/logistics').default
						}*/
          ]
        },
        /*订单确认页*/
				/*{
				 path: "/orderConfirm",
				 component: require('./trade/orderConfirm/index').default
				 },*/
        /*零元购订单确认页*/
        {
          path: "/zeroBuyConfirm",
          component: require('./trade/orderConfirm/zeroBuy').default
        },
        /*发票选择*/
        {
          path: "/invoiceSelect",
          component: require('./member/selectList/invoice').default
        },
        /*充值中心*/
        {
          path: "/rechargeCenter",
          component: require('./member/recharge/index2').default
        },

        /*收银台页面*/
        {
          path: "/cashier",
          component: require('./trade/pay/cashier').default
        },
        /*支付成功页面*/
        {
          path: "/payResult",
          component: require('./trade/pay/payResult').default
        },
        /*商品收藏*/
        {
          path: "/collect",
          component: require('./member/collect/index').default
        },
        /*零元购频道页*/
        {
          path: "/zeroBuyChannel",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              callback(null, require('./item/zeroBuy/channel').default);
            }, "Channel");
          }
        },
        /*乐享列表页*/
        {
          path: "/zeroBuyList",
          component: require('./item/zeroBuy/list').default
        },
        /*精选页面*/
        {
          path: "/selected",
          component: require('./selected/index').default
        },
        /*会员权益*/
        {
          path: "/vipPage",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              callback(null, require("./vipPage/index").default);
            }, "VipPage");
          }
        },
        /*泰享会员服务协议*/
        {
          path: "/vipAgreement",
          component: require('./vipAgreement/index').default
        },
        /*泰享会员支付成功*/
        {
          path: "/vipPayOk", getComponent: require('src/route/vipPayOk').default, onEnter: () => {
            document.title = "泰享会员支付成功"
          }
        },
        /* 2018-11 大转盘 */
        { path: "/luckyDraw", getComponent: require('src/route/luckyDraw').default, onEnter: () => { document.title = "幸运大转盘"; } },
        /*满减活动*/
        {
          path: "/minusActivity",
          getComponent (nextState, callback) {
            require.ensure([], () => {
              require('plugin/zepto.fly.min.js');
              callback(null, require('./activity/minusActivity.jsx').default);
            }, "minusActivity")
          }
        },
        /*满折活动*/
        {
          path: "/discountActivity",
          getComponent (nextState, callback) {
            require.ensure([], () => {
              require('plugin/zepto.fly.min.js');
              callback(null, require('./activity/discountActivity').default);
            }, "discountActivity")
          }
        },
        /* n元任选 */
        {
          path: "/optionBuyActivity",
          getComponent (nextState, callback) {
            require.ensure([], () => {
              require('plugin/zepto.fly.min.js');
              callback(null, require('./activity/optionBuyActivity').default);
            }, "optionBuyActivity")
          }
        },
        /*加价换购*/
        {
          path: "/exchangeBuyActivity",
          getComponent (nextState, callback) {
            require.ensure([], () => {
              require('plugin/zepto.fly.min.js');
              callback(null, require('./activity/exchangeBuyActivity').default);
            }, "exchangeBuyActivity")
          }
        },
        /*拼团商城页*/
        {
          path: "/groupMall",
          getComponent: (nextState, callback) => {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              window.echo = require('plugin/echo.js');
              callback(null, require('./groupMall/home.jsx').default);
            }, "GroupMallHome")
          }
        },
        /*商品详情页*/
        {
          path: "item",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              require('plugin/zepto.fly.min.js');
              window.secCaptcha = require('plugin/secCaptcha.js');
              callback(null, require('./itemNew/index').default);
            }, "ItemPage");
          }
        },
        /*团购详情页*/
        {
          path: "/groupDetail",
          component: require('./item/groupDetail/groupDetail').default
        },
        /*  评团玩法 */
        {
          path: "pintuan-rules",
          component: require('./item/groupDetail/pintuanRules').default
        },
        /*购物车页面*/
				/*{
				 path:"shopCart",
				 component:require('./trade/shopCart/index').default
				 },*/
        /*搜索列表页*/
        {
          path: "search",
          component: require('./search/index').default
        },
        /*企业购搜索页*/
        {
          path: "qygSearch",
          component: require('./search/qySearch').default
        },
        /*搜索结果页*/
        {
          path: "searchResult",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              window.IScroll = window.IScroll || require('plugin/iscroll/iscroll.js');
              callback(null, require('./search/result3').default);
            }, "SearchResult");
          }
        },
        /*评价列表页*/
        {
          path: "evaluate",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              callback(null, require('./item/evaluate').default);
            }, "EvaluateList");
          }
        },
        /*评价输入页*/
        {
          path: "evaluateInput",
          component: require('./member/trade/EvaluateInput').default
        },
        /*限时特卖*/
        {
          path: "flashsale",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              window.IScroll = require('plugin/iscroll/iscroll.js');
              callback(null, require("./flashsale/index").default);
            }, "Flashsale");
          }
        },
        /*品牌特卖专场*/
        {
          path: "specialFlashSale",
          component: require('./flashsale/specialFlashsale').default
        },
        /*新人礼包页*/
        {
          path: "/newUserGift",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              callback(null, require('./newUserGift/index').default);
            }, "NewUserGift");
          }
        },
        /*企业购邀请好友*/
        {
          path: "invitation",
          component: require('./enterpriseBuy/invitation').default
        },
        /*企业购邀请好友注册*/
        {
          path: "enterprise/register",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              require('plugin/swiper/swiper.min.js');
              require('pages/enterpriseBuy/area');
              callback(null, require('./enterpriseBuy/register').default);
            }, "register");
          }
        },
        /*服务协议*/
        {
          path: "serviceContract",
          component: require('./service/service').default
        },
        /* static 通用 */
        /* 下载引导 */
        {
          path: "guide",
          component: require('./static/guide').default
        },
        {
          path: "loginTest",
          component: require('./user/loginTest').default
        },
        /* 店铺首页 */
        {
          path: "store/home",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              window.IScroll = require('plugin/iscroll/iscroll.js');
              require('plugin/swiper/swiper.min.js');
              callback(null, require("./store/home/index").default);
            }, "StoreIndex");
          }
        },
        /* 店铺详情页 */
        {
          path: "store/detail",
          component: require('./store/home/detail').default
        },
        {
          path: "store/result",
          getComponent (nextState, callback) {
            require.ensure([], (require) => {
              window.IScroll = window.IScroll || require('plugin/iscroll/iscroll.js');
              callback(null, require('./store/result/index').default);
            }, "StoreResult");
          }
        },
        /*身份证照片示例*/
        {
          path: "identityExample",
          component: require('./member/goodsReceiveInfo/identityExample').default
        },

        /*未匹配的重定向*/
				/*{
				 path:"*",
				 onEnter:( nextState,replaceState )=> replaceState( "/")
				 }*/
      ]
    }
  ]
};
render((
  <Provider store={store}>
    <Router history={browserHistory} routes={rootRoute} />
  </Provider>
), document.getElementById('app'));
