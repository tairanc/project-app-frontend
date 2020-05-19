import React, { Component } from 'react';
import { Link,browserHistory } from 'react-router';
import './payResult.scss';

export default class PaySuccess extends Component{
	constructor(props){
		super(props);
		this.state ={ status:this.props.location.query.status }
	}
	componentWillMount() {
		document.title="支付详情";
		window.location.href = "jsbridge://set_title?title=支付详情";
	}
	toList =()=>{
		window.location.replace( window.location.protocol + "//" + window.location.host + '/tradeList/0');
	};
	render(){
		return (
			<div data-page="pay-success">
				<div className="pay-success">
					<p>
						<img src="/src/img/icon/agree/current-round-icon.png" width="40" height="40"/>
					</p>
					<p className="c-fs18" style={{lineHeight:"32px"}}>{this.state.status==3?"订单支付成功":"订单处理中" }</p>
					<p className="c-cc9 c-fs10">我们将尽快为您安排, 祝您购物愉快</p>
					<p>
						<a className="colour-btn" href="trmall://main?page=home">继续购买</a>
					</p>
					<p>
						<div className="look-order" onClick={ this.toList }>查看订单</div>
					</p>

				</div>
			</div>
		)
	}
}