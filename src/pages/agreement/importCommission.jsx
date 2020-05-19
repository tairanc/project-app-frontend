import React, { Component } from 'react';
import 'src/scss/agreement.scss';
import Popup from 'component/modal';

export default class ImportCommission extends Component{
	componentDidMount() {
		Popup.MsgTip({msg:"页面点击关闭"});
	}
	componentWillUnmount(){
		const msgTip =document.querySelector("#msgTip");
		msgTip && msgTip.parentNode && msgTip.parentNode.removeChild(msgTip);
	}
	render(){
		return(
			<div data-page="agreement" className="import-commission" onClick={this.props.onClose }>
				<div className="agreement-scroll">
					<p ><b>进口个人委托申报协议</b><b></b></p>
					<p>本人承诺所购买商品系个人合理自用，针对保税区发货的各种商品，现委托商家代理申报、代缴税款等通关事宜，本人保证遵守《海关法》和国家相关法律法规，保证所提供的身份信息和收货信息真实完整，无侵犯他人权益的行为，以上委托关系如实填写，本人愿意接受海关、检验检疫机构及其他监管部门的监管，并承担相应法律责任。
					</p>
				</div>
			</div>
		)
	}
}