
let initData = (action)=>{
    let specs = action.specs,
        data = action.data.item.specs,
        keys = Object.keys(specs),
        key = keys[0].split("_"), item, ikeys, sKeys;

    for (var i in data) {
        let ret, j=0;
        item = data[i];
        ikeys = Object.keys(item.values);

        while(key[j]) {
            if (ikeys.indexOf(key[j]) >=0) {
                ret = key[j];
                break
            } else {
                j++
            }
        }
        action.clickList[i] = ret;
    }
    action.nowSpec = action.specs[keys[0]];
    action.specList = Object.keys(data);
    sKeys = Object.keys(action.nowSpec.invest);
    action.nowInvest = action.nowSpec.invest[sKeys[sKeys.length-1]];
	  action.marketPrice = action.nowSpec && action.nowSpec.price;
    return action
}

let countInvest = (action) => {
    let {num, nowInvest} = action;
    let {invest, profit} = nowInvest
    action.invest = num * invest;
    action.profit = num * profit

    return action
}

let changeOn = (state, action) =>{
    let {id, spec} = action, sKeys;
    let ret = {
        clickList: state.clickList
    };
    ret.clickList[spec] = id

    let key = state.specList.join("_").replace(/\d+/g, (key) => state.clickList[key]);
    ret.nowSpec = state.specs[key];
    sKeys = Object.keys(ret.nowSpec.invest);

    ret.nowInvest = ret.nowSpec.invest[sKeys[0]];
    ret.marketPrice = ret.nowSpec && ret.nowSpec.price;
    return ret
}

let updateNum = (state, num)=> {
    let {store} = state.data.item;
    let snum = state.nowSpec.store;
    let ret = {};
    if (num < 1 || num > snum) {
        ret.popup = {
            messageType:  num < 1 ? "MINNUM": "MAXNUM",
            messageArg: snum
        }
    }
    ret.num = num==0 ? 1: num > snum ? snum == 0 ? 1: snum : num
    return ret
};


let addMinNum = (state, action) => {
    let {num} = action;
    let cnum = state.num + num;

    return updateNum(state, cnum);
}

export default function (state = {update: false}, action) {
    let data, num;
    switch(action.type) {
        case "ZEROBUY_CHANGE_SPEC":
            data = changeOn(state, action);
            return countInvest({
                ...state,
                ...data
            })
        case "ZEROBUY_CHANGE_DATA":
        case "ZEROBUY_POP_CLOSE":
            return countInvest({
                ...state,
                ...action
            })



        case "ZEROBUY_CHANGE_NUM":
             data = addMinNum(state, action);
             return countInvest({
                ...state,
                ...data
             })
        case "ZEROBUY_INIT_DATA":
            data = initData(action);
            return countInvest({
                ...state,
                update: true,
                ...data
            });
        case "ZEROBUY_WILL_UNMOUNT":
            return {
                update: false
            }
        default: return state
    }
}
