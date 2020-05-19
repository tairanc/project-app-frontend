import createReducers from './createReducers.js';
import Immutable from 'immutable';

const invoiceType = [
	{ text:"普通发票", type:"common", able:true,},
	{ text:"电子发票", type:"electron", able:true,},
	{ text:"增值税发票", type:"tax", able:true, }
];

const mapInvoiceType = {
	"common":"NORMAL",
	"tax": "VAT",
	"electron":"ELEC"
};
const invoiceTypeMap = {
	"NORMAL":"common",
	"VAT": "tax",
	"ELEC":"electron"
};

const initialState ={
	load:true,
	update:true,
	data:"",
	invoiceType:"common",
	invoiceSelData: invoiceType,
	invoiceContent: [],
	invoiceId:"",
	showModal: false,
	invoiceNote:false,
	commonInvoice:{
		postData:{
			action:1, //发票公司
			invoice_name1:"个人", //发票抬头个人
			invoice_name2:"", //发票抬头公司
			invoice_content:1, //发票内容
			contentText:"明细",
		},
		status:{
			infoMore: false
		},
	},
	electronInvoice:{
		postData:{
			action:1, //发票抬头
			invoice_name1:"个人", //发票抬头个人
			invoice_name2:"", //发票抬头公司
			invoice_content:1, //发票内容
			contentText:"明细",
		},
		status:{
			infoMore: false
		},
	},
	taxInvoice:{
		postData:{
			action:2, //发票公司
			invoice_name:"", //发票抬头
			invoice_content:1, //发票内容
			contentText:"明细",
		},
	},
	//提示框
	prompt:{
		show:false,
		msg:""
	},
};

function initialPage( state, result, invoice, action ){
	let imData = Immutable.fromJS( state );
	if( !result.status ){
		imData = imData.set("prompt",{
			show:true,
			msg:result.msg
		});
		return imData.toJS();
	}
	
	imData = imData.set("load",false );
	imData = imData.set("update",false );
	
	let { data } = result;
	let newInvoiceSelData = imData.get("invoiceSelData").toJS().map(( list, i )=>{
		if(  data.shop_invoice.invoice_type.indexOf( mapInvoiceType[list.type]  ) > -1 ){
			list.able = true;
		}else{
			list.able = false;
		}
		//测试
		//list.able = true;
		return list;
	});
	imData = imData.set("invoiceSelData", newInvoiceSelData );
	imData = imData.set("invoiceContent", data.shop_invoice.invoice_content );
	
	let userForm = data.user_invoice;
	if( userForm ){
		
		imData = imData.set("invoiceId", userForm.invoice_id );
		
		if( userForm.user_addr ){
			imData = imData.setIn(["taxInvoice","postData","receiver_addr"], userForm.user_addr.addr );
			imData = imData.setIn(["taxInvoice","postData","receiver_name"], userForm.user_addr.name );
			imData = imData.setIn(["taxInvoice","postData","receiver_region"], userForm.user_addr.area.split(":")[0] );
			imData = imData.setIn(["taxInvoice","postData","receiver_tel"], userForm.user_addr.mobile );
		}
		
		if( userForm.invoice_type ) {
			let type = invoiceTypeMap[userForm.invoice_type];
			imData = imData.updateIn([type + "Invoice", "postData"], ( obj )=>{
				if( type !=="tax" ){
					userForm[`invoice_name${userForm.action}`] = userForm.invoice_name;
				}
				return Object.assign( obj.toJS(), userForm );
			});
		}
	}
	imData = imData.set("invoiceType",invoiceTypeMap[invoice] );
	imData = Immutable.fromJS( imData.toJS() );
	imData = imData.setIn( [invoiceTypeMap[invoice]+"Invoice","postData","action"], action );
	
	return imData.toJS()
}

function flatObject( old ) {
	if( typeof old !== "object"){
		return old;
	}
	let n = {};
	let keys = Object.keys( old );
	keys.forEach(( key, i )=>{
		if( typeof old[key] ==="object" && old[key] !== null ){
			Object.assign( n, flatObject( old[key]));
		}else{
			n[key] = old[key];
		}
	});
	return n;
}

function changeStatus( state, action ) {
	if( state[action.invoiceType].status[action.key] === action.value ){
		return state;
	}
	let imState = Immutable.fromJS( state );
	imState = imState.setIn([ action.invoiceType,"status", [action.key] ], action.value );
	return imState.toJS();
}

function changeForm( state, action ){
	if( state[action.mode].postData[action. name ] === action.value ){
		return state;
	}
	let imData = Immutable.fromJS( state );
	imData = imData.setIn([ action.mode,"postData", action.name ], action.value );
	
	return imData.toJS();
}


function modalSelect( state, action ){
	if( state[action.selectType].content === action.obj.id ){
		return state;
	}
	let imState = Immutable.fromJS( state );
	imState = imState.setIn([ action.selectType,"content" ], action.obj.id );
	imState = imState.setIn([ action.selectType,"contentText" ], action.obj.text );
	return imState.toJS();
}

function selectAddress( state, data ) {
	let address={};
	address.receiver_region =  data.provinceName + data.cityName + data.districtName;
	address.receiver_addr = data.address;
	address.receiver_tel = data.phone;
	address.receiver_name = data.name;
	let imData = Immutable.fromJS( state );
	imData = imData.updateIn(["taxInvoice","postData"], ( data )=>{
		return Object.assign( data.toJS(),address);
	});
	return imData.toJS();
}

function invoiceSelect( state=initialState, action ){
	switch( action.type ){
		case 'resetState':
			return initialState;
		case 'updateState':
			return { ...state, update:true };
		case 'initialPage':
			return initialPage( state, action.data, action.invoice, action.action );
		case "changeType":
			return { ...state, invoiceType:action.invoiceType };
		case 'ctrlPrompt':
			return { ...state, prompt:{ ...action.prompt } };
		case 'popupNote':
			return { ...state,invoiceNote: action.status };
		case "changeStatus":
			return changeStatus( state, action );
		case 'modalCtrl':
			return { ...state, showModal:action.status };
		case 'selectAddress':
			return selectAddress( state, action.data );
		case "modalSelect":
			return modalSelect( state, action );
		case "changeForm":
			return changeForm( state, action );
		default:
			return state;
	}
}
export default createReducers("invoiceSelect",invoiceSelect,initialState );