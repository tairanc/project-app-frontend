import createReducers from './createReducers.js';

const initState = {
  update: false,
  initData: '',
  error: false,
  errorMsg: "",
  cancel_reason: "",
  other_reason: ""
};

function orderCancel(state = initState, action) {
  switch (action.type) {
    case "initialPage":
      return initState;
    case "getInitData":
      return Object.assign({}, state, {
        update: false
      });
    case 'sucInitData':
      /*return Object.assign({},state,{
          update:true,
          initData:action.data
      });*/
      console.log('action.data', action.data);
      return {...state,update:true,initData:action.data};
      //return {...state, update: true};
    case 'failInitData':
      return Object.assign({}, state, {
        error: true,
        errorMsg: action.msg
      });
    case 'changeReason':
      return Object.assign({}, state, {
        cancel_reason: action.reason,
        other_reason: action.reason == 'other' ? state.other_reason : ""
      });
    case 'otherReasonChange':
      return Object.assign({}, state, {
        other_reason: action.value
      });
    default:
      return state;
  }
}

export default createReducers("orderCancel", orderCancel, initState)