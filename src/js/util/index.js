import { getCookie } from 'js/common/cookie';

export const RHOST = window.location.protocol + "//wx.tairanmall.com";

export function each (obj, iteratee) {
  let i, length;
  if (Array.isArray(obj)) {
    obj.forEach((val, i) => iteratee(i, val, obj))
  } else {
    let keys = Object.keys(obj);
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(keys[i], obj[keys[i]], obj);
    }
  }
  return obj;
}

export function wrap (fnc, wrapper) {
  return function (...arg) {
    arg.unshift(fnc);
    return wrapper.apply(this, arg)
  }
}

export function filter (objOrFn) {
  if (typeof objOrFn == "function") {
    return function (items) {
      let ret = [];
      each(items, function (key, val) {
        if (objOrFn(key, val) === true) {
          ret.push(val);
        }
      });
      return ret
    }
  }
  return objOrFn == null ? function () {
  } : function (property) {
    return objOrFn[property]
  }
}


export let dateUtil = {

  formatNum: function (n) {
    if (n < 10) return '0' + n;
    return n;
  },

  parse: function (dateStr, formatStr) {
    if (typeof dateStr === 'undefined') return null;
    if (typeof formatStr === 'string') {
      var _d = new Date(formatStr);

      var arrStr = formatStr.replace(/[^ymd]/g, '').split('');
      if (!arrStr && arrStr.length != 3) return null;

      var formatStr = formatStr.replace(/y|m|d/g, function (k) {
        switch (k) {
          case 'y':
            return '(\\d{4})';
          case 'm':
          case 'd':
            return '(\\d{1,2})';
        }
      });

      var reg = new RegExp(formatStr, 'g');
      var arr = reg.exec(dateStr)

      var dateObj = {};
      for (var i = 0, len = arrStr.length; i < len; i++) {
        dateObj[arrStr[i]] = arr[i + 1];
      }
      return new Date(dateObj['y'], dateObj['m'] - 1, dateObj['d']);
    }
    return null;
  },

  format: function (date, format) {
    if (!date) {
      return null
    }
    if (arguments.length == 2 && typeof format === 'boolean') {
      format = date;
      date = new Date();
    }
    if (!date.getTime) {
      date = new Date(parseInt(date));
    }

    typeof format != 'string' && (format = 'Y年M月D日 H时F分S秒');
    return format.replace(/Y|y|M|m|D|d|H|h|F|f|S|s/g, function (a) {
      switch (a) {
        case "y":
          return (date.getFullYear() + "").slice(2);
        case "Y":
          return date.getFullYear();
        case "m":
          return date.getMonth() + 1;
        case "M":
          return dateUtil.formatNum(date.getMonth() + 1);
        case "d":
          return date.getDate();
        case "D":
          return dateUtil.formatNum(date.getDate());
        case "h":
          return date.getHours();
        case "H":
          return dateUtil.formatNum(date.getHours());
        case "f":
          return date.getMinutes();
        case "F":
          return dateUtil.formatNum(date.getMinutes());
        case "s":
          return date.getSeconds();
        case "S":
          return dateUtil.formatNum(date.getSeconds());
      }
    });
  }
};


// 编码start
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function base64encode (str) {
  var out, i, len;
  var c1, c2, c3;

  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
  }
  return out;
}

export function utf16to8 (str) {
  var out, i, len, c;

  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
};
export const compose = (...func) => {
  if (!func.length) {
    return (args) => args
  } else {
    const last = func[func.length - 1];
    const ret = func.slice(0, -1);
    return (...arg) => ret.reduceRight((component, fn) => fn(component), last(...arg))
  }
};

//分享
export const base64Utf8 = (config) => {
  return base64encode(utf16to8(JSON.stringify(config)));
}
export const Share = (config) => {
  // config.link = `${APPURL}/redirect?${encodeURIComponent(config.link)}`
  // config.link = encodeURIComponent(config.link);

  let params = base64Utf8(config);
  return "trmall://share?params=" + params
}

export const dataConvertShare = compose(Share, (data) => {
  if (data.isRedirect) {
    data.link = `${data.link}#flag&isRedirect=true&rhost=${data.rhost || RHOST}&evn=${data.evn || ""}`;
    delete data.isRedirect;
    delete data.rhost;
    delete data.evn
  }
  return data
});
//position 滚动终止位置 time滚动到指定位置所需毫秒数
export const scrollTo = (position, time) => {
  if (position < 0) return;
  var scrollTop = $(window).scrollTop();
  var speed = (scrollTop > position ? (scrollTop - position) : (position - scrollTop)) / time;
  var interval = setInterval(function () {
    if (scrollTop > position) {
      scrollTop -= speed;
      if (scrollTop <= position) {
        clearInterval(interval);
        $(window).scrollTop(position);
      } else {
        $(window).scrollTop(scrollTop);
      }
    } else {
      scrollTop += speed;
      if (scrollTop >= position) {
        clearInterval(interval);
        $(window).scrollTop(position);
      } else {
        $(window).scrollTop(scrollTop);
      }
    }
  }, 1);
};
export function truncateByte (target, byteLength, truncate) {
  byteLength = byteLength || 60;
  truncate = truncate === void (0) ? '...' : truncate;
  if (target.replace(/[^A-Z\x00-\xff]/g, "**").length > byteLength) {
    var i = 0;
    for (var z = 0; z < byteLength; z++) {
      if (target.charCodeAt(z) > 255) {
        i = i + 2;
      } else {
        i = i + 1;
      }
      if (i >= byteLength) {
        target = target.slice(0, (z + 1) - truncate.length / 2) + truncate;
        break;
      }
    }
    return target;
  } else {
    return target + "";
  }
}
export function subArray (array, num) {
  return array.slice(0, num)
}

let browser = {
  versions: function () {
    let u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

/*function getCookie(name) {
	let cookie = document.cookie,
		objCookie = {},
		arrCookie = cookie.split(";");
	for (let i = 0, item; item = arrCookie[i++];) {
		let cookieVal = item.split("=");
		objCookie[cookieVal[0] && cookieVal[0].trim()] = cookieVal[1];
	}
	return objCookie[name];
}*/

export const URL = {
  wx: window.location.protocol + "//wx.tairanmall.com",
  jr: window.location.protocol + "//jr-m.tairanmall.com",
  "51": window.location.protocol + "//51af-m.tairanmall.com",
  kd: window.location.protocol + "//kdaf-m.tairanmall.com",
  mall: window.location.protocol + "//m.tairanmall.com",
  wxapp: "https://wxapp.tairanmall.com"
};

//判断环境
export const platform = {
  wx: browser.versions.weixin, //微信
  mall: getCookie("platform") === "mall", //泰然城App
  finance: getCookie("platform") === "finance", //泰然金融App
  is51: (/51gjj|51Gjj|51jiekuan|51shebao|51ishebao/i).test(navigator.userAgent), //51App
  iskd: (/pocketwallet/i).test(navigator.userAgent), //kdApp
  isApp: !!getCookie("origin")
};

//判断环境并跳转到对应的地址
export function redirectURL (url, mini) {
  let currentURL = window.location.origin + url;
  let testReg = /^(wx|jr-m|51af-m|kdaf-m|m)\.tairanmall.com/.test(window.location.host);
  let redirectURL;
	/*var ua = window.navigator.userAgent.toLowerCase();
	 if (ua.match(/MicroMessenger/i) == 'micromessenger') {    //判断是否是微信环境
	 //微信环境
	 wx.miniProgram.getEnv(function (res) {
	 if (res.miniprogram) {
	 // 小程序环境下逻辑
	 redirectURL = URL.wxapp + url
	 } else {
	 //非小程序环境下逻辑
	 redirectURL = URL.wx + url
	 }
	 if (currentURL !== redirectURL) {
	 window.location.replace(redirectURL);
	 }
	 })
	 } else {
	 //非微信环境逻辑
	 redirectURL = platform.mall ? URL.mall : (platform.finance ? URL.jr : (platform.is51 ? URL['51'] : (platform.iskd ? URL.kd : (!testReg ? window.location.origin : URL.wx)))) + url;
	 if (currentURL !== redirectURL) {
	 window.location.replace(redirectURL);
	 }
	 }*/
  if (mini) {  //判断小程序环境
    redirectURL = URL.wxapp + url;
  } else {
    redirectURL = (platform.wx ? URL.wx : (platform.mall ? URL.mall : (platform.finance ? URL.jr : (platform.is51 ? URL['51'] : (platform.iskd ? URL.kd : (!testReg ? window.location.origin : URL.wx)))))) + url;
  }
  if (currentURL !== redirectURL) {
    window.location.replace(redirectURL);
  }
};

//大图 中图 小图 微图
export function addImageSuffix (url, size) {
  return url = (/image.tairanmall.com\//.test(url)) ? url + size + ".jpg" : url

};

// 保留两位
export function toFixedTwo (val) {
  return parseFloat(parseFloat(val).toFixed(2))
}

//判断iPhone X方法
export function judgeIphoneX () {
  return /iphone/gi.test(navigator.userAgent) && (screen.height === 812 && screen.width === 375)
};

//身份证号统一前四后四 中间**
export function handleId (id) {
  return id.slice(0, 4) + "************" + id.substr(id.length - 4, 4)
}
