(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{WLsX:function(e,t,a){},i5Jf:function(e,t,a){"use strict";(function(e){var n=p(a("fZjL")),i=p(a("//Fk")),r=p(a("Zx67")),l=p(a("kiBT")),s=p(a("OvRC")),o=p(a("pFYg")),c=p(a("c/Tr")),u=p(a("C4MV"));function p(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var d,f,m,h,v=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,u.default)(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),_=a("U7vG"),y=k(_),g=(k(a("O27J")),a("Zfgq"));a("WLsX");var w=a("rsfq"),E=a("d2xe");function k(e){return e&&e.__esModule?e:{default:e}}function N(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}return(0,c.default)(e)}function b(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function T(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==(void 0===t?"undefined":(0,o.default)(t))&&"function"!=typeof t?e:t}function C(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+(void 0===t?"undefined":(0,o.default)(t)));e.prototype=(0,s.default)(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(l.default?(0,l.default)(e,t):e.__proto__=t)}var x=(0,w.createAction)({flashSale:{url:"/newapi/promotion/flash_sale",type:"get"},banner:{url:"/newapi/promotion/flash_sale/banner",type:"get"},itemList:{url:"/newapi/promotion/flash_sale/item",type:"get"},DelFav:{url:"/newapi/user/collection/remove",type:"get"},Fav:{url:"/newapi/user/collection/add",type:"post"}},!0),S={past:{navText:"已结束",timeText:"已结束",countDown:!1},present:{navText:"抢购中",timeText:"离本场结束",countDown:!0,countField:"end_time"},future:{navText:"即将开始",timeText:"离本场开始",countDown:!0,countField:"start_time"}},D=void 0;function L(e){return(e|=0)>=10?e:"0"+e}var M=(f=d=function(t){function a(e){b(this,a);var t=T(this,(a.__proto__||(0,r.default)(a)).call(this,e));return t.state={update:!1,data:null,banner:[]},t}return C(a,_.Component),v(a,[{key:"componentWillMount",value:function(){var t=this;function a(t){return new i.default(function(a){t.success=function(e){a(e)},e.ajax(t)})}document.title="限时特卖",this.context.isApp&&(location.href="jsbridge://set_title?title=限时特卖"),i.default.all([a(x("flashSale")),a(x("banner"))]).then(function(e){D=+new Date,t.setState({update:!0,data:e[0].data,banner:e[1].data})});this.context.store}},{key:"componentDidMount",value:function(){e(window).bind("scroll.fixed",function(){e(this);e(this).scrollTop()>=e(".flash-banner").height()?(e(".nav-container").addClass("nav-fixed"),e(".sale_ul").css({paddingTop:"70px"})):(e(".nav-container").removeClass("nav-fixed"),e(".sale_ul").css({paddingTop:0}))})}},{key:"componentWillUnmount",value:function(){e(window).unbind("scroll.fixed")}},{key:"render",value:function(){return this.state.update?this.state.data?y.default.createElement(I,{data:this.state.data,banner:this.state.banner}):y.default.createElement(A,null):y.default.createElement(E.LoadingRound,null)}}]),a}(),d.contextTypes={isApp:y.default.PropTypes.bool},f);t.default=M;var A=function(e){function t(){return b(this,t),T(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return C(t,_.Component),v(t,[{key:"render",value:function(){return y.default.createElement("div",{"data-page":"flashsale-page"},y.default.createElement("div",{className:"nopublish-body c-tc"},y.default.createElement("img",{className:"main-img",src:"/src/img/flashsale/sale-nopublish1-icon.png"}),y.default.createElement("div",{className:"no-pub-h"},"敬请期待"),y.default.createElement("img",{className:"img-icon",src:"/src/img/flashsale/sale-nopublish2-icon.png"}),y.default.createElement("div",{className:"no-pub-con"},"特卖商品正在发布中")))}}]),t}(),I=function(e){function t(e){b(this,t);var a=T(this,(t.__proto__||(0,r.default)(t)).call(this,e));return a.onChangeActive=function(e){var t=a.props.data,n=void 0;e||(t.present&&(n=t.present.length)?e=t.present[n-1]:t.future&&t.future.length?e=t.future[0]:t.past&&(n=t.past.length)&&(e=t.past[n-1])),e!==a.state.active&&a.setState({active:e})},a.state={},a}return C(t,_.Component),v(t,[{key:"componentWillMount",value:function(){this.onChangeActive()}},{key:"render",value:function(){var e=this.props.data;return y.default.createElement("div",{"data-page":"flashsale-page"},this.props.banner?y.default.createElement(j,{data:this.props.banner}):"",y.default.createElement(F,{data:this.props.data,active:this.state.active,onChangeActive:this.onChangeActive,nowTime:this.props.data.now}),y.default.createElement(P,{initData:e.items,active:this.state.active,nowTime:e.now}))}}]),t}(),j=function(e){function t(){return b(this,t),T(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return C(t,_.Component),v(t,[{key:"componentDidMount",value:function(){this.props.data.length>1&&(this.swiper=new Swiper(this.refs.swiperBanner,{autoplay:3e3,autoplayDisableOnInteraction:!1,pagination:".swiper-pagination",paginationType:"fraction",loop:!0}))}},{key:"getHtml",value:function(){return this.props.data&&this.props.data.map(function(e,t){return y.default.createElement("a",{className:"swiper-slide",href:e.wap.link_target||"javascript:void(0)",key:t},y.default.createElement("img",{src:e.wap.img_link}))})}},{key:"render",value:function(){var e=void 0;return e=this.props.data.length>1?{display:"block"}:{display:"none"},y.default.createElement("div",{"data-plugin":"swiper",className:"flash-banner"},y.default.createElement("div",{className:"swiper-container",ref:"swiperBanner"},y.default.createElement("div",{className:"swiper-wrapper"},this.getHtml()),y.default.createElement("div",{className:"swiper-pagination",style:e})))}}]),t}(),F=function(t){function a(e){b(this,a);var t=T(this,(a.__proto__||(0,r.default)(a)).call(this,e));return t.initData(),t}return C(a,_.Component),v(a,[{key:"initData",value:function(){var e=this,t=this.props.data,a=(0,n.default)(S);this._data=[],a.forEach(function(a,n){var i;t[a]&&(t[a].forEach(function(e,t){return e.type=a}),(i=e._data).push.apply(i,N(t[a])))})}},{key:"componentDidMount",value:function(){var t=e(".active").prop("className").split(" "),a=new Swiper(this.refs.navCon,{slidesPerView:"auto",initialSlide:t[t.length-1],onTap:function(){a.clickedIndex>=1&&a.slideTo(a.clickedIndex-1)}})}},{key:"initList",value:function(){var e=this,t=[];return this._data.forEach(function(a,n){t.push(y.default.createElement(H,{data:a,key:n,className:a==e.props.active?"active "+n:"",onChangeActive:function(){return e.props.onChangeActive(a)}}))}),t}},{key:"render",value:function(){return y.default.createElement("div",{"data-plugin":"swiper",className:"nav-container"},y.default.createElement(W,{active:this.props.active,nowTime:this.props.nowTime}),y.default.createElement("div",{className:"nav_bar",ref:"nav"},y.default.createElement("div",{id:"nav-con",className:"swiper-container",ref:"navCon"},y.default.createElement("ul",{className:"nav_bar_ul swiper-wrapper"},this.initList()))))}}]),a}(),H=function(e){function t(){return b(this,t),T(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return C(t,_.Component),v(t,[{key:"getTime",value:function(){var e=new Date(1e3*this.props.data.start_time);return L(e.getHours())+":"+L(e.getMinutes())}},{key:"getType",value:function(){var e=this.props.data.type;return S[e].navText}},{key:"render",value:function(){var e=this;return y.default.createElement("li",{className:"swiper-slide "+this.props.className,onClick:function(){return e.props.onChangeActive()}},y.default.createElement("div",{className:"start-time"},this.getTime()),y.default.createElement("div",{className:"text_tip"},this.getType()))}}]),t}(),W=function(e){function t(e){b(this,t);var a=T(this,(t.__proto__||(0,r.default)(t)).call(this,e));return a.state={},a}return C(t,_.Component),v(t,[{key:"componentWillReceiveProps",value:function(e){this.initState(e)}},{key:"componentDidMount",value:function(){this.initState()}},{key:"componentWillUnmount",value:function(){window.clearTimeout(this.timer),this.timer=null}},{key:"initState",value:function(e){var t=(e||this.props).active,a=null,n=Math.floor((new Date-D)/1e3);this.timer&&(clearTimeout(this.timer),this.timer=null),S[t.type].countDown&&(a=t[S[t.type].countField]-this.props.nowTime-n,this.timeHandler()),this.setState({count:a})}},{key:"getTimeInfo",value:function(){var e=this.props.active;return S[e.type].timeText}},{key:"timeHandler",value:function(){var e=this;this.timer=setTimeout(function(){var t=e.state.count-1;0==t?location.reload():(e.setState({count:t}),e.timeHandler())},1e3)}},{key:"getTimeCount",value:function(){var e=this.state.count>0?this.state.count:0;return e?L(e/3600)+" : "+L(e/60%60)+" : "+L(e%60):null}},{key:"render",value:function(){var e="离本场结束"===this.getTimeInfo();return y.default.createElement("div",{className:"c-tc timelast "+(e?"timeEndLast":"timeStartLast")},this.getTimeInfo(),y.default.createElement("span",{className:"time"},this.getTimeCount()))}}]),t}(),P=function(t){function a(t){b(this,a);var n=T(this,(a.__proto__||(0,r.default)(a)).call(this,t));return n.getData=function(t){var a=n,i=0;delete n.state.nowState,a.ajax&&a.ajax.abort(),a.ajax=e.ajax(x("itemList",{data:{promotion_id:n.props.active.promotion_id,page:n._page++},success:function(e){if(a.state.update=!1,e.data){var r,l=e.data.total_count;i=l%10?Math.floor(l/10)+1:l/10,(r=a.state.data).push.apply(r,N(e.data.items)),a.setState(a.state)}!e.data||n._page-1>=i?t.stateNodata():t.stateRefresh(),t.unLocked()},error:function(){}}))},n.getData=n.getData.bind(n),n}return C(a,_.Component),v(a,[{key:"initState",value:function(){this.state={data:[],update:!0,nowState:"INIT"},this._page=1,this.setState(this.state)}},{key:"componentWillMount",value:function(){this.initState()}},{key:"componentWillReceiveProps",value:function(e){e.active!==this.props.active&&this.initState()}},{key:"render",value:function(){return this.state.data?y.default.createElement("div",{className:"tab_wrap"},y.default.createElement(E.Scroll,{getData:this.getData,onRefresh:this.onRefresh,nowState:this.state.nowState},y.default.createElement(O,{data:this.state.data,nowTime:this.props.nowTime}))):y.default.createElement(R,null)}}]),a}(),R=function(e){function t(){return b(this,t),T(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return C(t,_.Component),v(t,[{key:"render",value:function(){return y.default.createElement("img",{className:"no_commodity",src:"/src/img/specialFlashsale/noCommodity.png"})}}]),t}(),O=function(e){function t(){return b(this,t),T(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return C(t,_.Component),v(t,[{key:"getListHtml",value:function(){var e=this,t=[];return this.props.data&&this.props.data.forEach(function(a,n){t.push(y.default.createElement(J,{data:a,key:n,nowTime:e.props.nowTime}))}),t}},{key:"render",value:function(){return y.default.createElement("div",{className:"sale_ul floor-bd"},y.default.createElement("ul",null,this.getListHtml()))}}]),t}();var B=function(e){function t(){return b(this,t),T(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return C(t,_.Component),v(t,[{key:"render",value:function(){var e=this.props,t=e.to,a=e.type,n=e.className;return"pc"===a?y.default.createElement(g.Link,{to:t,className:n},this.props.children):y.default.createElement("a",{href:t,className:n},this.props.children)}}]),t}(),J=(h=m=function(t){function a(e){b(this,a);var t,n,i,l,s=T(this,(a.__proto__||(0,r.default)(a)).call(this,e));return s.urlHandle=function(e,t){if(s.channel){if(e&&!/^t/.test(e)&&!/channel/.test(e)){e=e+(/\?/.test(e)?"&":"?")+"channel="+s.channel}}return"app"===t?"jsbridge://open_link_in_new_window?url="+window.btoa(window.location.protocol+"//"+window.location.host+e):e},s.channel=(t="channel",n=window.location.search.replace(/^\?/,""),i=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),(l=n.match(i))?l[2]:null),s}return C(a,_.Component),v(a,[{key:"getStatus",value:function(){var e=this.props.data,t=Math.floor((new Date-D)/1e3),a=this.props.nowTime+t;return a>e.end_time?0:a>e.start_time?1:2}},{key:"componentWillMount",value:function(){this.state={collect:this.props.data.is_faved}}},{key:"onCollect",value:function(){var t=this;if(this.context.isLogin||!this.context.isApp){var a=x(this.state.collect?"DelFav":"Fav",{data:{item_id:this.props.data.item_id},success:function(e){e.success&&t.setState({collect:!t.state.collect})}});e.ajax(a)}else location.href="trmall://to_login"}},{key:"priceIsInt",value:function(e){return Math.floor(e)===e}},{key:"decimalPrice",value:function(e){return e.toString().split(".")[1]}},{key:"render",value:function(){var e=this,t=this.state.collect,a=this.props.data,n=a.real_store,i=a.promotion_price,r=a.market_price,l=a.show_type,s=this.getStatus(),o=this.context.isApp?"app":"pc",c=a.promotion_tags&&a.promotion_tags.map(function(e,t){return y.default.createElement("span",{key:t,className:"full_discount "+(e.promotion_tag?"":"c-dpno")},e.promotion_tag," ")});return y.default.createElement("li",null,"flashsale"==l?y.default.createElement("div",{className:"infor_wrap"},y.default.createElement("div",{className:"infor_l c-fl"},y.default.createElement(B,{to:this.urlHandle("/item?item_id="+a.item_id,o),type:o},y.default.createElement("img",{src:a.primary_image}),n||1!=s?null:y.default.createElement("div",{className:"sale_statue c-tc"},"还有机会"))),y.default.createElement("div",{className:"infor_r"},y.default.createElement(B,{to:this.urlHandle("/item?item_id="+a.item_id,o),className:"infor_tit",type:o},a.title),y.default.createElement("div",{className:"favour"},c,s<2?s?y.default.createElement("div",{className:"last_num c-tc "+(n>0&&n<11?"":"c-dpno")},"仅剩",a.real_store,"件"):y.default.createElement("span",{className:"prompt"},"仍有优惠~"):y.default.createElement("span",{className:"prompt"},"限量",a.promotion_store,"件")),y.default.createElement("div",{className:"detail_footer c-pr"},y.default.createElement("div",{className:"price_area c-fl c-pr"},y.default.createElement("span",{className:"promotion_price c-dpb "+(r?"":"c-pt10")},y.default.createElement("span",{className:"money_icon"},"¥"),this.priceIsInt(i)?y.default.createElement("span",null,i):y.default.createElement("span",null,Math.floor(i),y.default.createElement("span",{className:"price_decimal"},".",this.decimalPrice(i)))),y.default.createElement("span",{className:"market_price c-dpb c-cc9",style:r?{}:{display:"none"}},"¥ ",r," ")),y.default.createElement("div",{className:"buyoradd_btn c-fr"},s<2?y.default.createElement("span",{className:"c-tc c-fr "+(0!=s&&n?"rightnow":"toseeit")},y.default.createElement(B,{to:this.urlHandle("/item?item_id="+a.item_id,o),type:o},0!=s&&n?"马上抢":"去看看")):y.default.createElement("span",{className:"c-tc c-fr "+(t?"collected":"ahead_time"),onClick:function(){return e.onCollect()}},t?"已收藏":"抢先收藏"))))):y.default.createElement(U,{data:a}))}}]),a}(),m.contextTypes={isApp:y.default.PropTypes.bool,isLogin:y.default.PropTypes.bool},h),U=function(e){function t(){return b(this,t),T(this,(t.__proto__||(0,r.default)(t)).apply(this,arguments))}return C(t,_.Component),v(t,[{key:"getImgList",value:function(){var e=[],t=this.props.data;t.items;if(t&&t.items)return t&&t.items.forEach(function(t,a){e.push(y.default.createElement("li",{className:"c-dpib c-pr",key:a},y.default.createElement("img",{src:t.primary_image}),y.default.createElement("div",{className:"sp_price_area c-pr c-tc"},y.default.createElement("span",{className:"sp_promotion_price"},"¥",t.promotion_price))))}),e}},{key:"render",value:function(){var e=this.props.data,t="/specialFlashsale?promotion_id="+e.promotion_id;return e?y.default.createElement(B,{to:t},y.default.createElement("div",{className:"specialBrand c-pr c-tc"},y.default.createElement("div",{className:"corner_icon c-pa c-tc"},"品牌特卖"),y.default.createElement("div",{className:"title_area"},y.default.createElement("span",{className:"main_title"},e.specialflashsale_title),y.default.createElement("div",{className:"subtitle_area c-pr"},y.default.createElement("span",{className:"subtitle"},e.specialflashsale_subtitle),y.default.createElement("img",{src:"/src/img/specialFlashsale/arrow_right.png"}))),y.default.createElement("ul",null,this.getImgList()))):""}}]),t}()}).call(this,a("OOjC"))}}]);