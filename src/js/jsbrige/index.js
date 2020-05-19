
function checkDeliveryRegions (deliveryRegionsData, nowData) {
    let par = deliveryRegionsData,
        regionsData = '';

    if (par === true) {
        return true
    }

    for (var i in par) {
        regionsData += ',' + par[i].area;
    }

    regionsData = regionsData.split(',');
    return nowData.some((item, i) => regionsData.indexOf(item) >-1)
}

export function onAreaResultJSBrige (deliveryRegions, cb) {
    return function onAreaResult (data) {
        data = JSON.parse(data)
        let ret, flag;

        if (/110100|120100|500100|310100/.test(data.provinceCode)) {
            ret = data.provinceName + data.cityName
        } else {
            ret = data.cityName + data.countyName
        }
        flag = checkDeliveryRegions(deliveryRegions,[data.provinceCode, data.cityCode,data.countyCode].filter(function (a) {return a}));

        cb && cb(ret, flag);
    }
}
