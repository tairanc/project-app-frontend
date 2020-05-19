import createReducers from './createReducers.js';
const initialState ={
	update:false,
	initData:'',
	error:false,
	errorMsg:false,
	logiData:"",
	logiLoad:true,
	logiError:false,
    payPopupMsg:{
        show: false,
        Msg:""
	},
    PopupCancelMsg:{
        show: false,
        Msg:""
	},
    cancel_reason:'',
    modalAS:{
        show:false,
        msg:""
    },
};

function tradeDetail( state=initialState, action ){
	switch( action.type ){
		case "initialPage":
			return initialState;
		case "getInitData":
			return Object.assign({},state,{
				update:false
			});
		case 'sucInitData':
			return Object.assign({},state,{
				update:true,
				initData:action.data
			});
			break;
		case 'failInitData':
			return Object.assign( {},state,{
				error:true,
				errorMsg:action.msg
			});
		case 'logiDataSuc':
			return Object.assign({},state,{
				logiData:action.data,
				logiLoad:false
			});
		case 'logiDataError':
			return Object.assign({},state,{
				logiError:true,
				logiLoad:false
			});
        case 'payPopup':
            return { ...state, payPopupMsg: {...action.status}};
        case 'cancelPopup':
            return { ...state, PopupCancelMsg: {...action.status}};
        case 'changeReason':
            return { ...state,
                cancel_reason:action.reason
            };
        case 'ctrlModalapply':
            return {...state, modalAS:{ ...action.modalAS }};
		default:
			return state;
	}
}
export default createReducers("tradeDetail",tradeDetail,initialState );