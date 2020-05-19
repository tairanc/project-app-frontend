import createReducers from './createReducers.js';
import Immutable from 'immutable';

let initialState ={
	load: true,
	data: "",
	from:"",
	md5: "",
	address:{ id: "", data: "", name:"" },
	identify:{ id: "", data: "", needId:"",name:"",has:true },
	mode: "",
	buyType:0,
	agree: true,
	invoiceReady:false,
	invoice:{
		enabled:false,
		status:false,
		tip:false,
		text:"个人-普通",
		type:"NORMAL",
		action:1,
		name:"个人"
	},
	disTop:0,
	invoiceItem:"",
	buyMessage: {},
	shopIdArr:[],
	showOffline:false,
	couponShow:false,//优惠券弹窗
	totalShow:false,//总额弹窗
	redPacketShow:false, //红包弹窗
	invoiceItemShow:false,//发票商品弹窗
	//优惠券
	couponList:{
		num:0,
		list:"",
	},
	//优惠券选择
	couponSelect:{
		code:"",
		limit:"",
		desc:""
	},
	//红包
	redPacketList:{
		num:0,
		list:"",
		all: "",
	},
	//支付类型
	payType:{
		show:false,
		type:"online"
	},
	//提示框
	prompt:{
		show:false,
		msg:""
	},
	errorPage: false, //初始化错误
	emptyAddress: false, //空地址
	diffNameModal: false, //身份证与地址名字不同
	alterationModal: false, //信息变动弹窗
	invoiceModal:false, //开具发票时显示提示
	redSelectModal:{
		show: false,
		msg: ""
	}, //红包报错时提示
};

function initialData( state, data, mode, buyType ){
	let imData = Immutable.fromJS( state );
	imData = imData.set("load",false );
	if( mode ) imData = imData.set("mode",mode );
	if( buyType ) imData = imData.set("buyType", Number(buyType)?1:0 );
	if( data.md5CartInfo ) imData = imData.set("md5",data.md5CartInfo );
	if( data.shop_ids && data.shop_ids.length ) imData = imData.set("shopIdArr", data.shop_ids );
	imData = imData.set("showOffline", data.showOffline );

	if( !imData.get("invoiceReady") ){
		imData = imData.set("invoiceReady", true );
		imData = imData.set("invoiceItem", data.disabled_invoice_items );
		imData = imData.setIn(["invoice","enabled"], !!data.invoice_enabled );
	}
	
	imData = imData.set("data", data.order );
	
	if( data.order.addressInfo ){
		imData = imData.set("address",{
			id:data.order.addressInfo.addr_id,
			data: data.order.addressInfo,
			name: data.order.addressInfo.name
		});
	}
	imData = imData.setIn(["identify","needId"], data.order.isNeedCard );
	if( data.order.isNeedCard && data.idCard && data.idCard.data && data.idCard.data.length ){
		let idCard;
		data.idCard.data.some((item, i) => {
			if (data.idCard.defaultCardId === item.card_id) {
				idCard = item;
				return true;
			}
			return false;
		});
		if (idCard) {
			imData = imData.set("identify", {
				needId: data.order.isNeedCard,
				id: idCard.card_id,
				name: idCard.name,
				data: idCard,
				has:true
			})
		}
	}

	return imData.toJS();
}

//红包过滤
function redPacketFilter( cart, data, limit ) {
	data = data ? data:[];
	let redPacket = {
		list: [],
		all: data,
		num:0,
		limit: limit
	};
	
	//红包价格过滤
	let itemPrices = {
		Internal:0,
		Normal: 0,
		Virtual:0,
	};
	if( cart && cart.length ){
		cart.forEach(( shop )=>{
			let cartPrice = {};
			let items = shop.object;
			if( shop.exchange ){
				items = items.concat(shop.exchange);
			}
			items.forEach( (item, i)=>{
				if( item.obj_type !== "zero_buy" && !item.no_store && item.good_type in itemPrices ){
					let price =( item.promotion && item.promotion.promotion_price ) ?
						item.promotion.promotion_price :
						( (item.marks && item.marks.business &&  Object.keys(item.marks.business.rules)[0] <= item.quantity ) ?
								item.marks.business.sell_price :
								item.price
						);
					
					price = price * item.quantity;
					cartPrice[item.cart_id] = {
						price:price,
						type:item.good_type
					}
				}
			});
			shop.repo_group.length && shop.repo_group.forEach(( group )=>{
				group.items.length && group.items.forEach( (item )=>{
					cartPrice[item.cart_id].price += +item.total_dlyfee;
					cartPrice[item.cart_id].price += +item.total_tax;
					cartPrice[item.cart_id].price -= +item.total_discount_coupon_platform;
					cartPrice[item.cart_id].price -= +item.total_discount_coupon_shop;
					cartPrice[item.cart_id].price -= +item.total_discount_promotion;
				})
			});
			/*if( shop.promotion && shop.promotion.length ){
				shop.promotion.forEach( ( promotion )=>{
					let discountArr = promotion.promotion_item;
					let keys = Object.keys( discountArr );
					keys.forEach( ( id, i)=>{
						cartPrice[id].price -= discountArr[id].discount_price;
					})
				})
			}*/
			let prices = Object.keys( cartPrice );
			prices.forEach( ( id, i)=>{
				itemPrices[ cartPrice[id].type ] += cartPrice[id].price;
			})
			
		})
	}
	
	console.log( itemPrices );
	
	data.forEach( ( li )=>{
		let limitPrice = 0;
		let platStr = li.rules.used_item_type;
		if( platStr === "all" ){
			limitPrice = itemPrices.Internal + itemPrices.Normal + itemPrices.Virtual;
		}else{
			let platform = platStr.split(",");
			limitPrice =  platform.reduce( ( prev, next )=>{
				return prev + itemPrices[next]
			},0 );
		}
		
		if( limitPrice > li.deduct_money ) {
			redPacket.list.push( li );
		}
	});
	redPacket.num = redPacket.list.length;
	return redPacket;
}

function initCoupon( state, result ) {
	let couponList = {
		list: result.data.coupons ? result.data.coupons: [],
		num:  result.data.coupons ?  result.data.coupons.length : 0,
	};
	
	let redPacket = redPacketFilter( state.data.cart, result.data.redPackets, +result.data.packet_limit_num );
	
	return {...state, couponList, redPacketList: redPacket };
}


function filterRed( state, list ) {
	let imData = Immutable.fromJS( state );
	imData = imData.updateIn( ["redPacketList", "list"],( redList )=>{
		redList = redList.toJS();
		return  redList.map( ( item, i)=>{
			if(  list.used.indexOf( item.coupon_code) > -1 ){
				item.check = true;
			}else{
				item.check = false;
			}
			
			if( list.used.indexOf( item.coupon_code) > -1 || list.unused.indexOf(  item.coupon_code ) > -1 ){
				item.disabled = false;
			}else{
				item.disabled = true;
			}
			
			return item;
		})
		
	})
	return imData.toJS();
}

function resetRedPacket( state ) {
	return { ...state, redPacketList: redPacketFilter( state.data.cart, state.redPacketList.all, state.redPacketList.limit ) };
}

function equalName( state ) {
	let imData = Immutable.fromJS( state );
	imData = imData.set("diffNameModal",false );
	let idName = imData.getIn(["identify","name"]);
	imData = imData.setIn(["address","name"], idName );
	return imData.toJS();
}

function selectIdentify( state, data ) {
	let imData = Immutable.fromJS(state);
	imData = imData.setIn(['identify', 'id'], data.cardId );
	imData = imData.setIn(['identify', 'name'], data.name);
	data.idnumber = data.idNumber;
	imData = imData.setIn(['identify', 'data'], data);
	return imData.toJS();
}

function selectAddress( state, data ) {
	data.area_string = data.provinceName + data.cityName + data.districtName;
	data.addr = data.address;
	data.mobile = data.phone;
	return { ...state, address:{ id:data.addressId, data: data , name: data.name } };
}

function redSelect( state, arr ) {
	let imData = Immutable.fromJS( state );
	arr.forEach(( index )=>{
		imData = imData.setIn(["redPacketList","list", index, "check" ], !state.redPacketList.list[index].check  );
	})
	return imData.toJS();
}

function redClear( state ) {
	let imData = Immutable.fromJS( state );
	imData = imData.updateIn(["redPacketList","list"],( list )=>{
		return list.map( item=>{
			 return item.set("check", false );
		})
	})
	return imData.toJS();
}

const dataToStr = {
	typeToStr: {
		NORMAL:"普通",
		ELEC:"电子"
	}
};

function infoToStr( type, head, unit ) {
	if( type === "VAT"){
		return unit+"-增值税";
	}
	return head + "-"+ dataToStr.typeToStr[ type ];
}


function updateInvoice( state, type, action, invoiceName, unitName ) {
	let imData = Immutable.fromJS( state );
	imData = imData.setIn(["invoice", "type"], type );
	imData = imData.setIn(["invoice", "action"], action );
	imData = imData.setIn(["invoice", "text"],infoToStr( type, invoiceName,unitName ) );
	imData = imData.setIn(["invoice", "name"], invoiceName );
	return imData.toJS();
}

function toggleInvoice( state ) {
	let invoice = state.invoice;
	if( !invoice.status ){
		invoice = { ...invoice, status: !invoice.status };
		return { ...state,invoiceModal:true, invoice: invoice };
	}else{
		invoice = { ...invoice, status: !invoice.status };
		return { ...state, invoice: invoice };
	}
	
}

function orderConfirm( state = initialState, action ) {
	switch ( action.type ){
		case 'resetState':
			return initialState;
		case 'initialData':
			return initialData( state, action.result, action.mode, action.buyType );
		case 'addMessage':
			return { ...state, buyMessage:{ ...state.buyMessage, [action.id]: action.value } };
			
		case 'couponData':
			return initCoupon( state, action.result );
		
		case 'couponPopup':
			return { ...state, couponShow: action.status };
		case 'selectCoupon':
			return { ...state, couponSelect:action.coupon, couponShow: false };
		case 'resetCoupon':
			return { ...state,couponSelect:{code: "", limit: "", desc: ""} };
			
			
		case 'paymentPopup':
			return { ...state,payType:{ ...state.payType, show: action.status } };
		case 'paymentSelect':
			return { ...state,payType:{ show:false, type: action.status } };
			
		case 'totalPopup':
			return { ...state, totalShow: action.status };
		
		case 'redPacketPopup':
			return { ...state, redPacketShow: action.status };
		case 'filterRed':
			return filterRed( state, action.data );
		case 'redSelect':
			return redSelect( state, action.selectArr );
		case 'redClear':
			return redClear( state );
		case 'resetRedPacket':
			return resetRedPacket( state );
		
		case 'ctrlPrompt':
			return { ...state, prompt:{ ...action.prompt } };
		case 'ctrlModal':
			return { ...state, [ action.modal ]: action.status };
		case 'invoiceModal':
			return { ...state, invoiceModal: false };
		case 'redSelectModal':
			return { ...state, redSelectModal:{ ...action.modal } };
		case 'setOrigin':
			return { ...state, from: action.origin };
		case 'saveTop':
			return { ...state,disTop: action.value };
		case 'selectIdentify':
			return selectIdentify( state, action.data );
		case 'selectAddress':
			return selectAddress( state, action.data );
		case 'selectInvoice':
			return updateInvoice( state,action.invoice, action.action, action.invoiceName, action.unitName );
		case 'agreeChange':
			return { ...state, agree: !state.agree };
		case 'toggleInvoice':
			return toggleInvoice( state );
		case 'equalName':
			return equalName( state );
		default:
			return state;
	}
}

export default createReducers("orderConfirm",orderConfirm,initialState );