(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{MsUy:function(t,e,n){"use strict";(function(t){var a=p(n("Zx67")),o=p(n("kiBT")),i=p(n("OvRC")),r=p(n("pFYg")),l=p(n("C4MV")),s=p(n("woOf"));function p(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.TotopAndCart=void 0;var u,c,m=s.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},d=function(){function t(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),(0,l.default)(t,a.key,a)}}return function(e,n,a){return n&&t(e.prototype,n),a&&t(e,a),e}}(),f=n("U7vG"),h=k(f),g=n("d2xe"),v=n("4n+p"),w=(n("Zfgq"),n("f2Hk")),y=n("qeJi"),_=n("fw66"),C=n("zpSi"),E=n("JmOZ"),b=k(n("6YRh")),x=k(n("mtWM")),M=n("2uFj");function k(t){return t&&t.__esModule?t:{default:t}}function D(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function N(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==(void 0===e?"undefined":(0,r.default)(e))&&"function"!=typeof e?t:e}function I(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+(void 0===e?"undefined":(0,r.default)(e)));t.prototype=(0,i.default)(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(o.default?(0,o.default)(t,e):t.__proto__=e)}n("tBlX");var T={minus:{url:"/newapi/promotion/fullMinus/item",method:"get"},rule:{url:"/newapi/promotion/rule",method:"get"},shop:{url:"/newapi/promotion/fullMinus/cart",method:"get"},addCart:{url:"/originapi/cart-add.html",method:"post"},channelItem:{url:"/newapi/itemNew/promotion",method:"get"},getCartCount:{url:"/newapi/h5/cart/count",method:"get"},itemData:{url:"/newapi/itemNew/detail",method:"get"}},A=(0,w.concatPageAndType)("minusActivity"),P=(0,w.actionAxios)("minusActivity"),L=(0,w.actionAxiosAll)("minusActivity"),B=h.default.createElement(g.EmptyPageLink,{config:{bgImgUrl:"/src/img/activity/item-none-page.png",msg:"暂时没有活动商品",btnText:"返回",btnClick:function(){location.href="jsbridge://goBack"}}}),j=(h.default.createElement(g.EmptyPageLink,{config:{bgImgUrl:"/src/img/activity/activity-end-page.png",msg:"该活动已结束",btnText:"返回",btnClick:function(){location.href="jsbridge://goBack"}}}),c=u=function(e){function n(e,o){D(this,n);var i=N(this,(n.__proto__||(0,a.default)(n)).call(this,e));return i.dropDown=function(t){var e=i.props,n=e.list,a=e.promotionId,o=e.dispatch;if(n.page>=n.total)return t.lock(),t.noData(),void t.resetload();x.default.request(m({},T.minus,{params:{promotion_id:a,page:n.page+1}})).then(function(e){if(!e.data.status)return o(A("promptCtrl",{prompt:{show:!0,msg:e.data.msg}})),void t.resetload();o(A("concatDataSuccess",{result:e.data})),t.resetload()})},document.title="满减专场",o.isApp&&(location.href="jsbridge://set_title?title=满减专场"),i.reload=t('<meta name="reload-enbaled" content="false" />'),t("head").append(i.reload),i}return I(n,f.Component),d(n,[{key:"componentWillMount",value:function(){this.props.resetData(),this.props.getData(),this.context.isLogin&&this.props.getCartInfo()}},{key:"componentDidMount",value:function(){b.default.init({offset:0,throttle:0})}},{key:"componentDidUpdate",value:function(){b.default.init({offset:0,throttle:0})}},{key:"componentWillUnmount",value:function(){this.reload.remove()}},{key:"render",value:function(){return this.props.load?h.default.createElement(g.LoadingRound,null):this.props.list.data?h.default.createElement("div",{"data-page":"promotion-activity",style:{minHeight:t(window).height(),background:"#f4f4f4"}},h.default.createElement(O,{rules:this.props.rule,cart:this.props.cart}),h.default.createElement(q,{scrollArea:window,dropDown:this.dropDown,data:this.props.list.data,itemData:this.props.itemData,getChannelItem:this.props.getChannelItem,isApp:this.context.isApp,isLogin:this.context.isLogin}),h.default.createElement(_.PopupTip,{active:this.props.prompt.show,msg:this.props.prompt.msg,onClose:this.props.promptClose}),h.default.createElement(_.PopupTipBig,{active:this.props.promptBig.show,msg:this.props.promptBig.msg,onClose:this.props.promptBigClose}),this.props.modalCtrl.show?h.default.createElement(E.BuyModal,m({},this.props,{buyModal:this.props.modalCtrl.show,isNonPayment:this.props.isNonPayment,closeModal:this.props.closeModal})):null,this.props.modalLoading&&h.default.createElement(g.TransShady,null),h.default.createElement(U,{data:this.props.countCart})):B}}]),n}(),u.contextTypes={isApp:h.default.PropTypes.bool,isLogin:h.default.PropTypes.bool},c),O=function(t){function e(){return D(this,e),N(this,(e.__proto__||(0,a.default)(e)).apply(this,arguments))}return I(e,f.Component),d(e,[{key:"parseRule",value:function(){var t=JSON.parse(this.props.rules.rules),e=t.rule.map(function(t,e){return t.limit_money+"元减"+t.deduct_money+"元"}).join("，");return t.no_capped&&(e+="，上不封顶"),e}},{key:"render",value:function(){return h.default.createElement("div",{className:"page-head"},h.default.createElement("div",{className:"main-text"},"以下商品满",this.parseRule()),this.props.cart&&h.default.createElement("div",{className:"next-text"}," ",this.props.cart.display_text," "))}}]),e}(),R=function(e){function n(){return D(this,n),N(this,(n.__proto__||(0,a.default)(n)).apply(this,arguments))}return I(n,f.Component),d(n,[{key:"componentDidMount",value:function(){t(".page-main").css({minHeight:t(window).height()-95})}},{key:"getHtml",value:function(){var t=this;return this.props.data.map(function(e,n){return h.default.createElement(S,{key:n,data:e,getChannelItem:t.props.getChannelItem,id:e.item_id,itemData:t.props.itemData,isApp:t.props.isApp,isLogin:t.props.isLogin})})}},{key:"render",value:function(){return h.default.createElement("div",{className:"page-main c-clrfix"},this.getHtml())}}]),n}(),q=(0,C.DropDownLoad)(R),S=function(t){function e(){return D(this,e),N(this,(e.__proto__||(0,a.default)(e)).apply(this,arguments))}return I(e,f.Component),d(e,[{key:"itemCtrl",value:function(t,e){this.props.isLogin?this.props.getChannelItem():location.href="trmall://to_login"}},{key:"render",value:function(){var t=this.props,e=t.data,n=t.itemData;return h.default.createElement("div",{className:"one-item-grid c-pr"},e.tags&&e.tags.H5_pic?h.default.createElement("img",{className:"act-tag",src:e.tags.H5_pic}):e.is_new?h.default.createElement("span",{className:"new-tag"},"新品"):"",h.default.createElement("a",{className:"one-item",href:(0,y.newWindow)(this.props.isApp?"app":"pc",M.RNDomain+"/item?item_id="+e.item_id)},h.default.createElement("div",{className:"item-img"},h.default.createElement("img",{"data-echo":e.primary_image?e.primary_image+"_m.jpg":"/src/img/search/no-goods-image.png",src:"/src/img/icon/loading/default-watermark.png"}),e.store<=0&&h.default.createElement("div",{className:"float-label"},h.default.createElement("img",{src:"/src/img/search/sold-out-activity.png"})),h.default.createElement("div",{className:"item-label"},e.promotion_tag.join("|")))),h.default.createElement("div",{className:"item-info"},h.default.createElement("a",{className:"one-item",href:(0,y.newWindow)(this.props.isApp?"app":"pc",M.RNDomain+"/item?item_id="+e.item_id)},h.default.createElement("div",{className:"item-title"},e.title)),h.default.createElement("div",{className:"item-price"},h.default.createElement("span",{className:"price"},"¥",e.price)," ",!!e.market_price&&h.default.createElement("del",null,"¥",e.market_price," "))),h.default.createElement("div",{className:"item-ctrl c-pa",onClick:this.itemCtrl.bind(this,e.item_id,n)}))}}]),e}(),U=e.TotopAndCart=function(e){function n(){return D(this,n),N(this,(n.__proto__||(0,a.default)(n)).apply(this,arguments))}return I(n,f.Component),d(n,[{key:"componentWillUnmount",value:function(){t(window).unbind("scroll.top")}},{key:"componentDidMount",value:function(){var e=t(window),n=(e.height(),t(".toTop")),a=void 0;n.on("click",function(){clearInterval(a);var t=e.scrollTop();a=setInterval(function(){t-=10,e.scrollTop(t),t<=0&&clearInterval(a)},1)}),t(window).bind("scroll.top",function(){var e=t(this).scrollTop(),a=t(window).scrollTop()-t(".banner").height();e>35?n.show():n.hide(),a>=0?t(".nav1").css({top:0}):t(".nav1").css({top:-a})})}},{key:"render",value:function(){var t=this.props.data;return h.default.createElement("div",{className:"cart-toTop"},h.default.createElement("ul",null,h.default.createElement("a",{href:"trmall://shoppingbag"},h.default.createElement("li",{className:"cart"},t?h.default.createElement("span",{className:"cart-count"},t):"")),h.default.createElement("li",{className:"toTop"})))}}]),n}();e.default=(0,v.connect)(function(t){return m({},t.minusActivity)},function(t,e){var n=e.location.query,a=n.promotion_id,o=n.shop_id,i=function(){t(P("getShop",m({},T.shop,{params:{promotion_id:a,shop_id:o}})))};return{dispatch:t,resetData:function(){t(A("resetData",{query:{promotionId:a,shopId:o}}))},getData:function(){t(L("getData",[m({},T.minus,{params:{promotion_id:a,page:1}}),m({},T.rule,{params:{promotion_id:a,promotion_type:"fullminus"}})])),t(P("getCartCount",m({},T.getCartCount)))},getCartInfo:i,promptClose:function(){t(A("promptCtrl",{prompt:{show:!1,msg:""}}))},promptBigClose:function(){t(A("promptBigCtrl",{prompt:{show:!1,msg:""}}))},closeModal:function(){t(A("modalCtrl",{show:!1}))},getChannelItem:function(){var e=this.id,n=this.itemData;n[e]?t(A("modalCtrl",{show:!0,activeItemData:n[e]})):t(L("getChannelItem",[m({},T.channelItem,{params:{item_id:e}}),m({},T.itemData,{params:{item_id:e}})]))},InitState:function(e){t(A("initState",{ret:e}))},UpdateCartInfo:function(e){t(A("updateCartInfo",e)),i()}}})(j)}).call(this,n("OOjC"))},"t/Wd":function(t,e,n){"use strict";
/*! fly - v1.0.0 - 2014-12-22
* https://github.com/amibug/fly
* Copyright (c) 2014 wuyuedong; Licensed MIT */var a;(a=Zepto).fly=function(t,e){var n={version:"1.0.0",autoPlay:!0,vertex_Rtop:20,speed:1.2,start:{},end:{},onEnd:a.noop},o=this,i=a(t);o.init=function(t){this.setOptions(t),this.settings.autoPlay&&this.play()},o.setOptions=function(t){this.settings=a.extend(!0,{},n,t);var e=this.settings,o=e.start,r=e.end;i.css({marginTop:"0px",marginLeft:"0px",position:"fixed"}).appendTo("body"),null!=r.width&&null!=r.height&&a.extend(!0,o,{width:i.width(),height:i.height()});var l=Math.min(o.top,r.top)-Math.abs(o.left-r.left)/3;l<e.vertex_Rtop&&(l=Math.min(e.vertex_Rtop,Math.min(o.top,r.top)));var s=Math.sqrt(Math.pow(o.top-r.top,2)+Math.pow(o.left-r.left,2)),p=Math.ceil(Math.min(Math.max(Math.log(s)/.05-75,30),100)/e.speed),u=o.top==l?0:-Math.sqrt((r.top-l)/(o.top-l)),c=(u*o.left-r.left)/(u-1),m=r.left==c?0:(r.top-l)/Math.pow(r.left-c,2);a.extend(!0,e,{count:-1,steps:p,vertex_left:c,vertex_top:l,curvature:m})},o.play=function(){this.move()},o.move=function(){var t=this.settings,e=t.start,n=t.count,o=t.steps,r=t.end,l=e.left+(r.left-e.left)*n/o,s=0==t.curvature?e.top+(r.top-e.top)*n/o:t.curvature*Math.pow(l-t.vertex_left,2)+t.vertex_top;if(null!=r.width&&null!=r.height){var p=o/2,u=r.width-(r.width-e.width)*Math.cos(p>n?0:(n-p)/(o-p)*Math.PI/2),c=r.height-(r.height-e.height)*Math.cos(p>n?0:(n-p)/(o-p)*Math.PI/2);i.css({width:u+"px",height:c+"px","font-size":Math.min(u,c)+"px"})}i.css({left:l+"px",top:s+"px"}),t.count++;var m=window.requestAnimationFrame(a.proxy(this.move,this));n==o&&(window.cancelAnimationFrame(m),t.onEnd.apply(this))},o.destory=function(){i.remove()},o.init(e)},a.fn.fly=function(t){return this.each(function(){void 0==a(this).data("fly")&&a(this).data("fly",new a.fly(this,t))})}},tBlX:function(t,e,n){}}]);