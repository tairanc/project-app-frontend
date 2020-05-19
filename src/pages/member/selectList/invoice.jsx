import React, { Component } from 'react';
import { LoadingRound, Shady, PopupLoading } from 'component/common';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { concatPageAndType, actionAxios, actionAxiosAll } from 'js/actions/actions'
import { PopupTip } from 'component/modal';
import axios from 'axios';
import './invoice.scss';

const createActions = concatPageAndType('invoiceSelect');
const orderConfirmActions = concatPageAndType('orderConfirm');
const axiosActions = actionAxios('invoiceSelect');
const axiosAllActions = actionAxiosAll('invoiceSelect');

const mapInvoiceType = {
	"common":"NORMAL",
	"tax": "VAT",
	"electron":"ELEC"
};

const pageApi = {
	initPage:{ url:"/newapi/user/invoice/get", method:"get" },
	invoiceSave:{ url:"/newapi/user/invoice/save", method:"post"}
};

class Invoice extends Component{
	constructor( props, context ){
		super(props);
		document.title = "发票信息";
		if( context.isApp ) window.location.href = "jsbridge://set_title?title=发票信息";
	}
	static contextTypes = {
		router:React.PropTypes.object,
		isApp:React.PropTypes.bool
	};
	componentWillMount(){
		if( this.props.confirmLoad ){
			browserHistory.goBack();
			return;
		}
		this.props.dispatch( orderConfirmActions('setOrigin',{ origin:'invoice' }) );
		this.props.initialPage();
	}
	componentDidMount(){
		$(window).scrollTop(0);
	}
	render(){
		let { winHeight,invoiceSelData, invoiceType,commonInvoice, electronInvoice, taxInvoice, invoiceContent,showModal,invoiceNote, invoiceId } = this.props,
			{ changeType, changeStatus,  modalSelect, modalCtrl, changeForm, selectAddress } = this.props;
		
		return <div data-page="invoice-select" style={{ background:"#f4f4f4", minHeight:winHeight }}>
			{ this.props.load ? <LoadingRound/> : <form id="invoiceForm">
				{ this.props.update && <PopupLoading/> }
				<div className="invoice-note" onClick={ e => this.props.popupNote( true ) }> </div>
				{ invoiceNote && <PopupItem onClose={  e => this.props.popupNote( false ) } />}
				<input type="hidden" name="invoice_id" value={ invoiceId } />
				<InvoiceType data={ invoiceSelData } type={ invoiceType } changeType={ changeType } name="invoice_type" />
				{ invoiceType === "common" &&
					<CommonInvoice data={ commonInvoice }
					               changeStatus={ changeStatus.bind(null, "commonInvoice") }
					              modalCtrl={ modalCtrl }
					               modalSelect={ modalSelect.bind(null, invoiceType + "Invoice") }
					               contentList={ invoiceContent }
					               showModal={ showModal }
					               changeForm={ changeForm.bind( null,"commonInvoice") }/>
				}
				{ invoiceType === "electron" &&
					<ElectronInvoice data={ electronInvoice }
					                 changeStatus={ changeStatus.bind(null, "electronInvoice") }
					                modalCtrl={ modalCtrl }
					                 modalSelect={ modalSelect.bind(null, invoiceType + "Invoice") }
					                 contentList={ invoiceContent }
					                 showModal={ showModal }
					                 changeForm={ changeForm.bind( null,"electronInvoice") } />
				}
				{ invoiceType === "tax" &&
					<TaxInvoice data={ taxInvoice }
					            changeForm={ changeForm.bind( null,"taxInvoice") }
					            selectAddress={ selectAddress }/>
				}
				<SubmitBtn formSubmit={ this.props.formSubmit }/>
			</form>
			}
			<PopupTip  active={ this.props.prompt.show }
			           msg={ this.props.prompt.msg }
			           onClose={ this.props.promptClose } />
		</div>
	}
}

/*发票选择*/
class InvoiceType extends Component{
	getHtml(){
		let { data, type } = this.props;
		return data.map( ( item, i )=>{
			return <span onClick={ item.able && this.props.changeType.bind(this, item.type ) } className={`type-li ${ type=== item.type?"active":"" } ${ !item.able ?"disabled":""  }`} key={i} >
				{ item.text }
				</span>
		})
	}
	getText(){
		let { data, type } = this.props;
		if( type === "electron" ){
			return <div className="bottom">电子发票与纸制发票具备同等法律效力，可支持报销入账。</div>
		}
		if( type === "tax" ){
			return <div className="bottom">※ 增值税发票在订单完成后开票。</div>
		}
		
	}
	render(){
		return <div className="invoice-type">
			<div className="title">发票类型</div>
			<input type="hidden" name={ this.props.name } value={ mapInvoiceType[this.props.type] } />
			<div className="body">
				{ this.getHtml()}
			</div>
			{ this.getText() }
		</div>
	}
}

//普通发票
class CommonInvoice extends Component{
	render(){
	  let { data, changeStatus,  modalSelect, modalCtrl, contentList, showModal,changeForm } = this.props;
		return <div className="common-invoice">
			{/*<input type="hidden" name="user_id" value="" />*/}
			<InvoiceHeader postData = { data.postData } inputHolder="请输入发票抬头" headName="action" contentName="invoice_name" changeForm={ changeForm }   />
			<DivideLine/>
			<InvoiceContent modalSelect={ modalSelect } modalCtrl={ modalCtrl } postData={ data.postData } name="invoice_content"  />
			<InvoiceContentSelect modalSelect={ modalSelect } list={ contentList } selectId={ data.postData.invoice_content } modalCtrl={ modalCtrl } show={ showModal } />
			{ data.postData.action === 2 && <StripArray  data={ data.postData } status={ data.status } changeStatus = { changeStatus } changeForm={ changeForm } /> }
		</div>
	}
}


//电子发票
class 	ElectronInvoice extends Component{
	render(){
		let { data, changeStatus,  modalSelect, modalCtrl, contentList, showModal,changeForm } = this.props;
		return <div className="electron-invoice">
			<input type="hidden" name="user_id" value={ data.postData.user_id }/>
			<InvoiceHeader postData = { data.postData } inputHolder="请输入发票抬头" headName="action" contentName="invoice_name" changeForm={ changeForm }   />
			<DivideLine/>
			<InvoiceContent modalSelect={ modalSelect } modalCtrl={ modalCtrl } postData={ data.postData } name="invoice_content" />
			<InvoiceContentSelect modalSelect={ modalSelect } list={ contentList } selectId={ data.postData.invoice_content } modalCtrl={ modalCtrl } show={ showModal } />
			<div className="receiver-email">
				<StripInput text="*收票人邮箱" textHolder="用于接收电子发票" name="email" inputValue={ data.postData.email } inputChange={ changeForm.bind( this,"email")}   />
			</div>
			{ data.postData.action === 2 && <StripArray  data={ data.postData } status={ data.status } changeStatus={ changeStatus } changeForm={ changeForm } /> }
		</div>
	}
}

//增值税发票
class TaxInvoice extends Component{
	render(){
		let { data, selectAddress } = this.props;
		return <div className="tax-invoice">
			<input type="hidden" name="user_id" value={ data.postData.user_id }/>
			<InvoiceContent edit={false} contentText={ data.contentText }  postData={ data.postData } name="invoice_content" />
			<StripArrayTax changeForm={ this.props.changeForm } data={ data.postData }  />
			<InvoiceAddress data={ data.postData } selectAddress={ selectAddress }/>
		</div>
	}
}

//发票抬头
class InvoiceHeader extends Component{
	constructor(props){
		super(props);
		let invoiceName = props.postData[`invoice_name${props.postData.action}`];
		this.state ={
			inputValue:invoiceName !== undefined ? invoiceName: "",
			showClose: false
		}
	}
	componentWillReceiveProps( newProps ) {
		let invoiceName =  newProps.postData[`invoice_name${newProps.postData.action}`];
		this.setState({ inputValue: invoiceName !== undefined ? invoiceName: "" } )
	}
	closeChange = ( value )=>{
		this.setState({ showClose: value });
	};
	inputValueChange =( value, isGet, close )=> {
		this.setState({ inputValue: value });
		if( isGet ){
			this.props.changeForm( `invoice_name${this.props.postData.action}`, value.trim() );
		}
		if( close ){
			this.closeChange( false );
		}
	};
	render(){
		let { changeForm, postData, headName, contentName } = this.props;
		
		return <div className="invoice-header">
			<div className="title">*发票抬头</div>
			<input type="hidden" name={ headName } value={ postData.action } />
			<div className="check-grid">
				<div className="check-box" onClick={  e=> changeForm( "action", 1) } >
					<span className={`check-icon ${ postData.action === 1 ?"check":"" }`}> </span> 个人
				</div>
				<div className="check-box" onClick={  e=> changeForm( "action", 2) }>
					<span className={`check-icon ${ postData.action === 2 ?"check":"" }`}> </span> 单位
				</div>
			</div>
			<label className="input">
				<input type="text" name={contentName} placeholder={this.props.inputHolder} value={ this.state.inputValue } onFocus={ (e)=>this.closeChange( true )} onChange={ (e)=> this.inputValueChange( e.target.value )} maxLength="50" onBlur={ (e)=> this.inputValueChange( e.target.value, true, true ) } />
				{this.state.inputValue !=="" && this.state.showClose && <i className="grey-close-icon" onTouchTap={ (e)=>this.inputValueChange( "", true )} > </i> }
			</label>
		</div>
	}
}

/*分割线*/
const DivideLine =()=>(
	<div className="divide-line">
		<div className="line"> </div>
	</div>
);

/*发票内容*/
class InvoiceContent extends Component{
	static defaultProps ={
		edit: true
	};
	render(){
		return <div className="invoice-content g-row-flex">
			<div className="left">*发票内容</div>
			<input type="hidden" name={ this.props.name } value={ this.props.postData.invoice_content } />
			<div className="right g-col-1" onClick={ this.props.edit && this.props.modalCtrl.bind( null, true ) } >{ this.props.postData.contentText }
				{this.props.edit && <i className="arrow-btm-icon"> </i> }
			</div>
		</div>
	}
}

//条组
class StripArray extends Component{
	render(){
		let { status,changeStatus,changeForm, data } = this.props;
		return <div className="strip-array">
			<StripInput text="*纳税人识别码" textHolder="请输入纳税人识别码" inputValue={ data.taxpayer_idNumber } name="taxpayer_idNumber" inputChange={ changeForm.bind( this,"taxpayer_idNumber")} />
			 <div className={`more-info-grid ${ status.infoMore ? "active" : ""}`}>
				 <DivideLine/>
				 <StripInput text="注册地址" textHolder="请输入注册地址" inputValue={ data.reg_addr }  name="reg_addr" inputChange={ changeForm.bind( this,"reg_addr")} limitNum="100" />
				 <DivideLine/>
				 <StripInput text="注册电话" textHolder="请输注册电话" inputValue={ data.reg_tel }  name="reg_tel" inputChange={ changeForm.bind( this,"reg_tel")} />
				 <DivideLine/>
				 <StripInput text="开户银行" textHolder="请输入开户银行" inputValue={ data.open_bank }  name="open_bank" inputChange={ changeForm.bind( this,"open_bank")} />
				 <DivideLine/>
				 <StripInput text="银行账户" textHolder="请输入银行账户" inputValue={ data.bank_account }  name="bank_account" inputChange={ changeForm.bind( this,"bank_account")} />
			</div>
			<DivideLine/>
			<div className="more-info-click" onClick={ (e)=>changeStatus("infoMore",!status.infoMore ) } >更多单位信息 <i className={`arrow-btm-icon ${ status.infoMore?"active":"" }`}> </i></div>
		</div>
	}
}

class StripArrayTax extends Component{
	render(){
		let { changeForm, data } = this.props;
		return <div className="strip-array">
			<StripInput text="*单位名称" textHolder="请输入单位名称" inputValue={ data.unit_name } name="unit_name" inputChange={ changeForm.bind( this,"unit_name")} />
			<DivideLine/>
			<StripInput text="*纳税人识别码" textHolder="请输入纳税人识别码"  inputValue={ data.taxpayer_idNumber } name="taxpayer_idNumber" inputChange={ changeForm.bind( this,"taxpayer_idNumber")} limitNum="20" />
			<DivideLine/>
			<StripInput text="*注册地址" textHolder="请输入注册地址"  inputValue={ data.reg_addr } name="reg_addr" inputChange={ changeForm.bind( this,"reg_addr")} limitNum="100" />
			<DivideLine/>
			<StripInput text="*注册电话" textHolder="请输注册电话"  inputValue={ data.reg_tel } name="reg_tel" inputChange={ changeForm.bind( this,"reg_tel")} limitNum="20" />
			<DivideLine/>
			<StripInput text="*开户银行" textHolder="请输入开户银行" inputValue={ data.open_bank } name="open_bank" inputChange={ changeForm.bind( this,"open_bank")} />
			<DivideLine/>
			<StripInput text="*银行账户" textHolder="请输入银行账户"  inputValue={ data.bank_account } name="bank_account" inputChange={ changeForm.bind( this,"bank_account")} />
		</div>
	}
}

/*单条输入框*/
class StripInput extends Component{
	render(){
		let { text, limitNum, textHolder,inputChange,inputValue,name } = this.props;
		return <div className="one-strip g-row-flex">
			<div className="left">{text}</div>
			<div className="right g-col-1">
				<input type="text" name={ name } maxLength={ limitNum ? limitNum: 50 } placeholder={ textHolder ? textHolder :"" } onBlur={ (e)=> inputChange && inputChange( e.target.value ) } defaultValue={ inputValue } />
			</div>
		</div>
	}
}

class InvoiceAddress extends Component{
	componentWillMount(){
		window.onAddressResult= (data) =>{
			this.props.selectAddress( JSON.parse(data) );
		}
	}
	componentWillUnmount(){
		window.onAddressResult = null;
	}
	render(){
		let { data } = this.props;
		let address = data.receiver_addr && data.receiver_region && data.receiver_tel && data.receiver_name;
		return <div className="invoice-address">
			<div className="top">*收票地址</div>
			{ address ? <div>
					<input type="hidden" name="receiver_region" value={ data.receiver_region }/>
					<input type="hidden" name="receiver_addr" value={ data.receiver_addr }/>
					<input type="hidden" name="receiver_tel" value={ data.receiver_tel }/>
					<input type="hidden" name="receiver_name" value={ data.receiver_name }/>
			</div>:""
			}
			<DivideLine/>
			<a href="trmall://getAddressInfo" className="address-select g-row-flex g-col-mid g-col-ctr">
				<div className="left-icon">
					<i className="location-address-icon"> </i>
				</div>
				{address?
					<div className="content-text g-col-1">
						<div className="text-top g-row-flex">
							<span className="g-col-1">收货人：{data.receiver_name}</span><span className="user-phone">{data.receiver_tel }</span>
						</div>
						<div className="text-bottom">收货地址：{data.receiver_region }{ data.receiver_addr}</div>
					</div> :
					<div className="g-col-1 c-fs15">
						请填写收货地址
					</div>
				}
				<div className="right-icon">
					<i className="arrow-right-icon"> </i>
				</div>
			</a>
		</div>
	}
}

/*发票内容选择*/
class InvoiceContentSelect extends Component{
	getList =()=>{
		 return this.props.list.map( ( list,i )=>{
		 	 return <div className="select-li g-row-flex" key={i} onClick={ this.props.modalSelect.bind( null,list )} >
				   <div className="left g-col-1">{ list.text }</div>
				   <div className="right"><span className={`check-icon ${this.props.selectId === list.id ?"check":""}`}> </span></div>
			   </div>
		 })
	}
	render(){
		return <div onClick={ this.props.modalCtrl.bind( null, false )}>
			{ this.props.show && <Shady /> }
			<div className={`modal-select ${ this.props.show ? "active":""}`} onClick={ e=>e.stopPropagation()}>
				<div className="title">发票内容</div>
				<div className="select-list">
					{ this.getList() }
				</div>
				<div className="coupon-btm" onClick={ this.props.modalCtrl.bind( null, false ) } >
					<div className="close-btn">
						关闭
					</div>
				</div>
			</div>
		</div>
	}
}

/*提交按钮*/
class SubmitBtn extends Component{
	render(){
		return <div className="submit-btn">
			<div className="red-btn" onClick={ this.props.formSubmit } >确认</div>
		</div>
	}
}

class PopupItem extends Component{
	componentDidMount() {
		$("html,body").css({ height:"100%",overflowY:"hidden" })
	}
	
	componentWillUnmount() {
		$("html,body").css({ height:"auto", overflowY:"auto" })
	}
	render(){
		return <div onClick={  this.props.onClose }>
			<Shady option={{zIndex:108}} />
			<div className="note-popup" >
				<div className="popup-body" onClick={ (e)=>{ e.stopPropagation() }}>
					<h3><p>发票须知</p></h3>
					<div className="list">
						<p>1、使用活动赠送的小泰e卡（活动卡）支付的订单不支持开具发票；</p>
						<p>2、跨境保税、海外直邮商品属于跨境海外商品，不支持开具国内发票；</p>
						<p>3、如选择公司抬头的发票需提供纳税人识别号；</p>
						<p>4、电子普通发票的法律效力、基本用途及使用规定同纸质普通发票，可用于报销入账、售后维权等。如需纸质发票可自行下载打印。</p>
					</div>
				</div>
				<div className="popup-bottom">
					<i className="close-l-x-icon" > </i>
				</div>
			</div>
		</div>
	}
}

const formCheck = {
	checkObject( obj, validateArr ){
		let result = { status: true, msg:""};
		validateArr.every( ( v, i )=>{
			if( !v.validate || ( ( obj[v.key] ==="" ||  obj[v.key] === undefined ) && !v.require ) ){
				return result;
			}
			if( !v.validate( obj[ v.key ], v.require ) ){
				result = { status:false, msg:v.msg };
				return false;
			}
			return true;
		});
		return result;
  },
	isEmpty( value ){
		if( value === undefined || value.trim() ==="" ){
			return false;
		}
		return true;
	},
	telCheck( value, require ){
		value = value !== undefined ? value.trim():"";
		if( value === "" && require ){
			return false;
		}
		if( !(/^[0-9\-]+$/g ).test( value ) ){
			return false;
		}
		return true;
	},
	character( value ){
	
	},
	characterNum( value, require ){
		value = value !== undefined ? value.trim():"";
		if( value === "" && require ){
			return false;
		}
		if( !(/^[\u4e00-\u9fa5|0-9]+$/g).test( value ) ){
			return false;
		}
		return true;
	},
	numberCheck( value, require ){
		value = value !== undefined ? value.trim():"";
		if( value === "" && require ){
			return false;
		}
		if( !(/^[0-9]+$/g ).test( value ) ){
			return false;
		}
		return true;
	},
	emailCheck:function ( value ) {
		if( !( /^([a-zA-Z0-9_\.\-])+\@[a-zA-Z0-9]+\.com$/g).test( value ) ){
			return false;
		}
		return true;
	},
	isObject( value ){
		if( typeof value ==="object" && value !== null ){
			return true;
		}
		return false;
	}
};

const invoiceValidate = {
	common:{
		"1":[
		{ key:"invoice_name1", validate: formCheck.isEmpty, require: true, msg:"请输入发票抬头" }
	],
		"2":[
			{ key:"invoice_name2", validate: formCheck.isEmpty, require: true, msg:"请输入发票抬头" },
			{ key:"taxpayer_idNumber", validate: formCheck.isEmpty, require: true, msg:"请输入纳税人识别码" },
			{ key:"reg_addr", validate: "", require: false, msg:"请输入正确的地址" },
			{ key:"reg_tel", validate: formCheck.telCheck, require: false, msg:"请填写正确的注册电话"},
			{ key:"open_bank", validate: formCheck.characterNum ,  require: false, msg:"请填写正确的开户银行"},
			{ key:"bank_account", validate: formCheck.numberCheck ,  require: false, msg:"请填写正确的银行账户"}
		],
	},
	electron: {
		"1":[
			{ key:"invoice_name1", validate: formCheck.isEmpty, require: true, msg:"请输入发票抬头" },
			{ key:"email", validate: formCheck.emailCheck, require: true, msg:"请填写正确的收票人邮箱" },
		],
		"2":[
			{ key:"invoice_name2", validate: formCheck.isEmpty, require: true, msg:"请输入发票抬头" },
			{ key:"email", validate: formCheck.emailCheck, require: true, msg:"请填写正确的收票人邮箱" },
			{ key:"taxpayer_idNumber", validate: formCheck.isEmpty, require: true, msg:"请输入纳税人识别码" },
			{ key:"reg_addr", validate: "", require: false, msg:"请输入正确的地址" },
			{ key:"reg_tel", validate: formCheck.telCheck, require: false, msg:"请填写正确的注册电话"},
			{ key:"open_bank", validate: formCheck.characterNum ,  require: false, msg:"请填写正确的开户银行"},
			{ key:"bank_account", validate: formCheck.numberCheck ,  require: false, msg:"请填写正确的银行账户"}
		],
	},
	tax:[
		{ key:"unit_name", validate: formCheck.isEmpty,  require: true, msg:"请输入单位名称" },
		{ key:"taxpayer_idNumber", validate: formCheck.isEmpty,  require: true, msg:"请输入纳税人识别码" },
		{ key:"reg_addr", validate: formCheck.isEmpty,  require: true, msg:"请输入注册地址" },
		{ key:"reg_tel", validate: formCheck.telCheck, require: true,  msg:"请输入正确的电话" },
		{ key:"open_bank", validate: formCheck.isEmpty,  require: true, msg:"请输入正确的银行名称" },
		{ key:"bank_account", validate: formCheck.numberCheck,  require: true, msg:"请输入正确的账户" },
		{ key:"receiver_addr", validate: formCheck.isEmpty,  require: true, msg:"请选择收票地址" },
		{ key:"receiver_name", validate: formCheck.isEmpty,  require: true, msg:"请选择收票地址" },
		{ key:"receiver_region", validate: formCheck.isEmpty,  require: true, msg:"请选择收票地址" },
		{ key:"receiver_tel", validate: formCheck.isEmpty,  require: true, msg:"请选择收票地址" },
	]
};




function invoiceState( state, props ) {
	return {
		...state.global,
		...state.invoiceSelect,
		confirmLoad:state.orderConfirm.load
	}
}

function invoiceDispatch( dispatch, props ) {
	let { shop_ids, invoice, action } =  props.location.query;
	return {
		dispatch,
		//提示框关闭
		promptClose:()=>{
			dispatch( createActions('ctrlPrompt',{ prompt:{ show:false, msg:"" } }) );
		},
		changeType:( type )=>{
	 	  dispatch( createActions("changeType", { invoiceType: type }  ) )
	 },
		changeStatus:( type, key, value ) =>{
			dispatch( createActions("changeStatus", { invoiceType:type, key:key, value:value } ) )
		},
		modalCtrl:( status )=>{
	 	  dispatch( createActions('modalCtrl', { status: status }));
		},
		modalSelect:( type,obj )=>{
	 	 dispatch( createActions('modalSelect',{ selectType: type, obj: obj } ));
			dispatch( createActions('modalCtrl', { status: false }));
		},
		changeForm(  mode, name ,value ){
			dispatch( createActions("changeForm",{ mode, name, value }));
		},
		selectAddress: (data)=>{
			dispatch(createActions('selectAddress', {data: data}));
		},
		popupNote:( status )=>{
			dispatch(createActions('popupNote', { status: status } ));
		},
		initialPage: ()=>{
			dispatch( createActions('updateState') );
			axios.request({ ...pageApi.initPage,
				params:{ shop_id: shop_ids }
			}).then( result =>{
				dispatch( createActions('initialPage',{ data: result.data, invoice, action:+action } ))
			}).catch( error =>{
				console.error( error );
			})
		}
	}
}

function invoiceProps( stateProps, dispatchProps, props ) {
	let request = false;
	let { dispatch } = dispatchProps;
	return {
		...stateProps,
		...dispatchProps,
		...props,
		formSubmit:()=>{
			if( request ) return;
			request = true;
			let fromData = stateProps[ stateProps.invoiceType+"Invoice"].postData;
			let result = { status:true, msg:""};
			if( stateProps.invoiceType === "tax" ){
				result = formCheck.checkObject( fromData, invoiceValidate[ stateProps.invoiceType ] );
			}else{
				result = formCheck.checkObject( fromData, invoiceValidate[ stateProps.invoiceType][ fromData.action ] );
			}
			if( !result.status ){
				dispatch( createActions("ctrlPrompt",{ prompt:{ show:true, msg: result.msg } } ));
				request = false;
				return;
			}
			/*console.log( "pass" );
			request = false;
			return;*/
			axios.request({ ...pageApi.invoiceSave,
				data:$("#invoiceForm").serialize()
			}).then( result =>{
				request = false;
				let data = result.data;
				if( !data.status ){
					dispatch( createActions("ctrlPrompt",{ prompt:{ show:true, msg: data.msg } } ));
					return;
				}
				let postData = stateProps[stateProps.invoiceType+"Invoice"].postData;
				dispatch( orderConfirmActions('selectInvoice',{
					invoice: mapInvoiceType[stateProps.invoiceType],
					action: postData.action,
					unitName: postData.unit_name,
					invoiceName: postData[`invoice_name${ postData.action }`]
				}) );
				browserHistory.goBack();
			}).catch( error =>{
				dispatch( createActions("ctrlPrompt",{ prompt:{ show:true, msg: "小泰发生错误，请稍后再试~" } } ));
				console.error( error );
			})
		}
	}
}

export default connect( invoiceState, invoiceDispatch, invoiceProps )(Invoice);