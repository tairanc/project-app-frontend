import React, { Component } from 'react';
import ReactDOM,{ render } from 'react-dom';
import { Shady } from './common.jsx';

//动画
import ReactTransition from 'react-addons-css-transition-group';

const Popup ={};
//弹出窗
Popup.Modal = function ( config,cb ) {
	class ModalComp extends Component {
		constructor(props) {
			super(props);
			// 初始状态
			this.state = {
				isOpen:false
			};
		}
		componentDidMount() {
			this.setState({
				isOpen:true
			});
		}
		modalHide=()=>{
			let self = this;
			this.setState({
				isOpen:false
			});
			setTimeout( function(){
				self.allHide();
			},200);
		};
		allHide=()=>{
			const { dom } = this.props;
			dom.parentNode.removeChild( dom );
			//ReactDOM.unmountComponentAtNode( modal );
		};
		callback=( cb )=>{
			this.modalHide();
			cb && cb();
		};
		render() {
			return (
				<div  data-comp="modal" id="modal">
					<Shady clickHandle={(e)=>{ this.modalHide(); } }/>
					<ReactTransition transitionName="modal"
					                 data-comp="animate"
					                 transitionEnterTimeout={200}
					                 transitionLeaveTimeout={200}
					                 component="div">
						{this.state.isOpen?
							<div ref="modal" className="modal" onTouchTap={(e)=>{ e.preventDefault();}} >
								<div className="modal-text">
									<span>{this.props.msg}</span>
								</div>
								<div className="modal-btn c-fr">
									<div  onTouchTap={(e)=>{ this.modalHide(); } } className="g-col-1 one-btn c-fl" ref="cancel">
										<span>取消</span>
									</div>
									<div onTouchTap={(e)=>{ this.callback( cb );} }  className="g-col-1 one-btn c-fr" ref="sure">
										<span>确定</span>
									</div>
								</div>
							</div>
							:""}
					</ReactTransition>
				</div>
			)
		}
	}
	//对话框
	let modal = document.getElementById("modal");
	if( !modal ){
		modal = document.createElement("div");
		modal.setAttribute("data-comp", "modal");
		modal.setAttribute("id", "modal");
		document.body.appendChild(modal);
	}
	render(
		<ModalComp {...config} dom={modal}/>,
		document.getElementById("modal")
	);
};

//提示窗
Popup.MsgTip =function(config){
	class MsgTip extends Component{
		constructor(props) {
			super(props);
			this.state = {
				show:false
			};
		}
		componentDidMount() {
			const {dom} = this.props;
			this.setState({
				show:true
			});
			setTimeout(()=>{
				this.setState({
					show:false
				});
				setTimeout(()=>{
					dom && dom.parentNode && dom.parentNode.removeChild( dom );
				},2000);
			},2000);

		}
		render(){
			return (
				<ReactTransition data-comp="animate"
				                 transitionName="prompt"
				                 transitionEnterTimeout={100}
				                 transitionLeaveTimeout={200}
				                 component="div">
					{this.state.show?
						<div className="msg-text">
							{this.props.msg }
						</div>
						:""}
				</ReactTransition>
			)
		}
	}
	let msgTip = document.createElement("div");
	msgTip.setAttribute("data-comp", "msg-tip");
	msgTip.setAttribute("id", "msgTip");
	document.body.appendChild(msgTip);
	render(
		<MsgTip {...config} dom={msgTip} />,
		msgTip
	);
};

export default Popup;
