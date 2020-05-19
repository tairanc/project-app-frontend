import React, { Component } from 'react';
import {LoadingRound,EmptyPage,TransShady} from 'component/common';
import { Link } from 'react-router';
import $ from 'n-zepto';
import { PopupModal, PopupTip } from 'component/modal';
import { delay } from 'js/common/utils.js';
import {RNDomain} from 'src/config/index'

import 'src/scss/shopCart.scss';

const cartCtrl={
	init:{url:"/originapi/cart/init", type:"get"},
	remove:{url:"/originapi/cart/remove", type:"post"},
	update:{url:"/originapi/cart/update", type:"post"},
	pick:{url:"/originapi/cart/pick", type:"post"},
	clear:{url:"/originapi/cart/remove/disable",type:"post"},
	collect:{url:"/originapi/cart/move/collect",type:"post"},
	submit:{url:"/originapi/cart/check",type:"get"}
};

const tipActionCreator =function( msg ){
	return {
		type:"POPUP",
		popType:"msgTip",
		data:{msg:msg}}
};

const popupActionCreator = function( msg,cb){
	return {
		type:"POPUP",
		popType:"modal",
		data:{
			msg:msg,
			cb:cb
		}
	}
};

const loadActionCreator = function ( status ) {
	return {
		type:"POPUP",
		popType:status?"load":"",
		data:""
	}
}

//购物车主组件
export default class ShoppingCart extends Component{
  constructor(props,context ) {
    super(props);
    this.state = {
	    data:"",
	    update:false
    };
	  document.title="购物袋";
	  if( context.isApp ) window.location.href = "jsbridge://set_title?title=购物袋";
  };
	static contextTypes ={
		store:React.PropTypes.object,
		isLogin:React.PropTypes.bool,
		isApp:React.PropTypes.bool
	};
	//更新check
	updateCheck=( data )=>{
		//店铺级的check
		if( data.valid_items.length ) {
			data.cartCheck = data.valid_items.reduce(function (preCheck, store,i) {
				store.storeCheck = store.activity.every(function (act) {
					return act.items.every(function (item) {
						return item.is_checked
					});
				});
				return store.storeCheck && preCheck
			}, true);
		}else{
			data.cartCheck = false;
		}
		//购物车数量
		let number = 0;
		if( data.valid_items.length ){
			data.valid_items.forEach( ( list, i)=>{
				list.activity.forEach( ( item,j) =>{
					Array.isArray( item.items ) ? number+=item.items.length:"";
				})
			})
		}
		if( data.invalid_items.length ){
			number += data.invalid_items.length;
		}
		 number ? document.title=`购物袋(${number})`:document.title="购物袋";
		if(this.context.isApp )window.location.href = `jsbridge://set_title?title=购物袋${number?`(${number})`:""}`;
		return data;
	};
	//获取check的商品
	handleGetCheck=( type, dataArr )=>{
		let cartData = this.state.data.valid_items;
		let checkData = {};
		const typeData ={
			"php":function( arr,data ){
				 arr.forEach(function( item){
					checkData[item+"["+data[item]+"]"] = data[item];
				})
			}
		};
		cartData.forEach(function(sotre){
			sotre.activity.forEach(function(act){
				act.items.forEach(function(item){
					if( item.is_checked ){
						typeData[type]( dataArr,item );
					}
				});
			});
		});
		return checkData;
	};
	//批量删除商品
	handleRemoves=( num )=>{
		const {store} = this.context;
		if( !num ){
			store.dispatch( tipActionCreator("您还没有选择商品哦") );
			return;
		}
		let removeData = this.handleGetCheck( "php",["cart_id"] );
		store.dispatch( popupActionCreator( `确定将这${num}件商品删除？`, function(){ store.dispatch({type:"SHOP_CART", update:true, data:removeData, ctrl:"remove", msg:true}); })  );
	};
	//购物车全选
	handleCheck =()=>{
		const { store } = this.context;
		const self = this;
		let data = this.state.data;
		let status = Number( !data.cartCheck );
		let sendData ={};
		data.cartCheck = status;
		if( data.valid_items && data.valid_items.length ){
			data.valid_items = data.valid_items.map(function(store,i) {
				store.storeCheck = status;
				store.activity.map(function (activity) {
					activity.items.map(function (item) {
						sendData['cart_id[' + [item.cart_id] + ']'] = status;
						return item.is_checked = status;
					});
					return activity;
				});
				return store;
			});
		}
		self.setState({ data: data });
		store.dispatch({
			type:"SHOP_CART",
			update:true,
			data:sendData,
			ctrl:"pick"
		});
	};
	//批量移入收藏夹
	handleCollects=( num )=>{
		const {store} =this.context;
		if( !num ){
			store.dispatch(tipActionCreator("您还没有选择商品哦"));
			return;
		}
		let collectData = this.handleGetCheck( "php",["item_id","cart_id"] );
		store.dispatch(
			popupActionCreator("当前选中的商品移入收藏夹成功后，将从购物袋删除哦。",
				()=>{ store.dispatch({type:"SHOP_CART", update:true, ctrl:"collect", data:collectData, msg:true});
			})
		)
	};
	componentDidMount() {
		$(this.refs.shopCart).css({minHeight:$(window).height()});
		let self = this;
		//更新数据
		const { store } = this.context;
		this.unSubscribe =store.subscribe(()=>{
			let state = store.getState().initial;
			if( state.type ==="SHOP_CART" && state.update ){
				if(state.ctrl !== "init") store.dispatch(loadActionCreator(true));
				let config = cartCtrl[ state.ctrl ];
				$.ajax({
					url: config.url ,
					type:config.type,
					data:state.data,
					success:function(result){
						store.dispatch(loadActionCreator(false));
						//status为是否提醒
						if( !result.status ){
							store.dispatch( tipActionCreator(result.msg) );
						}
						//data 为是否更新数据
						if( result.data ){
							let updateData = self.updateCheck( result.data );
							self.setState({
								data:updateData,
								update:true
							});
							if( state.msg ){
								store.dispatch( tipActionCreator(result.msg) );
							}
						}
					},
					error:function( xhr ){
						store.dispatch(loadActionCreator(false));
						store.dispatch( tipActionCreator("服务器发生错误，请稍后再试") );
					}
				});
			}
		});
		store.dispatch({type:"SHOP_CART",update:true,ctrl:"init",msg:false });
	}
	componentWillUnmount() {
		this.unSubscribe();
	}
	render(){
		const {data} = this.state;
		const hasData = data && (data.valid_items.length || data.invalid_items.length);
		return(
			<div ref="shopCart" className="c-bgf4">
				{this.state.update?
					( hasData?
						<form data-page="shop-cart" id="shopCart" >
							<CartBody data={this.state.data} key="cart-body"/>
							<CartTotal data={this.state.data} handleCheck={this.handleCheck } handleRemoves={ this.handleRemoves } handleCollects={this.handleCollects} key="cart-total"/>
						</form>:
							<EmptyPage config={{
							msg:"购物袋没有商品哦",
							btnText:"去逛逛",
							link:"trmall://main?page=home",
							bgImgUrl:"/src/img/shopCart/cart-noitem.png"
							}} />
					) :<LoadingRound />
				}
				<PopupCtrl />
			</div>
		)
	}
}

//购物车body
export class CartBody extends Component{
	static contextTypes ={
		store:React.PropTypes.object
	};
	//清空失效商品
	handdleClear=()=>{
		const {store} = this.context;
		store.dispatch({
			type:"SHOP_CART",
			update:true,
			ctrl:"clear",
			msg:true
		});
	};
	render(){
		const {data} = this.props;
		const valHtml = data.valid_items.map(function( item, i ){
			return <CartStore key={i} data={item} invalid={false} />;
		});
		const invHtml =data.invalid_items.map(function(item, i){
			return <OneItem key={i} data={item} invalid={true} />;
		});
		return(
			<div className="cart-body">
				<div className="cart-val">
					{valHtml}
				</div>
				{ !!data.invalid_items.length &&
				<div className="cart-inv">
					{invHtml}
					<div className="clear-inv">
						<a href="javascript:;" onClick={this.handdleClear } >清空失效商品</a>
					</div>
				</div>
				}
			</div>
		)
	}
}

//购物车store
export class CartStore extends Component{
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
    	edit:false,
	    data:props.data
    };
  }
  componentWillReceiveProps(props){
  	this.setState({ data:props.data });
  }
	static contextTypes ={
		store:React.PropTypes.object
	};
	handleEdit=()=>{
		const { store } = this.context;
		this.setState({
			edit:!this.state.edit
		});
		store.dispatch({
			type:"SHOP_CART",
			editChange:true,
			edit:!this.state.edit
		})
	};
	handleCheck =()=>{
		const { store } = this.context;
		let { data } = this.state;
		let status =Number(!data.storeCheck);
		let sendData ={};
		data.storeCheck = status;
		data.activity = data.activity.map( function( activity){
			activity.items = activity.items.map(function( item ){
				sendData['cart_id['+[item.cart_id]+']'] = status ;
				item.is_checked = status;
				return item;
			});
			return activity;
		});
		this.setState({ data:data });
		store.dispatch({
			type:"SHOP_CART",
			update:true,
			data:sendData,
			ctrl:"pick"
		});
	};
	componentWillUnmount() {
		const { store } = this.context;
		const { edit } = this.state;
		if( edit ){
			store.dispatch({
				type:"SHOP_CART",
				editChange:true,
				edit:false
			});
		}
	}
	render(){
		const {data} = this.state;
		const showTip = data.over_buy_limit;
		return(
			<section className="cart-store c-mb10 c-bgfff ">
				<CartStoreHeader handleEdit={ this.handleEdit } data={data} edit={this.state.edit} handleCheck={this.handleCheck }/>
				<CartStoreBody data={data.activity } edit={this.state.edit} shopId={ data.shop_id } />
				<CartStoreTotal data={ data.totalCart }/>
				{showTip?<CartStoreTip />:""}
				{showTip?
					[<span className="warn-border border-top" key="border-top"> </span>,
					<span className="warn-border border-btm" key="border-btm"> </span>,
					<span className="warn-border border-left" key="border-left"> </span>,
					<span className="warn-border border-right" key="border-right"> </span>
					] :""
				}
			</section>
		)
	}
}
//购物车store 头部
export class CartStoreHeader extends Component{
	render(){
		const {data,edit} = this.props;
		return(
			<div className="store-header">
				<div className="store-ckbox">
					<CheckIcon isCheck={data.storeCheck } handleCheck={ this.props.handleCheck } />
				</div>
				<div className="store-name"><i className="store-icon"> </i> { data.shop_alias_name || data.shop_name} </div>
				<div className="store-edit" onClick={ this.props.handleEdit }><span>{edit?"完成":"编辑"}</span></div>
			</div>
		)
	}
}
//购物车store body
export class CartStoreBody extends Component{
	render(){
		const { edit,data,shopId }= this.props;
		const html = data.map(function(item,i){
				return <StoreMarket edit={edit} key={i} data={item} shopId={ shopId } />;
		});
		return(
			<div className="store-body">
				{html}
			</div>
		)
	}
}
//购物车store 提示
class CartStoreTip extends Component{
	render(){
		return(
			<div className="store-tip">
				<span>※</span> 抱歉，海外直邮类和跨境保税类商品总价超过限额¥2000，请分多次购买。
				<i className="trig-top-icon"> </i>
			</div>
		)
	}
}

//购物车store 综合
class CartStoreTotal extends Component{
	render(){
		const {data} = this.props;
		return(
			<div className="store-total c-tr">
				<p className="c-fs14">合计(不含税)：¥ {data.total_after_discount.toFixed(2)}</p>
				<p className="c-c666">
					<span>活动优惠：- ¥ {data.total_discount.toFixed(2)}</span>
				{/*	<span>预估税费：¥ {data.total_tax.toFixed(2) }</span>*/}
				</p>

			</div>
		)
	}
}

//购物车store 营销
export class StoreMarket extends Component{
	render(){
		let {data,edit,shopId }=this.props;
		const html = data.items && !!data.items.length && data.items.map(function(item,i){
			if( !item ){
				return "";
			}
			return <OneItem {...data} edit={edit} type={data.type} data={item} key={i} />
		});
		return(
			<section className="store-market">
				{ data.type!=="common" && <MarketHeader {...data} shopId={ shopId } /> }
				{html}
			</section>
		)
	}
}

//购物车store 营销 头部信息
class MarketHeader extends Component{
	render(){
		const { tag, rule, no_cap_show, type, is_satisfied, shopId, promotion_id } = this.props;
		let activity = "";
		switch( type ){
			case "fullminus":
				activity = <a href={`/minusActivity?promotion_id=${ promotion_id }&shop_id=${ shopId }`} className="c-dpb c-lh20"><span className="tag">{tag}</span>{is_satisfied ?<span><b>已满足</b>【{rule[0]}】</span>:<span>{rule.join("，")}{ no_cap_show?"，上不封顶":"" }</span>} &gt;</a>;
				break;
			case "fulldiscount":
				activity = <a href={`/discountActivity?promotion_id=${ promotion_id }&shop_id=${ shopId }`} className="c-dpb c-lh20"><span className="tag">{tag}</span>{is_satisfied ?<span><b>已满足</b>【{rule[0]}】</span>:<span>{rule.join("，")}{ no_cap_show?"，上不封顶":"" }</span>} &gt;</a>;

				break;
			default:break;
		}
		return(
			<div className="market-header">
				{ activity }
				{type==1&&
					<div className="c-tr">
						<a href="javascript:;" className="red-btn c-dpib c-tc">立即换购</a>
					</div>
				}
			</div>
		)
	}
}
//一个商品
class OneItem extends Component{
	constructor(){
		super();
		this.state={
			showTip:false
		}
	}
	toggleTip=()=>{
		this.setState({
			showTip:!this.state.showTip
		})
	};
	render(){
		const {data,type,edit,invalid } = this.props;
		data.needTax = ( data.type==="Direct"|| data.type==="Bonded" || data.type==="Overseas" );//是否要交税
		return(
			<div className="one-item">
				<OneItemBody  data={data} type={type} invalid={invalid} edit={edit} showTip={this.state.showTip}  toggleTip={this.toggleTip }/>
				{ data.needTax && this.state.showTip ? <TaxRateTip tax={this.props.data.tax_rate}/> :""}
				<OneItemBottom invalid={invalid} data={this.props.data} />
			</div>
		)
	}
}

//一个商品 中间信息
class OneItemBody extends Component{
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
	    showTip:false,
	    quantity:this.props.data.quantity,
	    initQuantity:this.props.data.quantity
    };
    this.delayNumUpdate = delay( this.handleNumUpdate,200);
  }
	static contextTypes ={
		store:React.PropTypes.object
	};
	//点击check
	handleCheck =()=>{
		const {store } = this.context;
		let { cart_id,is_checked } = this.props.data;
		store.dispatch({
			type:"SHOP_CART",
			update:true,
			data:{["cart_id["+cart_id+"]"]:Number(!is_checked) },
			ctrl:"pick"
		});
	};
	//点击删除
	handleDelete =()=>{
		const {store} = this.context;
		let { cart_id } = this.props.data;
		store.dispatch( popupActionCreator( "确定将这1件商品删除？",()=>{store.dispatch({type:"SHOP_CART", update:true, data:{["cart_id["+cart_id+"]"]:cart_id }, ctrl:"remove", msg:true});}));
	};
	//点击减少
	handleReduce =()=>{
		let {cart_id} = this.props.data;
		let {quantity} = this.state;
		this.setState({quantity:quantity-1});
		this.delayNumUpdate({
			cart_id:cart_id,
			cart_num:quantity-1,
			mode:'minus'
		});
	};
	//点击增加
	handlePlus=()=>{
		let {cart_id} = this.props.data;
		let {quantity} = this.state;
		this.setState({quantity:quantity+1});
		this.delayNumUpdate({
			cart_id:cart_id,
			cart_num:quantity+1,
			mode:"plus"
		})
	};
	//初始化商品可购买最大数量
	initBuyLimit =()=>{
		const { data } = this.props;
		const { promotion,store } = data;
		let max =store.total - store.freeze;
		let real = max;
		if( promotion  ){
			max = promotion.real_store;
			real = max;
		}
		if( promotion && promotion.promotion_type === "flashsale" ){
			max = promotion.user_buy_limit - promotion.user_buy_count;
		}
		this.setState({
			buyLimit:max,
			realStore: real
		});
	};
	//input数量 change 变化
	handleNum=(e)=>{
		this.setState({
			quantity:e.target.value
		});
	};
	//input数量 blur 变化
	handleInputNum =(e)=>{
		let dom = e.target,
			 num = +dom.value,
		  {cart_id} = this.props.data,
			{store} = this.context,
			{initQuantity} = this.state;
		let min = +dom.getAttribute("min");
		if( !Number.isInteger(num) ){
			store.dispatch( tipActionCreator("请输入正确的数量哦") );
			this.setState({
				quantity:initQuantity
			});
			return;
		}else if( num < min ){
			store.dispatch( tipActionCreator("至少需要1件哦") );
			this.setState({
				quantity:initQuantity
			});
			return;
		}
		this.handleNumUpdate({
			cart_id:cart_id,
			cart_num:num,
			mode:"deal"
		});
	};
	//更新数量
	handleNumUpdate =( actionData )=>{
		const {store} = this.context;
		store.dispatch({
			type:"SHOP_CART",
			update:true,
			ctrl:"update",
			data:actionData
		});
	};
	
	//移入收藏夹
	handleCollect=()=>{
		const {store} =this.context;
		let {cart_id,quantity,item_id } = this.props.data;
		store.dispatch( popupActionCreator("当前选中的商品移入收藏夹成功后，将从购物袋删除哦。",
			()=>{store.dispatch({type:"SHOP_CART", update:true, ctrl:"collect", data:{'cart_id[0]':cart_id,'item_id[0]':item_id}, msg:true})}
		));
	};
	componentWillMount(){
		this.initBuyLimit();
	}
	componentWillReceiveProps( newProps ) {
		if( newProps.edit == this.props.edit ){
			this.setState({
				quantity:newProps.data.quantity,
				initQuantity:newProps.data.quantity
			})
		}
	}
	render(){
		let { quantity, buyLimit, realStore } = this.state;
		const { edit, data, type, invalid } = this.props;
		const { promotion,item_id } = data;
		data.image_default_id = data.image_default_id && data.image_default_id.replace(/jpg\_(\w)\.jpg$/g,'jpg_s.jpg');
		data.tax = Number( data.tax );
		return(
			<div className="item-body">
				<div className="item-ckbox">
					<CheckIcon handleCheck={ this.handleCheck }  invalid={invalid} isCheck={data.is_checked } />
				</div>
				<div className="item-detail" style={{paddingRight:"0.34667rem"}}>
					<a className="item-img c-dpb" href={RNDomain + `/item?item_id=${item_id}`} onClick={(e)=>{ if(edit){ e.preventDefault(); } } } >
						<img src={data.image_default_id } width="70" height="70" />
					</a>
					<div className="item-info">
						<div className="info-top">
							<div className="info-text">
								{ edit?
									<NumCtrl data={data} handlePlus={this.handlePlus} quantity={this.state.quantity } handleReduce={this.handleReduce} handleNum={this.handleNum } handleInputNum={this.handleInputNum} buyLimit={this.state.buyLimit }/>:
									<a className="info-title" href={RNDomain + `item?item_id=${item_id}`} >
										{data.type==="Direct"&&<span className="label yellow-label">海外直邮</span>}
										{data.type==="Bonded"&&<span className="label blue-label">跨境保税</span>}
										{promotion && <span className="act-label  c-fb">{promotion.promotion_tag}</span> }
										{data.title}
									</a>
								}
								<div className="info-props">
									{data.spec_info }
								</div>
							</div>
							<div className="info-price">
								<p>¥{ promotion ?(+promotion.promotion_price).toFixed(2):(+data.price).toFixed(2) }</p>
								<p>×{this.state.quantity}</p>
								{ !edit && !invalid && ( realStore < quantity ) && <p className="c-cf88 c-fs12">库存不足</p>}
							</div>
						</div>
						<div className="info-btm c-tr">
							{ !invalid ?
								 ( edit?
								    <i className="delete-box-icon" onClick={ this.handleDelete }> </i>:
									 ( data.needTax ? <div className="info-btm-text" onClick={ this.props.toggleTip }>
											税费：¥{data.tax.toFixed(2)} <i ref="arrow" className={this.props.showTip?"arrow-btm-s-icon active":"arrow-btm-s-icon"}> </i>
										</div>:""
									 )
								 ):
								<a href="javascript:;" className="black-btn" onClick={ this.handleCollect } >移入收藏夹</a>
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

//一个商品 底部信息
class OneItemBottom extends Component{
	render(){
		let {invalid,data } = this.props;
		let {store,promotion} = data;
		let max =store.total - store.freeze;
		if( promotion ){
			max = promotion.real_store;
		}
		return(
			<div className="item-bottom">
				{ !invalid?
					<div className="item-limit c-cf88">
						{ (promotion && promotion.promotion_type==="flashsale")?<span>限购{ promotion.user_buy_limit - promotion.user_buy_count }件 </span>:((max<6)&& <span>仅剩{max}件</span>) }
					</div>:
					<div  className="item-limit c-c666">
						{(data.status==="Stock" || data.status ==="Shelving" || data.valid ==0 )?"商品已下架":( max<=0 ?"商品暂不销售":"") }
					</div>
				}
				{ /*!this.props.invalid?
					<div className={this.props.has?"item-give":"item-give c-cb6"}>
						<div className="give-info">
							【赠品】户外Nike耐克男鞋2016冬季鞋2016冬季鞋2016冬季鞋2016冬季
						</div>
						<div className="give-num">¥0.00 ×1</div>
					</div>:""*/
				}
			</div>

		)
	}
}
//一个商品 税率提示
class TaxRateTip extends Component{
	render(){
		return(
			<div className="tax-tip">
					※税率{(this.props.tax*100).toFixed(2)}%，结算税费以提交订单时应付总额明细为准
			</div>
		)
	}
}

//购物车总和
export class CartTotal extends Component{
  constructor(props) {
    super(props);
	  this.state = {
		  edit:false,
		  editNum:0
	  };
  }
	static contextTypes ={
		store:React.PropTypes.object,
		router:React.PropTypes.object
	};
	cartSubmitHandle=()=>{
		const self = this;
		const { submit } = cartCtrl,
			{ router,store } = this.context;
		store.dispatch(loadActionCreator(true));
		$.ajax({
			url:submit.url,
			type:submit.type,
			success( result ){
				store.dispatch(loadActionCreator(false));
				if( !result.status ){
					store.dispatch( tipActionCreator( result.msg) );
					return;
				}
				window.location.href ='/orderConfirm?mode=cart_buy';
			},
			error(){
				store.dispatch(loadActionCreator(false));
				store.dispatch( tipActionCreator( "服务器发生错误，请稍后再试") );
			}
		})
	};
	componentDidMount() {
		let self = this;
		const {store} = this.context;
		this.unSubscribe = store.subscribe(()=>{
			let state = store.getState().initial;
			if( state.type==="SHOP_CART" && state.editChange ){
				if( state.edit ){
					self.setState({
						editNum:self.state.editNum+1,
						edit:state.edit
					})
				}else{
					self.setState({
						editNum:self.state.editNum-1,
						edit:state.edit
					})
				}
			}
		});
	}
	componentWillUnmount() {
		this.unSubscribe();
	}
	render(){
		let totalPrice = 0,//总价
				totalTax = 0,//总税费
				totalNum = 0,//总的商品数量
				itemNum = 0,//总的商品选择条数
				{ data } = this.props,
				canSub = true, //是否可以提交订单
				storeArr = data.valid_items;
		storeArr.forEach(function( store,i){
			let totalStore =store.totalCart;
			totalPrice += totalStore.total_after_discount;
			totalTax += totalStore.total_tax;
			canSub = canSub && !store.over_buy_limit;
			totalNum += totalStore.total_num;
			store.activity.forEach(function(act,i){
				act.items.forEach(function(item,i){
					 if( item.is_checked ){
						 itemNum++;
					 }
				});
			});
		});
		return(
			<section className="cart-total">
				<div className="select-all" onClick={this.props.handleCheck } ><CheckIcon isCheck={ data.cartCheck }/>全选</div>
				{ (this.state.edit || this.state.editNum)?
					<div className="cart-collect">
						<a href="javascript:;" className="black-btn btn" onClick={ (e)=>{this.props.handleCollects(itemNum) } } >移入收藏夹</a>
					</div>:
					<div className="cart-total-dtl">
					<p className="c-fs12">合计(不含税)：<span className="c-fs15 c-cf00"><i>¥</i>{totalPrice.toFixed(2)}</span></p>
					<p className="c-fs10 c-c999">预计税费：<i>¥</i>{totalTax.toFixed(2)}</p>
					</div>
				}
				{ (this.state.edit || this.state.editNum)?
					<div className="cart-delete"><a href="javascript:;" onClick={ (e)=>{this.props.handleRemoves(itemNum)} } className="red-btn btn">删除商品</a></div>:
					(canSub && totalNum ?
						<a href="javascript:;" className="cart-submit btn c-bgdred" onClick={ this.cartSubmitHandle }>
							<span>结算({totalNum})</span>
						</a>:
						<a href="javascript:;" className="cart-submit btn c-bgc9" >
							<span>结算{totalNum?`(${totalNum})`:""}</span>
						</a>
					)
				}
			</section>
		)
	}
}

//check标签
class CheckIcon extends Component{
	constructor(props){
		super(props);
		this.state={
			check:this.props.isCheck
		};
	}
	componentWillReceiveProps(props){
		this.setState({ check:props.isCheck });
	}
	checkHandle=()=>{
		 this.props.handleCheck && this.props.handleCheck();
		this.setState({ check: !this.state.check });
	}
	render(){
		if(this.props.invalid ){
			return <span className="label grey-label c-br3">失效</span>;
			//return <span className="label red-label c-br3">秒杀</span>;
		}else{
			return <div onClick={ this.checkHandle }>
				  <span className={this.state.check?"check-icon check":"check-icon"}> </span>
				</div>
		}
	}
}
//数量控制
class NumCtrl extends Component{
  constructor(props) {
    super(props);
    this.state = {};
  }
	render(){
		const {data, buyLimit,quantity } = this.props;
		return(
			<div className="num-ctrl">
				{quantity<=1?
					<a href="javascript:;" className="c-bgf4" ><i className="sub-l-dis-icon"> </i></a>:
					<a href="javascript:;" onTouchTap={this.props.handleReduce }><i className="sub-l-icon"> </i></a>
				}
				<input type="number" min="1" value={this.props.quantity } onChange={ this.props.handleNum } max={ buyLimit } onBlur={ this.props.handleInputNum } />
				{quantity >= buyLimit ?
					<a href="javascript:;"  className="c-bgf4" ><i className="plus-l-dis-icon"> </i></a> :
					<a href="javascript:;" onTouchTap={this.props.handlePlus }><i className="plus-l-icon"> </i></a>
				}
			</div>
		)
	}
}

//弹窗控制
class PopupCtrl extends Component{
	constructor(props){
		super(props);
		this.state = {
			type:"",
			data:""
		}
	}
	static contextTypes ={
		store:React.PropTypes.object
	};
	typeChangeHandle(){
		this.setState({
			type:""
		})
	};
	componentDidMount() {
		const {store} = this.context;
		this.unSubs = store.subscribe(()=>{
			const state = store.getState().initial;
			if( state.type==="POPUP" ){
				this.setState({
					type:state.popType,
					data:state.data
				});
			}
		});
	}
	componentWillUnmount(){
		this.unSubs();
	}
	render(){
		const {type,data} = this.state;
		return(
			<div>
				<PopupModal active={type==="modal"} msg={data.msg} onClose={ this.typeChangeHandle.bind(this) } onSure={ (close)=>{ data.cb && data.cb(); close(); } } />
				<PopupTip active={ type==="msgTip"} msg={data.msg} onClose={ this.typeChangeHandle.bind(this) }/>
				{type==="load" && <TransShady/> }
			</div>
		)
	}
}