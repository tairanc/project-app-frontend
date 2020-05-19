import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {concatPageAndType, actionAxios, actionAxiosAll} from 'js/actions/actions'
import {
	createAction,
	PurchaseLimit,
} from 'filters/index'
import {dateUtil} from "js/util/index";
import {browserHistory} from 'react-router';
import {LinkChange} from 'component/common';
import {onAreaResultJSBrige} from "../../js/jsbrige/index";
import {PopupModal, ModalTips} from 'component/modal';
import {NewModal} from 'component/module/modal/modal';
import {tip} from 'component/module/popup/tip/tip';
import {PureComponent} from 'component/module/HOC/PureComponent';
import axios from 'axios';
import {BarrageStripConnnect} from "./detail"

import {
	ItemNav,
	ScrollImageState, // 滚动图片
	SeverArea, // 配送区域
	EvaluateArea, //评价区域
	RecommendArea, //推荐区域
	ShopArea, //店铺区域
	GoodsDetail, //商品详情区域
	GoodsTit,
	Price,
	Tag,
	PromotionWrap,
	createBuyAction, //首页 收藏 购物车
	BuyModalTitle,
	chooseSpec,
	Specs,
	ExpectTax,
	PromotionInfo,
	rangePrice,
	Action,
} from "./detail.jsx"


const createActions = concatPageAndType('seckill');
const axiosActions = actionAxios('seckill');


class BuyModalInfo extends Component {

	initList = () => {
		let {specs} = this.props.promotion.info;
		return Object.keys(specs).map((val, i) => {
			return <Specs specs={specs[val]} index={i} {...this.props} key={i}/>
		});
	};

	getLimit = () => {
		let {activity_type} = this.props.data;
		let {itemRules} = this.props.promotion;
		if (activity_type === "seckill") {
			return (
				<span className="limit_buy">限购{itemRules.user_buy_limit}件 (已购{itemRules.user_buy_count}件)</span>
			)
		}
		return null
	};


	render() {
		let {num, storeNum} = this.props.retState;
		return (
			<div className="attr-wrap">
				<div className="standard-area stable-standard cur">
					<div className="standard-info">
						{this.initList()}
					</div>
				</div>
				<div className="buy-amount">
					<span className="amount-tit">数量：</span>
					<span className="number-increase-decrease">
					<span className="btn btn-action action-decrease dis-click">－</span>
					<input type="number" readOnly className="action-quantity-input"
								 value={num}/>
						<span className="btn btn-action action-increase dis-click">＋</span>
					</span>
					<span className="store_buy">库存{storeNum}件</span>
					{this.getLimit()}
					<div className="clearfix"></div>
				</div>
				<ExpectTax {...this.props} />
			</div>
		)
	}
}

class BuyModalButton extends Component {
	render() {
		let {onClickBuy, purchaseLimit, toBuyClick, isNonPayment, isLimit, popTips, state} = this.props;
		// let isPurchaseLimit = purchaseLimit();
		let isPurchaseLimit = false;    //本期不做
		return (
			<div className="buy-option-btn">
				{ isPurchaseLimit ? <span className="purchase-limit">抱歉，海外直邮类商品和跨境保税类商品总价超过限额￥2000，请分次购买。</span> : null}
				{
					!isNonPayment ? (
						<div>
							{
								state == 2 ? (isLimit() ?
									<div className={`btn-tobuy ${isPurchaseLimit ? 'c-bgc9' : ''}`}
											 onTouchTap={isPurchaseLimit ? "" : toBuyClick ? onClickBuy : ""}>确定</div> :
									<div className="btn-tobuy-disable">确定</div>) :
									<div className="action-notify"
											 onTouchTap={() => popTips("秒杀还未开始，请耐心等待哦~")}>即将开始</div>
							}
						</div>
					) :
						<div type="button" className="btn-tobuy-disable">还有机会</div>
				}
			</div>
		)
	}
}


class BuyModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			toBuyClick: true
		}
	}

	componentWillMount() {
		let flag = this.judgeSingleSku();
		if (flag) {
			this.changeBusinessPrice();
		}
	}

	//单规格或者无规格初始化价格和skuId
	changeBusinessPrice = () => {
		let {nowPrice, nowSkuId, storeNum} = this.props.retState;
		let skus = this.props.promotion.info.skus;
		let newSpecKey = Object.keys(skus)[0];
		nowSkuId = skus[newSpecKey].sku_id;
		storeNum = skus[newSpecKey].store;
		let newRetState = {...this.props.retState, nowPrice, nowSkuId, storeNum};
		this.props.InitState(newRetState);
	};


	purchaseLimit = () => {
		let {trade_type} = this.props.data;
		if (this.props.retState.num > 1 && this.props.retState.nowSkuId && PurchaseLimit(trade_type)) {
			return this.props.retState.num * this.props.retState.nowPrice > 2000
		}
	};

	getActionData = (flag) => {
		let {itemId, retState, promotion} = this.props;
    let addrList = this.props.mix && this.props.mix.addrList;
    let addr_id = addrList ? (addrList.recent_addr.length > 0 && addrList.recent_addr[0].addr_id || addrList.default_addr && addrList.default_addr.addr_id || 0) : 0;
		let ret = {
			"item[item_id]": itemId,
			"item[quantity]": retState.num,
			"item[sku_id]": retState.nowSkuId,
			"obj_type": "seckill",
			"in_promotion_time": promotion.promotion[0].in_promotion_time,
		}, {user_id} = this.props.location.query;

		// 添加分佣用户id
		if (user_id) {
			ret.commission_user_id = user_id
		}

    flag && (ret.mode = "fast_buy",ret.addr_id = addr_id);
		return ret
	};

	onClickBuy = () => {
		let flag = this.checkSpec();
		if (flag) {
			tip.show({msg: "请选择" + flag});
			return
		}
		this.toCart()
	};

	toCart = () => {
		this.props.PopupModal(true);
		this.props.loadCaptcha(this)
	};

	checkSpec() {
		let {specKey, nowSkuId} = this.props.retState;
		let {specs} = this.props.promotion.info;
		let unSelectKey;
		if (!nowSkuId && !(specs instanceof Array)) {
			unSelectKey = Object.keys(specs).filter((val, index) => {
				return +val !== specKey[index]
			});
			return specs[unSelectKey[0]].name;
		} else {
			return false
		}
	}

	//判断库存
	isHasStore = (sku, data, select) => {
		return data && data.some((list, i) => {
				if (list.ids[sku.index] === sku.spec) {
					let newSelect = select.slice();
					if (newSelect[sku.index]) {
						delete newSelect[sku.index];
					}
					if (newSelect.every((item, j) => {
							return select[j] === list.ids[j]
						})) {
						return list.skus.store > 0
					} else {
						return false;
					}
				} else {
					return false;
				}
			});
	};

	//选择规格属性
	specSelect = (spec, index, key) => {
		let {retState} = this.props;
		let {skus} = this.props.promotion.info;
		let {store} = this.props.promotion;
		let {selectArr, specKey, nowSku, storeNum, newData, nowSkuId, nowPrice, num} = retState, flag, newSpecKey;
		selectArr = selectArr.slice();
		if (selectArr[index] === spec) {
			delete selectArr[index];
			delete specKey[index]
		} else {
			selectArr[index] = spec;
			specKey[index] = key;
		}

		// 选中一个商品规格，更新数据
		newSpecKey = selectArr.join("_");
		if (selectArr.length == newData[0].ids.length && skus[newSpecKey]) {
			//更新对应skuId及其价格  sku 库存
			nowSku = skus[newSpecKey];
			nowSkuId = skus[newSpecKey].sku_id;
			nowPrice = skus[newSpecKey].price;
			storeNum = skus[newSpecKey].store;
			//更新num
			num = num < storeNum ? num : storeNum;
		} else {
			//未选中一个商品规格，价格设为标准价
			nowPrice = rangePrice(this.props.promotion, true);
			storeNum = store.real;
			nowSkuId = "";
			nowSku = "";
		}
		let RetState = {...this.props.retState, nowSku, selectArr, specKey, nowSkuId, nowPrice, num, storeNum};
		this.props.InitState(RetState);
	};

	//判断是否是单规格(无规格)
	judgeSingleSku = () => {
		let {skus} = this.props.promotion.info;
		let keys = Object.keys(skus);
		if (keys.length === 1) {
			return true;
		} else {
			return false
		}
	};
	//单规格默认选中
	singleSku = () => {
		let {skus, specs} = this.props.promotion.info;
		let newSpecKey = Object.keys(skus)[0];
		let {selectArr, specKey, newData, nowSkuId, nowPrice} = this.props.retState;
		nowSkuId = skus[newSpecKey].sku_id;
		nowPrice = skus[newSpecKey].price;
		selectArr = newSpecKey.split("_");
		specKey = Object.keys(specs);
		let RetState = {...this.props.retState, selectArr, specKey, nowSkuId, nowPrice};
		this.props.InitState(RetState);
	};

	render() {
		let props = {
			isHasStore: this.isHasStore,
			onClickBuy: this.onClickBuy,
			specSelect: this.specSelect,
			judgeSingleSku: this.judgeSingleSku,
			purchaseLimit: this.purchaseLimit,
			...this.props,
			...this.state
		};
		return (
			<NewModal isOpen={this.props.buyModal} onClose={this.props.closeModal}>
				<div className="action-buy-modal">
					<BuyModalTitle {...props} />
					<BuyModalInfo {...props} />
					<BuyModalButton {...props} />
				</div>
			</NewModal>
		)
	}
}

export class Buy extends Component {

	componentWillReceiveProps(nextProps) {
		if (nextProps.mixStatus && nextProps.proStatus) {
			this.setState({mixStatus: nextProps.mixStatus, proStatus: nextProps.proStatus});
		}
	}

	active = (tab) => {
		this.props.UpdateBuyModal({buyModal: true, buyActive: tab});
	};

	closeModal = () => {
		this.props.UpdateBuyModal({buyModal: false});
	};

  isNonPayment = () => {
    //还有机会
    if (this.props.promotion.itemRules) {
      let {real_store, item_sales, sales_count} = this.props.promotion.itemRules;
      if (!real_store) {
        return item_sales !== sales_count;
      }
    }
  };

	isLimit = () => {
		let {promotion} = this.props;
		return promotion.itemRules.user_buy_limit > promotion.itemRules.user_buy_count
	};

	popTips(msg) {
		tip.show({
			msg: msg
		});
	}

	render() {
		let props = {
			...this.props,
			isNonPayment: this.isNonPayment(),
			isLimit: this.isLimit,
			popTips: this.popTips,
			closeModal: this.closeModal
		};
		return (
      props.mixStatus && props.proStatus ?
				<div>
          {this.props.choose ?
						<div>
              {this.props.buyActive === "chooseSpec" && <BuyModal {...props}/>}
							<LinkChange className="choose-btn" onClick={() => {
                this.active("chooseSpec")
              }}> </LinkChange>
						</div> : this.props.data.is_charge ? null :
              (this.props.data.status === "Shelves" ?
                  !this.isNonPayment() ? (this.props.promotion.itemRules.real_store ?
											<div className="action-btn-group  c-fr seckill-btn">
                        {this.props.buyActive === "buy" && <BuyModal {...props}/>}
                        {
                          this.props.state == 2 ? (this.isLimit() ?
														<div>
															<LinkChange className="ui-btn  action-addtocart  action-btn-seckill-in c-fl"
																					onClick={(e) => {
                                            this.active("buy")
                                          }}>立即秒杀</LinkChange>
														</div> :
														<LinkChange
															className="ui-btn  action-addtocart  action-btn-seckill-disable c-fl">立即秒杀</LinkChange>) :
                            this.props.state == 1 ?
															<LinkChange className="ui-btn  action-notify">秒杀结束</LinkChange> :
															<LinkChange className="ui-btn  action-notify"
																					onTouchTap={() => this.popTips("秒杀还未开始，请耐心等待哦~")}>即将开始</LinkChange>
                        }
											</div>
                      :
											<div className="action-btn-group c-fr">
												<LinkChange type="button"
																		className="ui-btn action-btn-seckill-disable">已售罄</LinkChange>
											</div>
                  ) :
										<div className="action-btn-group c-fr">
											<LinkChange type="button" className="ui-btn action-btn-seckill-disable">还有机会</LinkChange>
										</div>
                  :
									<div className="action-btn-group c-fr">
										<LinkChange type="button" className="ui-btn action-btn-seckill-disable">已下架</LinkChange>
									</div>
              )}
				</div> : <div className="action-btn-group c-fr">
				<span className="ui-btn  action-buy-now c-fl incomplete-buy-now" style={{width: "100%"}}>立即秒杀</span>
			</div>
    )
	}
}


let BuyAction = createBuyAction({Buy});

//选择规格
export let createChooseSpec = function ({Buy}) {
	return class ChooseSpec extends PureComponent {
		render() {
			let {specs} = this.props.promotion.info;
			let {retState, data, promotion} = this.props;
			let chooseSpecs = chooseSpec(retState, specs);
			return (
				data.status === "Shelves" || promotion.store.real?
					!(specs instanceof Array) && <div className="choose-col">
						<ul className="choose-spec c-fs13">
							<li className="c-mr15">{chooseSpecs.length > 0 && retState.nowSkuId ? "已选择 " : "选择 "}</li>
							{chooseSpecs.length > 0 && retState.nowSkuId && <li className="c-mr15">{chooseSpec(retState, specs)}</li>}
							< li className="icon"><img src="/src/img/icon/arrow/arrow-right-icon.png"/></li>
						</ul>
						<Buy {...this.props} choose={true}/>
						<div className="gap bgf4"></div>
					</div> : null
			)
		}
	}
};
let ChooseSpec = createChooseSpec({Buy});

export class PriceArea extends PureComponent {
	render() {
		let {data, proStatus, promotion, state} = this.props;
		return (
			<div className="price-area">
				{!state && <Price item={data} proStatus={proStatus} promotion={promotion}/>}
				<GoodsTit item={data}/>
				<Tag item={data}/>
			</div>
		)
	}
}

class Notice extends PureComponent {
	componentWillMount() {
		let {now_time, end_time, start_time} = this.props.promotion.promotion[0];
		this.props.initData({now_time, end_time, start_time});
		this.timer = setInterval(() => {
			this.props.observeState();
		}, 1000)
	}

	componentWillReceiveProps(props) {

		if (props.state == 1) {
			location.reload();
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		this.timer = null;
		this.props.clearData()
	}

	formatTime(time) {
		return dateUtil.formatNum(parseInt(time))
	}

	render() {
		let {state, toend, data, proStatus, promotion} = this.props;
		return (

			state == 1 ? null :
				<div className="detail-seckil-state-area">
					<div className="seckil-state-area-l c-fl">
						<Price item={data} proStatus={proStatus} promotion={promotion}/>
						{state == 2 ? <span className="in-seckil c-tc c-dpib">秒杀中</span> : null}
					</div>
					{
						!state ?
							<div className="seckil-state-area-r-no c-fr">
								预计{dateUtil.format(this.props.start_time * 1000, "M月D日H:F:S")}开始</div>
							:
							<div className="seckil-state-area-r-in c-fr">
								<div>
									<div className="c-dpb c-tc">离结束还剩</div>
									<div className="time-remain c-tc">
										<div className="c-dpib">
											<font>{this.formatTime(toend / 3600)}</font>
											:
											<font>{this.formatTime(toend % 3600 / 60)}</font>
											:
											<font>{this.formatTime(toend % 60)}</font>
										</div>
									</div>
								</div>
							</div>
					}
				</div>
		)
	}
}

/*class CheckWrap extends PureComponent {
 render() {
 return <div className="seckill-code-content">
 <h2>请输入验证码</h2>

 <div className="code-input-area">
 <input type="text" value={this.props.inputVal} onChange={(e) => this.getInput(e)}/><img className="get-code"
 src={this.props.valid.primary_image}/>
 {this.props.validError ? <span className="error">{this.props.errorVal}</span> : null }

 </div>
 </div>
 }

 }*/

class PromoteWrap extends PureComponent {

	getInput(e) {
		this.props.validVal(e.target.value)
	}

	createMsg() {
		return <div className="seckill-code-content">
			<h2>请输入验证码</h2>

			<div className="code-input-area">
				<input type="text" value={this.props.inputVal} placeholder="请输入验证码" onChange={(e) => this.getInput(e)}/>
				<img className="get-code" src={this.props.valid.primary_image} onClick={() => {
					if (this.props.validStatus) {
						this.props.loadCaptcha();
					}
					this.props.changeVaildStatus(false);
				}
				}/>
				{this.props.validError ? <span className="error">{this.props.errorVal}</span> : null }

			</div>
		</div>
	}

	closeModal() {
		this.setState({});
		this.props.PopupModal(false)
	}

	onSure() {
		if (!this.props.inputVal) {
			return this.props.validError("请输入验证码")
		} else {
			this.props.checkCaptcha(this.props.inputVal)
		}
	}

	resetScroll() {
		setTimeout(function () {
			document.body.scrollTop += 1
		}, 100)
	}

	render() {
		return (
			<ModalTips isOpen={this.props.popupModalCtrl.show} msg={this.createMsg() } onClose={ () => {
				this.closeModal();
				this.resetScroll();
			} } onSure={() => {
				this.onSure();
				this.resetScroll();
			}} className="modal-seckill-code"/>
		)
	}
}

// 活动
class ActiveArea extends PureComponent {
	render() {
		return ( <div className="active-area">
			<PromotionWrap {...this.props} />
		</div>)
	}
}


class Seckill extends Component {

	constructor(props) {
		super(props);
		this.state = {
			index: 0
		};
	}

	componentDidMount() {
		this.scrollEvent();
	}

	componentDidUpdate() {
		this.scrollEvent();
	}

	scrollEvent = () => {
		let {scrollImage, screenRate, screenDetail, itemNav} = this.refs;
		scrollImage = ReactDOM.findDOMNode(scrollImage);
		itemNav = ReactDOM.findDOMNode(itemNav);
		window.removeEventListener("scroll", this.addScrollEvent);
		this.addScrollEvent = () => {
			let scrollH = document.body.scrollTop;
			let bannerH = $(scrollImage).height() - 44;
			let ratio = scrollH / bannerH;
			ratio = ratio >= 1 ? 1 : ratio;
			this.setState({ratio:ratio});
			let navIndex = this.state;
			$(itemNav).css({
				display: !ratio ? "none" : "block",
				backgroundColor: `rgba(255,255,255,${ratio})`,
				color: `rgba(53,53,53,${ratio})`
			});
			if (scrollH < screenRate.offsetTop - 44) {
				navIndex !== 0 && this.setState({index: 0});
			} else if (scrollH < screenDetail.offsetTop - 44) {
				navIndex !== 1 && this.setState({index: 1});
			} else {
				navIndex !== 2 && this.setState({index: 2});
			}
		};
		window.addEventListener("scroll", this.addScrollEvent);
	};

	navClick = (index) => {
		let {screenRate, screenDetail} = this.refs;
		if (index === 0) {
			$(window).scrollTop(0);
		} else if (index === 1) {
			$(window).scrollTop(screenRate.offsetTop - 44);
		} else {
			$(window).scrollTop(screenDetail.offsetTop - 44);
		}
	};

	componentWillUnmount() {
		window.removeEventListener("scroll", this.addScrollEvent);
	}

	render() {
		let {location, data, mix, rate, recommend, promotion, cartNum, isLogin, pending, mixStatus, rateStatus, recommendStatus, proStatus, cartInfoStatus, retState, areaData, UpdateBuyModal, InitState, UpdateCartInfo, buyModal,buyActive} = this.props;
		let {item_id} = data;

		let {initData, observeState, clearData, state, toend, start_time, PopupModal, loadCaptcha} = this.props;

		let props = {
			itemId: item_id,
			location: location,
			retState: retState,
			data: data,
			mix: mix,
			promotion: promotion,
			mixStatus: mixStatus,
			proStatus: proStatus,
			UpdateBuyModal: UpdateBuyModal,
			InitState: InitState,
			UpdateCartInfo: UpdateCartInfo,
			buyModal: buyModal,
      buyActive:buyActive,
			PopupModal: PopupModal,
			loadCaptcha: loadCaptcha,

			state: state
		};

		let seckillProps = {
			promotion: promotion,
			initData: initData,
			observeState: observeState,
			clearData: clearData,

			state: state,
			toend: toend,
			start_time: start_time
		};

		return (
			<div data-page="item-detail" id="item-details" ref="details">
				<BarrageStripConnnect />
				<ItemNav ref="itemNav" index={this.state.index} navClick={this.navClick} ratio={this.state.ratio}/>
				<div ref="screenItem" className="screenItem">
					<ScrollImageState data={data} ref="scrollImage"/>
					{proStatus && <Notice {...seckillProps} data={data} proStatus={proStatus} promotion={promotion}/>}
					<PriceArea data={data} proStatus={proStatus} promotion={promotion} state={state}/>
					{proStatus && <ActiveArea promotion={promotion} shop={data.shop}/>}
					<div className="gap bgf4"></div>
					{mixStatus && proStatus && <ChooseSpec {...props}/>}
					{mixStatus && <SeverArea mix={mix} data={data} retState={retState} areaData={areaData} isLogin={isLogin}
																	 pending={pending}/>}
					<div className="gap bgf4"></div>
				</div>
				<div ref="screenRate">
					{rateStatus && <EvaluateArea rate={rate} itemId={item_id}/>}
					<div className="gap bgf4"></div>
					{recommendStatus && <RecommendArea recommend={recommend}/>}
					<div className="gap bgf4"></div>
					<ShopArea shop={data.shop}/>
				</div>
				<div ref="screenDetail">
					<GoodsDetail data={data}/>
				</div>
				<BuyAction cartNum={cartNum} cartInfoStatus={cartInfoStatus} {...props}/>

				<PromoteWrap {...this.props} />
			</div>
		)
	}
}
function seckillState(state) {
	return {
		...state.seckill
	}
}

function seckillDispatch(dispatch) {
	let loading = false;
	let rCom;
	return {
		clearData() {
			dispatch(createActions("clearData", {}))
		},
		initData(props) {
			dispatch(createActions("initData", props))
		},
		observeState() {
			dispatch(createActions("observeState", {}))
		},
		PopupModal(show) {
			dispatch(createActions("popupModalCtrl", {popupModalCtrl: {show}}));
			dispatch(createActions("clearCaptcha", {}));
			loading = false
		},
		loadCaptcha(ref) {
			if (ref) rCom = ref;
			dispatch(axiosActions("loadCaptcha", {
				url: "/wxapi/loadCaptcha.api"
			}))
		},
		changeVaildStatus(data){
			dispatch(createActions("changeVaildStatus"))
		},

		validError(str) {
			dispatch(createActions("validError", {errorVal: str}))
		},
		validVal (str) {
			dispatch(createActions("validVal", {inputVal: str}))
		},
		checkCaptcha(code) {
			if (!loading) {
				loading = true;

				let data = rCom.getActionData(true);
				data.captcha_code = code;

				$.ajax(Action("toCart", {
					data: data,
					success: (result) => {
						loading = false;
						if (result.biz_code == 1001) {
							this.validError(result.msg);
							dispatch(createActions("validVal", {inputVal: ""}));
							this.loadCaptcha();
							return;
						}
						this.PopupModal(false);

						if (!result.status) {
							return
						}
						let buy_type = result.data.buy_type;
						browserHistory.push('/orderConfirm?mode=fast_buy&buy_type=' + buy_type);
					}
				}))

			}
		}

	}
}
export default connect(seckillState, seckillDispatch)(Seckill);