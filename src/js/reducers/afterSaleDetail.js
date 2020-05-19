import createReducers from './createReducers.js';

const initialState ={
	load:true,
	data:"",
	modal:{
		show:false,
		msg:"",
		modalSure:""
	},
    btnFlag:true
};

function afterSaleDetail( state=initialState, action ){
	switch( action.type ){
		case 'resetData':
			return initialState;
		case 'getDataSuccess':
			return { ...state, load:false, data:action.result.data };
		case 'ctrlModal':
			return { ...state, modal:{ ...action.modal } };
		case 'changebtnFlag':
			return{...state,btnFlag:action.btnFlag};
		default:
			return state;
	}
}
export default createReducers("afterSaleDetail",afterSaleDetail,initialState );