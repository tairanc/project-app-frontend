import createReducers from './createReducers.js';
let initData = {
    state: "",
    now_time: "",
    toend: "",
    valid:"",
    errorVal: "",
    inputVal: "",
    popupModalCtrl: {
        show: false
    }
}

function obserState(store) {
    let {now_time,toend,end_time, start_time} = store;
    let state;
    now_time++;

    if (now_time < start_time) {
        state = 0;
    } else if (now_time > end_time){
        state = 1
    } else {
        state = 2
    }

    toend = end_time - now_time;

    return {...store, state, now_time, toend}
}

function initilize(state, result) {
    return obserState({...state, ...result});
}


function seckill( state = initData, action ) {
    switch (action.type) {
        case "clearData":
            return initData
        case "initData":
            return initilize(state, action)

        case "observeState":
            return obserState(state)
        case "popupModalCtrl":
            return {...state, popupModalCtrl: action.popupModalCtrl}
        case "loadCaptchaLoad":
            return {...state}
        case "loadCaptchaSuccess":
            return {...state, valid: action.result.data}
        case "clearCaptcha":
            return {...state, valid: "", errorVal: "", inputVal: ""}
        case "validVal":
            return {...state, inputVal: action.inputVal}
        case "validError":
            return {...state, errorVal: action.errorVal}
        default:
            return {...state}
    }
}

export default createReducers("seckill", seckill, initData);
