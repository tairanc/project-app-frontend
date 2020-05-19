import createReducers from './createReducers.js';
const initState ={
	popup:"",
	show:false,
    popupShow:false,
	listType:"SELECT",
    reasonList:[],
	reason:"0",
	money:"",
	description:"",
    subArr:[],
	tid:"",
    load:true,
    data:"",
    paymentLarg:"",
};
function afterSaleApply( state= initState ,action){
	switch( action.type){
        case 'resetData':
            return { ...initState, ...action.query };
        case 'getDataSuccess':
            return { ...state, load:false, data:action.result.data,money:action.result.data.payment,
                paymentLarg:action.result.data.payment};
        case 'ctrlModal':
            return { ...state, modal:{ ...action.modal } };
        case 'changeMoney':
            return { ...state, money: action.money };
        case 'changeDescribe':
            return { ...state, description: action.description };
        case 'ctrlPopup':
            return { ...state, popup: action.popup, popupShow:action.show };
        case 'hidePopup':
            return { ...state, popupShow: action.show };
        case 'reasonChange':
            return { ...state, reason: action.reason, popupShow:false };
        case 'setsubImgArr':
            return { ...state, subArr: action.subArr };
        case 'typeChange':
            return { ...state, listType:action.listType, reasonList:action.reasonList, popupShow:false };
        default:
			return state;
	}
}

export default createReducers("afterSaleApply",afterSaleApply,initState )