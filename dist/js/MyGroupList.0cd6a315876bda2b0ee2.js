(window.webpackJsonp=window.webpackJsonp||[]).push([[22,23],{"9F5X":function(e,t,a){"use strict";(function(e){var r=i(a("Zx67")),n=i(a("kiBT")),o=i(a("OvRC")),l=i(a("pFYg")),s=i(a("C4MV"));function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.OrderCtrl=t.MultiOrder=t.OneOrderInfo=t.OneOrder=t.OneListInfo=t.OneListInfoCtrl=t.ListInfo=t.ListNav=t.default=void 0;var u,d,c,p,f,m,v,h,y=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,s.default)(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),_=a("U7vG"),g=S(_),E=a("Zfgq"),N=(a("4n+p"),a("d2xe")),w=S(a("fw66")),k=a("NUeF"),b=a("fluX"),L=a("zpSi");function S(e){return e&&e.__esModule?e:{default:e}}function T(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function x(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==(void 0===t?"undefined":(0,l.default)(t))&&"function"!=typeof t?e:t}function D(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+(void 0===t?"undefined":(0,l.default)(t)));e.prototype=(0,o.default)(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(n.default?(0,n.default)(e,t):e.__proto__=t)}a("34C2");var C=[{text:"全部",status:0,url:"/tradeList/0"},{text:"待付款",status:1,url:"/tradeList/1"},{text:"待发货",status:2,url:"/tradeList/2"},{text:"待收货",status:3,url:"/tradeList/3"},{text:"待评价",status:4,url:"/tradeList/4"}],O=["all","pay","send","receive","evaluate"],M={init:{url:"/originapi/user/orders",type:"get"},del:{url:"/originapi/user/order/remove",type:"get"},conf:{url:"/originapi/user/order/confirm",type:"get"},cashier:{url:"/originapi/payment/prepare",type:"post"}},I={},j=(d=u=function(t){function a(e){T(this,a);var t=x(this,(a.__proto__||(0,r.default)(a)).call(this,e));document.title="我的订单",window.location.href="jsbridge://set_title?title=我的订单";return t}return D(a,_.Component),y(a,[{key:"componentDidMount",value:function(){var t=this,a=this.context.store,r=this.props.params.status,n=e(".trade-list-nav .nav-list"),o=new Swiper(this.refs.list,{initialSlide:r,autoHeight:!0,onSlideChangeStart:function(e){t.context.router.replace(C[e.activeIndex].url);var r={type:"TRADE_LIST",listNum:e.activeIndex};a.dispatch(r)},onTouchStart:function(e,t){0==e.activeIndex?e.lockSwipeToPrev():e.unlockSwipeToPrev(),e.activeIndex==e.slides.length-1?e.lockSwipeToNext():e.unlockSwipeToNext()}});if(0==o.activeIndex){a.dispatch({type:"TRADE_LIST",listNum:0})}I=o,n.each(function(t,a){e(a).on("click",function(e){o.slideTo(t,300,!0)})})}},{key:"componentWillUnmount",value:function(){var e=document.querySelector("#modal");e&&e.parentNode&&e.parentNode.removeChild(e);var t=document.querySelector("#msgTip");t&&t.parentNode&&t.parentNode.removeChild(t)}},{key:"render",value:function(){return g.default.createElement("div",{"data-plugin":"swiper","data-page":"trade-list",style:{height:e(window).height(),overflow:"hidden"}},g.default.createElement("section",{id:"tradeList",ref:"list",className:"swiper-container trade-list"},g.default.createElement(P,{data:C,status:this.props.params.status}),g.default.createElement(A,{listLength:"5",status:this.props.params.status})))}}]),a}(),u.contextTypes={store:g.default.PropTypes.object,router:g.default.PropTypes.object},d);t.default=j;var P=t.ListNav=(p=c=function(e){function t(){return T(this,t),x(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return D(t,_.Component),y(t,[{key:"render",value:function(){var e=this.props,t=e.data,a=(e.status,this),r=t.map(function(e,t){return g.default.createElement(E.Link,{to:e.url,className:"nav-list",key:t,activeClassName:"active",onClick:function(t){t.preventDefault(),a.context.router.replace(e.url)}},g.default.createElement("span",null,e.text))});return g.default.createElement("nav",{className:"trade-list-nav",id:"trade-list-nav"},r)}}]),t}(),c.contextTypes={store:g.default.PropTypes.object,router:g.default.PropTypes.object},p),A=t.ListInfo=(m=f=function(e){function t(e){T(this,t);var a=x(this,(t.__proto__||(0,r.default)(t)).call(this,e));return a.state={},a}return D(t,_.Component),y(t,[{key:"render",value:function(){for(var e=[],t=this.props.listLength,a=0;a<t;a++)e.push(g.default.createElement(R,{status:O[a],key:a}));return g.default.createElement("div",{className:"swiper-wrapper list-main"},e)}}]),t}(),f.contextTypes={store:g.default.PropTypes.object},m),R=t.OneListInfoCtrl=(h=v=function(t){function a(e){T(this,a);var t=x(this,(a.__proto__||(0,r.default)(a)).call(this,e));return t.delOrderHandle=function(e){for(var a,r=t.state.dataList,n=0;a=r[n];n++)a.id==e&&r.splice(n,1);t.setState({dataList:r})},t.loadDownHandle=function(e){var a=t;if(t.sendData.page>=t.totalPage)return e.lock(),e.noData(),void e.resetload();t.sendData.page++,(0,b.ownAjax)(M.init,a.sendData).then(function(r){var n=t.state.dataList;n=n.concat(r.trades),a.setState({dataList:n}),e.resetload()}).catch(function(t){e.resetload()})},t.updateSwiper=function(){I.update()},t.init=!0,t.totalPage=1e4,t.sendData={status:t.props.status,pageNum:10,page:1},t.state={dataList:[],update:!1,refresh:!1},t}return D(a,_.Component),y(a,[{key:"componentDidMount",value:function(){var e=this,t=e.props.status,a=e.context.store;this.unSubscribe=a.subscribe(function(){var r=a.getState().initial;"TRADE_LIST"==r.type&&O[r.listNum]==t&&(e.sendData.page=1,e.setState({update:!1}),(0,b.ownAjax)(M.init,e.sendData).then(function(t){e.sendData.page=t.pagers.current,e.totalPage=t.pagers.total,e.setState({dataList:t.trades,update:!0})}))})}},{key:"componentDidUpdate",value:function(){I.update(),this.state.refresh||this.setState({refresh:!0})}},{key:"componentWillUnmount",value:function(){this.unSubscribe()}},{key:"render",value:function(){var t=this.state,a=t.update,r=t.dataList;return g.default.createElement("div",{className:"swiper-slide",ref:"oneList",style:{overflow:"auto",height:document.body.clientHeight-40}},a?r&&r.length?g.default.createElement(F,{data:r,dropDown:this.loadDownHandle,scrollArea:e(this.refs.oneList),didMount:this.updateSwiper,onDelete:this.delOrderHandle}):g.default.createElement(N.NoMoreOrder,null):g.default.createElement(N.LoadingRound,null))}}]),a}(),v.contextTypes={store:g.default.PropTypes.object},h),U=t.OneListInfo=function(e){function t(){return T(this,t),x(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return D(t,_.Component),y(t,[{key:"render",value:function(){var e=this,t=this.props.data.map(function(t,a){var r=!0;return"待发货"==k.orderStatusMap[t.status]&&(r=!1),1==t.good_orders.length?g.default.createElement(G,{key:a,data:t,showCtrl:r,onDelete:e.props.onDelete}):g.default.createElement(q,{key:a,data:t,showCtrl:r,onDelete:e.props.onDelete})});return g.default.createElement("div",{className:"list-data"},t)}}]),t}(),F=(0,L.DropDownLoad)(U),G=t.OneOrder=function(e){function t(){return T(this,t),x(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return D(t,_.Component),y(t,[{key:"render",value:function(){var e=this.props.data;return g.default.createElement("li",{className:"one-order"},g.default.createElement(H,{data:e}),this.props.showCtrl&&g.default.createElement(Y,{type:e.type,buyType:e.pay_type,data:e,onDelete:this.props.onDelete,groupStatus:e.group_buy_status,status:e.status,tid:e.id,virtual:e.is_virtual,platform:e.platform}))}}]),t}(),H=t.OneOrderInfo=function(e){function t(){return T(this,t),x(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return D(t,_.Component),y(t,[{key:"render",value:function(){var e=this.props.data,t=e.good_orders[0],a=k.orderStatusMap[e.status];return 3==e.type&&("IN_PROCESS"===e.group_buy_status&&(a="拼团中"),"FAILED"===e.group_buy_status&&"已关闭"!==a&&(a="拼团失败")),g.default.createElement("div",{className:"order-info"},g.default.createElement("div",{className:"list-body"},g.default.createElement("div",{className:"list-img"},g.default.createElement(E.Link,{to:"/tradeDetail?tid="+e.id},g.default.createElement("img",{src:t.pic_path}))),g.default.createElement("div",{className:"list-body-ctt"},g.default.createElement("div",{className:"order-info-detail"},g.default.createElement("div",{className:"order-info-top"},g.default.createElement(E.Link,{to:"/tradeDetail?tid="+e.id,className:"order-info-title"},t.title),g.default.createElement("div",{className:"order-info-type"},t.spec_nature_info)),g.default.createElement("div",{className:"order-status-wrap"},g.default.createElement("div",{className:"cancel-status"},k.cancelOrderMap[e.cancel_status]),g.default.createElement("div",{className:"order-status"},a))),g.default.createElement("div",{className:"order-total"},g.default.createElement("span",{className:"order-number"},"共",e.item_num,"件商品"),"  实付款：",g.default.createElement("span",{className:"order-total-pay"},(+e.payment).toFixed(2))))))}}]),t}(),q=t.MultiOrder=function(e){function t(){return T(this,t),x(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return D(t,_.Component),y(t,[{key:"render",value:function(){var e=this.props.data;return g.default.createElement("li",{className:"multi-order"},g.default.createElement(z,{data:e}),this.props.showCtrl&&g.default.createElement(Y,{type:e.type,buyType:e.pay_type,data:e,onDelete:this.props.onDelete,status:e.status,tid:e.id,virtual:e.is_virtual,platform:e.platform}))}}]),t}(),z=function(e){function t(){return T(this,t),x(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return D(t,_.Component),y(t,[{key:"componentDidMount",value:function(){new Swiper(this.refs.list,{slidesPerView:"auto",freeMode:!0})}},{key:"render",value:function(){var e=this.props.data;return g.default.createElement("div",{className:"order-info"},g.default.createElement("div",{className:"list-body"},g.default.createElement("div",{className:"body-top c-tr"},g.default.createElement("span",{className:"c-clblue c-mr5"},k.cancelOrderMap[e.cancel_status]),g.default.createElement("span",{className:"c-cf55"},k.orderStatusMap[e.status])),g.default.createElement("div",{className:"body-middle swiper-container",ref:"list"},g.default.createElement(E.Link,{to:"/tradeDetail?tid="+e.id,className:"swiper-wrapper"},e.good_orders&&e.good_orders.map(function(e,t){return g.default.createElement("img",{key:t,src:e.pic_path,className:"swiper-slide"})}))),g.default.createElement("div",{className:"body-btm c-tr"},"共",e.item_num,"件商品  实付款：¥",(+e.payment).toFixed(2))))}}]),t}(),B=!1,Y=t.OrderCtrl=function(t){function a(){var t,n,o;T(this,a);for(var l=arguments.length,s=Array(l),i=0;i<l;i++)s[i]=arguments[i];return n=o=x(this,(t=a.__proto__||(0,r.default)(a)).call.apply(t,[this].concat(s))),o.showModal=function(){var t=o,a=o.props.tid;w.default.Modal({isOpen:!0,msg:"是否要删除订单？"},function(){B||(B=!0,e.ajax({url:M.del.url,type:M.del.type,data:{tid:a},success:function(e){B=!1,w.default.MsgTip({msg:e.msg}),e.status&&window.setTimeout(function(){t.props.onDelete(a)},2e3)},error:function(e){B=!1,w.default.MsgTip({msg:"网络错误，删除失败"})}}))})},o.confirmRece=function(){var t=o.props.tid;w.default.Modal({isOpen:!0,msg:"是否要确认收货？"},function(){B||(B=!0,e.ajax({url:M.conf.url,type:M.conf.type,data:{tid:t},success:function(e){B=!1,w.default.MsgTip({msg:e.msg}),e.status&&window.setTimeout(function(){I.slideTo(4,300,!0)},1e3)},error:function(e){B=!1,w.default.MsgTip({msg:"网络错误，删除失败"})}}))})},o.showAfterSale=function(){var e=o.props,t=e.data,a=e.type,r=e.virtual,n=e.groupStatus,l=e.status;l=k.orderStatusMap[l];var s=1!=a&&!r&&("SUCCESS"!==n||"待评价"===k.orderStatusMap[l]||"已完成"===k.orderStatusMap[l])&&!t.is_time_out&&t.good_orders.some(function(e,t){return!e.after_sales_num||e.after_sales_num<=2});return Boolean(s)},x(o,n)}return D(a,_.Component),y(a,[{key:"render",value:function(){var e=this.props,t=e.status,a=e.tid,r=e.virtual,n=e.type,o=e.buyType,l="tairango"!==e.platform,s="";switch(t=k.orderStatusMap[t]){case"待付款":s=[1!==n&&g.default.createElement("a",{className:"ctrl-block cancel-order",key:"1",href:"/orderCancel?tid="+a},"取消订单"),g.default.createElement("a",{className:"ctrl-red pay-order",key:"3",href:"/cashier?oid="+a+"&from=list"+(1==n?"&zeroBuy=1":"")},"offline"===o?"线下支付":"立即支付")];break;case"待收货":s=[l&&this.showAfterSale()&&g.default.createElement(E.Link,{className:"ctrl-block",key:"1",to:"/tradeDetail?tid="+a},"申请售后"),l&&!r&&g.default.createElement(E.Link,{className:"ctrl-red pay-order",key:"2",to:"/logistics?tid="+a},"查看物流"),g.default.createElement("a",{className:"ctrl-red pay-order",key:"3",onTouchTap:this.confirmRece,href:"javascript:;"},"确认收货")];break;case"待评价":s=[l&&this.showAfterSale()&&g.default.createElement(E.Link,{className:"ctrl-block",key:"1",to:"/tradeDetail?tid="+a},"申请售后"),l&&!r&&g.default.createElement(E.Link,{className:"ctrl-red pay-order",key:"2",to:"/logistics?tid="+a},"查看物流"),g.default.createElement(E.Link,{className:"ctrl-red pay-order",key:"3",to:"/evaluateInput?tid="+a},"评价晒单")];break;case"已完成":s=[l&&this.showAfterSale()&&g.default.createElement(E.Link,{className:"ctrl-block",key:"1",to:"/tradeDetail?tid="+a},"申请售后"),l&&!r&&g.default.createElement(E.Link,{className:"ctrl-red pay-order",key:"2",to:"/logistics?tid="+a},"查看物流"),g.default.createElement("a",{className:"ctrl-block",key:"3",onTouchTap:this.showModal},"删除订单")];break;case"已关闭":s=g.default.createElement("a",{className:"ctrl-block",onTouchTap:this.showModal},"删除订单");break;case"拼团中":s=[g.default.createElement("a",{className:"ctrl-red cancel-order",key:"1",href:"javascript:;"},"邀请好友参团")]}return g.default.createElement("div",{className:"order-ctrl c-tr"},s)}}]),a}()}).call(this,a("OOjC"))},DR8t:function(e,t,a){"use strict";(function(e){var r=u(a("Zx67")),n=u(a("kiBT")),o=u(a("OvRC")),l=u(a("pFYg")),s=u(a("C4MV")),i=u(a("woOf"));function u(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.OneGroupList=t.OneListInfo=t.OneListInfoCtrl=t.ListInfo=t.default=void 0;var d,c,p,f,m,v,h=i.default||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},y=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,s.default)(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),_=a("U7vG"),g=T(_),E=a("Zfgq"),N=(a("4n+p"),a("d2xe")),w=a("9F5X"),k=a("zpSi"),b=a("NUeF"),L=T(a("qAHI")),S=a("2uFj");function T(e){return e&&e.__esModule?e:{default:e}}function x(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function D(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==(void 0===t?"undefined":(0,l.default)(t))&&"function"!=typeof t?e:t}function C(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+(void 0===t?"undefined":(0,l.default)(t)));e.prototype=(0,o.default)(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(n.default?(0,n.default)(e,t):e.__proto__=t)}a("34C2");var O={initgroup:{url:S.MALLAPI+"/promotion/myGroupBuy",method:"get"}},M=[{text:"全部",status:0,url:"/myGroupList/0"},{text:"拼团中",status:1,url:"/myGroupList/1"},{text:"拼团成功",status:2,url:"/myGroupList/2"},{text:"拼团失败",status:3,url:"/myGroupList/3"}],I=[4,1,2,0],j={},P=(c=d=function(t){function a(e){x(this,a);var t=D(this,(a.__proto__||(0,r.default)(a)).call(this,e));return t.state={status:t.props.params.status},t}return C(a,_.Component),y(a,[{key:"componentDidMount",value:function(){var t=this,a=this.context.store;e(t.refs.list).css({minHeight:e(window).height()});var r=this.props.params.status,n=e(".trade-list-nav .nav-list"),o=new Swiper("#group-list",{initialSlide:r,autoHeight:!0,onSlideChangeStart:function(e){t.context.router.replace(M[e.activeIndex].url);var r={type:"MY_GROUP_LIST",listNum:I[e.activeIndex]};a.dispatch(r)},onTouchStart:function(e,t){0==e.activeIndex?e.lockSwipeToPrev():e.unlockSwipeToPrev(),e.activeIndex>=e.slides.length-1?e.lockSwipeToNext():e.unlockSwipeToNext()}});if(0==o.activeIndex){var l={type:"MY_GROUP_LIST",listNum:I[0]};a.dispatch(l)}j=o,n.each(function(t,a){e(a).on("click",function(e){o.slideTo(t,300,!0)})})}},{key:"render",value:function(){return g.default.createElement("div",{"data-plugin":"swiper","data-page":"trade-list my-group-list"},g.default.createElement("section",{className:"trade-list swiper-container",ref:"list",id:"group-list"},g.default.createElement(w.ListNav,{data:M,status:this.props.params.status}),g.default.createElement(A,{listLength:"4",status:this.props.params.status})))}}]),a}(),d.contextTypes={store:g.default.PropTypes.object,router:g.default.PropTypes.object},c);t.default=P;var A=t.ListInfo=(f=p=function(e){function t(e){x(this,t);var a=D(this,(t.__proto__||(0,r.default)(t)).call(this,e));return a.state={},a}return C(t,_.Component),y(t,[{key:"render",value:function(){for(var e=[],t=this.props.listLength,a=0;a<t;a++)e.push(g.default.createElement(R,{status:a,key:a}));return g.default.createElement("div",{className:"swiper-wrapper list-main"},e)}}]),t}(),p.contextTypes={store:g.default.PropTypes.object},f),R=t.OneListInfoCtrl=(v=m=function(t){function a(){var e,t,n;x(this,a);for(var o=arguments.length,l=Array(o),s=0;s<o;s++)l[s]=arguments[s];return t=n=D(this,(e=a.__proto__||(0,r.default)(a)).call.apply(e,[this].concat(l))),n.loadDownHandle=function(e){var t=n,a=t.props.status;if(n.count<10)return e.lock(),e.noData(),void e.resetload();n.pages++,L.default.request(h({},O.initgroup,{params:{group_status:I[a],page:n.pages,page_size:10}})).then(function(a){if(0===a.data.code){var r=t.state.dataList;r=r.concat(a.data.data.group.data),t.total=a.data.data.group.total_count,t.count=a.data.data.group.count,t.setState({dataList:r,update:!0}),e.resetload()}}).catch(function(t){console.log(t),e.resetload()})},D(n,t)}return C(a,_.Component),y(a,[{key:"componentWillMount",value:function(){document.title="我的拼团",location.href="jsbridge://set_title?title=我的拼团",this.count=10,this.total=100,this.state={dataList:[],update:!1}}},{key:"componentDidMount",value:function(){var e=this,t=e.props.status,a=e.context.store,r=a.subscribe(function(){var r=a.getState().initial;"MY_GROUP_LIST"==r.type&&r.listNum==I[t]&&(e.pages=1,e.setState({update:!1}),L.default.request(h({},O.initgroup,{params:{group_status:I[t],page:e.pages,page_size:10}})).then(function(t){if(0===t.data.code){var a=t.data.data.group.data;e.total=t.data.data.group.total_count,e.count=t.data.data.group.count,e.setState({dataList:a,update:!0})}}).catch(function(e){console.log(e)}))});e.setState({unSubscribe:r})}},{key:"componentDidUpdate",value:function(){j.update()}},{key:"componentWillUnmount",value:function(){this.state.unSubscribe()}},{key:"render",value:function(){var t=this.state,a=t.update,r=t.dataList;return g.default.createElement("div",{className:"swiper-slide list-container",ref:"pageTop",style:{overflow:"scroll",height:document.body.clientHeight-40}},a?r&&r.length?g.default.createElement(G,{dataList:r,update:a,dropDown:this.loadDownHandle,scrollArea:e(this.refs.pageTop)}):g.default.createElement(N.NoMoreOrder,null):g.default.createElement(N.LoadingRound,null))}}]),a}(),m.contextTypes={store:g.default.PropTypes.object},v),U=t.OneListInfo=function(e){function t(){return x(this,t),D(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return C(t,_.Component),y(t,[{key:"render",value:function(){var e=this.props.dataList;return e=this.props.update?e instanceof Array?e.map(function(e,t){return g.default.createElement(F,{data:e,key:t})}):g.default.createElement(N.NoMoreOrder,null):g.default.createElement(N.LoadingRound,null),g.default.createElement("div",{className:"list-data"},e)}}]),t}(),F=t.OneGroupList=function(e){function t(){return x(this,t),D(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return C(t,_.Component),y(t,[{key:"getContext",value:function(){var e=this.props.data,t=e.order_shop_no,a=e.object_id,r=e.pic_path,n=e.title,o=e.spec_nature_info,l=e.group_status,s=e.payment,i=e.required_person;return g.default.createElement("div",null,2==l||0==l?g.default.createElement("div",{className:"list-body"},g.default.createElement("div",{className:"list-img"},g.default.createElement(E.Link,{to:"/tradeDetail?tid="+t+"&orderflag=2"},g.default.createElement("img",{src:r}))),g.default.createElement("div",{className:"list-body-ctt"},g.default.createElement("div",{className:"order-info-detail"},g.default.createElement("div",{className:"order-info-top"},g.default.createElement(E.Link,{className:"order-info-title",to:"/groupDetail?object_id="+a},n),g.default.createElement("div",{className:"order-info-type"},o)),g.default.createElement("div",{className:"order-status-wrap"},2==l||0==l?g.default.createElement("div",{className:"order-status"},b.groupStatus[l]):null)),g.default.createElement("div",{className:"order-total"},"实付款：",g.default.createElement("span",{className:"order-total-pay"},"￥",(+s).toFixed(2))))):g.default.createElement("div",null,g.default.createElement("div",{className:"list-body"},g.default.createElement("div",{className:"list-img"},g.default.createElement(E.Link,{to:"/tradeDetail?tid="+t+"&orderflag=2"},g.default.createElement("img",{src:r}))),g.default.createElement("div",{className:"list-body-ctt"},g.default.createElement("div",{className:"order-info-detail"},g.default.createElement("div",{className:"order-info-top"},g.default.createElement(E.Link,{className:"order-info-title",to:"/groupDetail?object_id="+a},n),g.default.createElement("div",{className:"order-info-type"},o)),g.default.createElement("div",{className:"order-status-wrap"},g.default.createElement("div",{className:"order-status"},b.groupStatus[l]),g.default.createElement("div",{className:"order-person",style:{marginTop:"5px"}},"差",i,"人"))),g.default.createElement("div",{className:"order-total"},"实付款：",g.default.createElement("span",{className:"order-total-pay"},"￥",(+s).toFixed(2))))),g.default.createElement("div",null,g.default.createElement("div",{className:"order-status",style:{visibility:"hidden"}},b.groupStatus[l]),g.default.createElement("div",{className:"order-person",style:{marginTop:"5px",visibility:"hidden"}},"差",i,"人"),g.default.createElement("div",{className:"order-ctrl order-alt c-tr"},g.default.createElement(E.Link,{className:"ctrl-red cancel-order",key:"1",to:"/groupDetail?object_id="+a},"邀请好友参团")))))}},{key:"render",value:function(){var e=this.getContext();return g.default.createElement("div",null,g.default.createElement("li",{className:"one-order"},g.default.createElement("div",{className:"order-info"},e)))}}]),t}(),G=(0,k.DropDownLoad)(U)}).call(this,a("OOjC"))}}]);