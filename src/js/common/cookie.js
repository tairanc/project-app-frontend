export function setCookie (name, value, expire) {
  let Days = 30,
    exp = new Date();
  exp.setTime(exp.getTime() + (expire ? expire : Days) * 24 * 60 * 60 * 1000);
  //document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + `${name === 'token' ? ';domain=.tairanmall.com' : ''}`+ ";path=/";
  document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ';domain=.tairanmall.com;path=/';
}

export function getCookie (name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return decodeURI(arr[2]);
  else
    return null;
}


export function clearCookie (name) {
  let obj = {};
  document.cookie.split(";").map((item, i) => {
    obj[item.split("=")[0]] = item.split("=")[1]
  });
  let exp = new Date();
  exp.setTime(exp.getTime() + -1 * 24 * 60 * 60 * 1000);
  for (let k in obj) {
    k = k.trim();
    if (k === name) {  //清除指定域下的cookie
      document.cookie = k + "=" + encodeURI('') + ";expires=" + exp.toGMTString() + ';path=/';  //删除当前域下的cookie
      document.cookie = name + "=" + encodeURI('') + ";expires=" + exp.toGMTString() + ';domain=.tairanmall.com;path=/';
      document.cookie = name + "=" + encodeURI('') + ";expires=" + exp.toGMTString() + ';domain=wxapp.tairanmall.com;path=/';
      document.cookie = name + "=" + encodeURI('') + ";expires=" + exp.toGMTString() + ';domain=wx.tairanmall.com;path=/';
      document.cookie = name + "=" + encodeURI('') + ";expires=" + exp.toGMTString() + ';domain=jr-m.tairanmall.com;path=/';
      document.cookie = name + "=" + encodeURI('') + ";expires=" + exp.toGMTString() + ';domain=m.tairanmall.com;path=/';
    }
  }
}
