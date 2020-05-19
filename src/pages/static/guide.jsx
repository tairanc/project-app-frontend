import React, { Component } from 'react';
import {base64encode, utf16to8} from "../../../src/js/util/index"

import 'src/scss/guide.scss';

export default class Guid extends Component {
	static contextTypes = {
		isApp: React.PropTypes.bool
	}
	componentWillMount(){
		document.title="下载引导";
		this.context.isApp && (window.location.href = "jsbridge://set_title?title=下载引导");
	}
  componentDidMount() {
	  	 let win = window, doc = document;
		  var $weChatDiv = doc.getElementById('weixinBrowserMask'),
			  $downloadLink = doc.getElementById('downloadAppLink'),
			  app_download_link = '',
			  u = navigator.userAgent,
			  locked = false,
			  redirect = location.search.match(/redirect=([^&]*)/);
		  /*redirect = decodeURIComponent(redirect ? redirect[1] : '')
		  var jumpUrl = 'trmall://open_link_in_new_window?url='+base64encode(utf16to8(redirect)),*/
		  redirect = decodeURIComponent(redirect ? redirect[1] : '')
		  var jumpUrl = redirect?'trmall://open_link_in_new_window?url='+base64encode(utf16to8(redirect)):'trmall://main?page=home',
			  app = navigator.appVersion;
		  var browser = {
			  versions: function () {
				  var u = navigator.userAgent, app = navigator.appVersion;
				  return {         //移动终端浏览器版本信息
					  trident: u.indexOf('Trident') > -1, //IE内核
					  presto: u.indexOf('Presto') > -1, //opera内核
					  webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
					  gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
					  mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
					  ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
					  android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
					  iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
					  iPad: u.indexOf('iPad') > -1, //是否iPad
					  webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
				  };
			  }(),
			  language: (navigator.browserLanguage || navigator.language).toLowerCase()
		  }

		  if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
			  var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
			  if (ua.match(/MicroMessenger/i) == "micromessenger") {
				  $weChatDiv.style.display = 'block';//在微信中打开

			  }

			  if (ua.match(/WeiBo/i) == "weibo") {
				  $weChatDiv.style.display = 'block';//在新浪微博客户端打开
			  }
			  if (ua.indexOf('qq/')>-1) {
				  $weChatDiv.style.display = 'block';//在QQ空间打开
			  }
			  if (browser.versions.ios) {
				  //app_download_link = 'https://itunes.apple.com/cn/app/tai-he-wang/id954734297?mt=8';//是否在IOS浏览器打开
				  app_download_link = 'https://itunes.apple.com/us/app/%E6%B3%B0%E7%84%B6%E4%BA%AB%E8%B4%AD/id1341530533?l=zh&ls=1&mt=8';//是否在IOS浏览器打开
			  }
			  if(browser.versions.android){
				  var channel = decodeURIComponent(location.search).match(/channel\s*=\s*([^&]*)/);
				  var reg = /^(yidianpromo|oppopromo|lepromo|stockpromo|wdzjpromo|xiaomipromo|broadcastpromo|youdaopromo|suocaibaopromo|huisuopingpromo|batterypromo|cleanpromo|kingsoftpromo|anmopromo|toutiaopromo|360promo|weixinpromo|weibopromo|ipinyoupromo|telecompromo|liebaopromo|spiderpromo|flowcomingpromo|meiyouecpro|quanmamaecpro|babytreeecpro|xiangtuiecpro|liebaoecpro|batdocecpro|fanliecpro|tashequecpro|gedengecpro|mojiecpro|baiduszecpro|zhihuituiecpro|gedecpro|youdaoecpro|360ecpro|ipinyouecpro|souhuecpro|toutiaoecpro)$/i


				  channel = channel && reg.test(channel[1]) ? '_' + channel[1] : '';
				  //app_download_link = 'http://dl.trc.com/trc'+ channel  +'.apk';//是否在安卓浏览器打开
				  //app_download_link = 'http://7u2o08.com1.z0.glb.clouddn.com/trc-release.apk';
				  app_download_link = 'http://trmall-apk.oss-cn-beijing.aliyuncs.com/trmall.apk';
			  }
			  $downloadLink.setAttribute('href',app_download_link);

		  } else {
			  $weChatDiv.style.display = 'none';
		  }

		  if (locked) {
			  return;
		  }
		  locked = true;
		  var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
	  if ( ua.indexOf('qq/') > -1 || ( ua.indexOf('safari') > -1 && (ua.indexOf('os 9_') > -1 || ua.indexOf('os 10_') > -1)) ) {
		  // 方案一(a link click 唤醒)
		  var openAppLink = document.getElementById('openAppLink');
		  openAppLink.href = jumpUrl;
		  // 执行click
		  function customClickEvent() {
			  var clickEvt;
			  if (window.CustomEvent) {
				  clickEvt = new window.CustomEvent('click', {
					  canBubble: true,
					  cancelable: true
				  });
			  } else {
				  clickEvt = document.createEvent('Event');
				  clickEvt.initEvent('click', true, true);
			  }

			  return clickEvt;
		  }
		  customClickEvent()
		  openAppLink.dispatchEvent(customClickEvent());
	  }
		  else
		  {
			  // 方案二(iframe 唤醒,兼容性较好)
			  var ifr = this.refs.iframe;
			  ifr.src = jumpUrl;
			  ifr.style.display = 'none';
		  }

		  // 唤起加锁，避免短时间内被重复唤起
		  setTimeout(function () {
			  locked = false;
		  }, 2500)

  }
  render() {
    return (
		<div data-page="page-guid">
		<div className="appGuide_body">
			<a id="openAppLink" href="" className="hidden"></a>
			<img width="100%"  src="/src/img/guide/guide_bg.png" />
				<div className="appGuide_main">
					<div className="appGuide_content">
						<div className="app_download_btn">
							<a id="downloadAppLink"  href="javascript:;">
								<img src="/src/img/guide/guide_btn.png"/>
							</a>
						</div>
					</div>
				</div>
				<div id="weixinBrowserMask" className="weixin-download-mask">
					<img width="100%" height="100%" src="https://www.tairanmall.com/themes/wapmall/images/zhezhao.png" />
				</div>
			<iframe style={{display: "none"}} ref="iframe"></iframe>
		</div>
		</div>
				)
  }
}

