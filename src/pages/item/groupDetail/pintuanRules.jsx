import React, { Component } from 'react';


import 'src/scss/pintuanRules.scss';

export default class pintuanRules extends Component {
	componentWillMount(){
		document.title="拼团玩法";
		this.context.isApp && (window.location.href = "jsbridge://set_title?title=拼团玩法");
	}
	static contextTypes = {
		isApp: React.PropTypes.bool
	}
  render() {
    return(
		<div data-page="pintuanRules">
	<section className="group-purchase-step">
		<div className="step-img"></div>
	</section>
	<section className="rules-explain">
		  <h3><i></i>玩法说明</h3>
		  <ul>
		  <li>
			  <div className="rule-tip">1. 选择商品开团</div>
			 <div className="rule-detail"> 选择拼团商品下单，团长完成支付后，团即刻开启。在活动期间内，参团人数需在规定时间内达到规定人数，此团方能成功，否则超过活动期，或者超过拼团时间，此团均为失败，系统自动退款。</div>
 		 </li>
		  <li>
			  <div className="rule-tip">2. 团长</div>
			  <div className="rule-detail">
				  开团且该团第一位支付成功的人。
			  </div>
		  </li>
		  <li>
			  <div className="rule-tip">3. 参团成员</div>
			  <div className="rule-detail">
				  通过团长邀请购买该商品的成员即为参团人员，参团人员也可
				  通过分享团链接给微信好友邀请更多的成员参加。
			  </div>
		  </li>
		  <li>
			  <div className="rule-tip">4. 拼团有效期</div>
			  <div className="rule-detail">
				  拼团有效期是自开团时刻起至规定的时间内，均以商品的结束
				  时间为准。
			  </div>
		  </li>
 		 </ul>
 	 </section>
		</div>
    )
  }
}

