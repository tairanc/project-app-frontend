import React, { Component } from 'react';
import ReactDOM,{ render } from 'react-dom';
import { Link } from 'react-router';
import Popup from 'component/modal';
import { LoadingRound } from 'component/common';

import 'src/scss/recharge2.scss';

export default class Recharge extends Component{
	constructor(props) {
		super(props);
		let self = this;
		let {ershouche} = props.location.query;
		this.state = {
			update:false,
			data:[],
			status:(ershouche?'oil':'phone'),
			canGet:true
		};
	};
	static contextTypes ={
		store:React.PropTypes.object,
		isLogin:React.PropTypes.bool
	};
	changeStatue=(status)=>{
		this.setState({
			status:status
		});
	};
	componentWillMount(){
		document.title = '充值中心';
		window.location.href = 'jsbridge://set_title?title=充值中心';
	}
	componentDidMount(){
		let self = this;
		$.ajax({
	      url: "/originapi/order/charge/configure",
	      type: "get",
	      success: function(data) {
	      	if(data.code === 200){
		      	self.setState({
		      		data:data.list,
		      		update: true
		      	});
	      	} else {
	      		$('.more-click').css({display:'none'});
	      		Popup.MsgTip({msg: "服务器繁忙"});
	      	}
	      	//充值
		    $('.recharge-btn').click(function (e) {
		    	if(self.context.isLogin){
					if($(this).attr('class')==='recharge-btn' && self.state.canGet){
						self.setState({
							canGet:false
						})
						let rechData = {};
						if(self.state.status === 'phone'){
							let num = $('.phone-number input').eq(0).val().replace(/\s/g,'');
							let hfll = $('.hf-ll').attr('id');
							let type = parseInt($('.phone-page .choose .amount').html());
							let name = (hfll==='ll'?'data':'phone')+'_'+$('.phone-number .info').attr('id')+'_'+(type===1?'1024':(type===2?'2048':type));
							rechData = {
								number: num,
								amount: 1,
								name: name
							};
						} else if (self.state.status === 'qb'){
							let num = $('.qq-number input').eq(0).val();
							let mount = parseInt($('.qb-box.choose').val());
							rechData = {
								number: num,
								amount: mount,
								name: 'qbi_1'
							};
						} else if (self.state.status === 'oil'){
							let num = $('#oil-num').val();
							let name = 'oil_'+$('.oCard.choose').attr('id')+'_'+$('.oil-page .choose .amount').html();
							let user = $('#user-name').val();
							let phone = $('.card-msg .phone-number input').val().replace(/\s/g,'');
							rechData = {
								number: num,
								amount: 1,
								name: name,
								username: user,
								telephone: phone
							};
						}
						$.ajax({
					      url: "/originapi/order/create/charge",
					      type: "get",
					      data: rechData,
					      success: function(data) {
					      	if(data.status === true){
					      		Popup.MsgTip({msg: "下单成功，请前往支付"});
					      		setTimeout(function () {
					      			window.location.href = data.redirect;
					      		},300)
					        } else {
					       		Popup.MsgTip({msg: data.msg});
					       		self.setState({
					       			canGet: true
					       		})
					        }
					      },
					      error:function (err) {
					      	Popup.MsgTip({msg: "服务器繁忙"});
					      	self.setState({
				       			canGet: true
				       		})
					      }
					    });
					}
				} else {
					window.location.href = "trmall://to_login";
				}
			});
	      },
	      error:function(err){
	      	Popup.MsgTip({msg: "服务器繁忙"});
	      }
	    });
	};
	render(){
		let {status,data} = this.state;
		return(
			this.state.update?
      		<div data-page="recharge" >
				<section className="c-pr" id="recharge" >
				  <Nav fn={this.changeStatue} status={status} />
				  <Control status={status} data={data} />
				  <button className="recharge-btn disabled">立即充值</button>
				  <BottomBox />
				</section>
			</div>
			:<LoadingRound />
		)
	}
}

//nav
class Nav extends Component{
	componentDidMount(){
		let self = this;
		$('.recharge-nav li').click(function (e) {
			let status = $(this).attr('id');
			self.props.fn(status);
			$('.input-number input').val('');
			$('.recharge-btn').addClass('disabled');
			$('.info').css({display:'none'});
			$('.error').css({display:'none'});
		})
	};
	render(){
		let {status} = this.props;
		return (
			<ul className="recharge-nav c-fs15 c-c35 c-tc">
				<li className={status==='phone'?"active":""} id="phone">话费&流量</li>
				<li className={status==='qb'?"active":""} id="qb">Q币</li>
				<li className={status==='oil'?"active":""} id="oil">加油卡</li>
			</ul>
		)
	}
}

//充值控制
class Control extends Component{
	componentDidMount(){
		$(this.refs.control).css({height: $(window).height()});
	};
	render(){
		let {data,status} = this.props;
		return (
			<ul className="control" ref="control">
				<li className="phone" style={{display:(status==='phone'?'block':'none')}}><PhonePage data={data} /></li>
				<li className="qb" style={{display:(status==='qb'?'block':'none')}}><QBPage data={data.qbi} /></li>
				<li className="oil" style={{display:(status==='oil'?'block':'none')}}><OilPage data={data} /></li>
			</ul>
		)
	}
}

//话费页面
class PhonePage extends Component{
	componentWillMount(){
		let {data} = this.props;
		this.setState({
			operator: 'cm',
			totle:'0.00',
			pStatus:'hf'
		})
	};
	changeP=(status)=>{
		this.setState({
			pStatus:status
		})
		this.findChoose();
	};
	changeO=(status)=>{
		this.setState({
			operator:status
		})
		this.findChoose();
	};
	findChoose=()=>{
		$('.phone-page .bill-box').removeClass('choose');
		let p_bills = $('.phone-page .bill-box');
		if(p_bills.length>=3){
			$('.phone-page .bill-box').eq(2).addClass('choose');
		} else if (p_bills.length<3) {
			$('.phone-page .bill-box').eq(p_bills.length-1).addClass('choose');
		} else {
			//..
		}
	};
	componentDidMount(){
		let self = this;
		$('.phone-nav li').click(function (e) {
			let status = $(this).attr('id');
			self.changeP(status);
		});
		this.findChoose();
	};
	render(){
		let {data} = this.props;
		let {operator,totle,pStatus} = this.state;
		return (
			<div className="phone-page">
				<InputNumber numb={'phone-page'} changeO={this.changeO} pStatus={pStatus} />
				<PhoneNav pStatus={pStatus} />
				<Bill data={data[operator]} pStatus={pStatus} />
				{pStatus === 'hf'?'':<p className="c-tc c-cblue c-fs10" >全国可用,即时生效,当月有效</p>}
			</div>
		)
	}
}

//手机号
class InputNumber extends Component{
	componentDidMount(){
		let self=this;
		let {numb,fn,changeO} = this.props;
		let obj = {'cm':"中国移动",'cu':"中国联通",'ct':"中国电信"};
		let cc = 'cm';
		$('.'+numb+' .phone-number input').on('input keyup change',function (e) {
			let txt = $(this).val();
			txt = txt.replace(/\s*/g, "");
	      let result = [];
	      for(let i = 0; i < txt.length; i++){
	        if ((i>3?((i-3)%4):i%3) == 0 && i != 0){
	          result.push(" " + txt.charAt(i));
	        } else {
	          result.push(txt.charAt(i));
	        }
	      }
	      txt = result.join("");
	      $(this).val(txt);
			if(txt.length>=13){
				$(this).val(txt.substring(0,13));
			} else {
				$(this).next().next().css({display:'none'});
				$(this).next().css({display:'inline'});
			}
		  let reg = /^((13[4-9]|15[0-2]|15[7-9]|188|187|147|18[2-4]|178)|(13[0-2]|15[56]|18[56]|145|17[56])|(133|153|189|18[01]|177|149|173|170))\s*\d{4}\s*\d{4}$/.exec(txt);
	      if (reg) {
	        cc = reg[2] ? "cm" : reg[3] ? "cu" : "ct";
	        $(this).next().css({display:'none'});
			$(this).next().next().css({display:'inline'}).attr({id:cc}).html(obj[cc]);
			if(numb === 'phone-page'){
			  $('.recharge-btn').removeClass('disabled');
			  changeO(cc);
			} else {
				fn(true);
			}
	      } else {
        	if(numb === 'phone-page'){
			  $('.recharge-btn').addClass('disabled');
			} else {
				fn(false);
			}
	      }
		});
		$('.'+numb+' .get-num').click(function (e) {
			let urlNum = 'jsbridge://getContactPhoneNum';
			let num = $(this).prev().prev().prev();
			let self = $(this);
			window.onContactResult=(phoneNumber)=>{
				let aaa = phoneNumber.substring(0,3);
				let bbb = phoneNumber.substring(3,7);
				let ccc = phoneNumber.substring(7);
			    let txt = aaa+' '+bbb+' '+ccc;
		        if(txt.length>=13){
					txt = txt.substring(0,13);
				} else {
					self.prev().prev().css({display:'inline'});
				}
		        num.val(txt);
		        let reg = /^((13[4-9]|15[0-2]|15[7-9]|188|187|147|18[2-4]|178)|(13[0-2]|15[56]|18[56]|145|17[56])|(133|153|189|18[01]|177|149|173|170))\s*\d{4}\s*\d{4}$/.exec(txt);
		        if (reg) {
		          cc = reg[2] ? "cm" : reg[3] ? "cu" : "ct";
		          self.prev().prev().css({display:'none'});
				  self.prev().css({display:'inline'}).attr({id:cc}).html(obj[cc]);
				  if(numb === 'phone-page'){
					  $('.recharge-btn').removeClass('disabled');
					  changeO(cc);
					} else {
						fn(true);
					}
		        } else {
		          if(numb === 'phone-page'){
					  $('.recharge-btn').addClass('disabled');
					} else {
						fn(false);
					}
		        }
		    };
		    location.href = urlNum;
		})
	};
	render(){
		return(
			<div className="input-number phone-number">
				<input type="tel" placeholder="请输入手机号码" />
				<span className="error"> 请输入正确的手机号码</span>
				<span className="info"></span>
				<img className="get-num" src="/src/img/evaluate/mail-list.png" />
			</div>
		)
	}
}

//话费or流量
class PhoneNav extends Component{
	render(){
		let {pStatus} = this.props;
		return(
			<ul className="phone-nav">
				<div style={{height:'10px',background:'#f4f4f4',marginBottom:'10px'}}></div>
				<li id="hf" className={pStatus==='hf'?'c-cblue hf-ll':''}>话费</li>
				<li id="ll" className={pStatus==='ll'?'c-cblue hf-ll':''} style={{border:'none'}}>流量</li>
			</ul>
		)
	}
}

//话费、流量
class Bill extends Component{
	render(){
		let {data,pStatus} = this.props;
		let keyArr = [],valueArr=[],html='';
		if(data[pStatus]){
			for(let i in data[pStatus]){
				keyArr.push(i);
				valueArr.push(data[pStatus][i]);
			}
			html = keyArr.map(function (item,i) {
				return <EachBill key={i} oldPrice={item} price={valueArr[i]} pStatus={pStatus} />
			})
		};
		return(
			<div className="bill c-clrfix" ref="llp">
				{html}
			</div>
		)
	}
}

//单个话费、流量块
class EachBill extends Component{
	componentDidMount(){
		$('.bill-box').click(function (e){
			$(this).addClass('choose').parent().siblings().children().removeClass('choose');
			let price = $(this).find('.price').html();
		})
	};
	render(){
		let { oldPrice,price,pStatus } = this.props;
		return(
			<div className="each-bill c-fl c-tc">
				<div className="bill-box">
					<p className="c-fs20 c-c35"><span className="amount">{oldPrice=='1024'?'1':(oldPrice=='2048'?'2':oldPrice)}</span>{pStatus ==='hf'?'元':((oldPrice=='1024'||oldPrice=='2048')?'G':'M')}</p>
					<p className="c-fs10 c-c80">售价<span className="price">{price}</span>元</p>
				</div>
			</div>
		)
	}
}

//qb页面
class QBPage extends Component{
	render(){
		let {data} = this.props;
		return (
			<div className="qb-page" ref="qbPage">
				<InputQQ />
				<div style={{height: '10px', background: '#f4f4f4', marginBottom: '10px'}}></div>
				<QB data={data} />
				{false?<Type />:''}
				{false?<div className="c-fs14 c-cblue" style={{paddingLeft:'20px'}}>优惠价： ¥ <span style={{fontSize:'25px'}} className="amount">0.00</span></div>:''}
				<div className="c-tc c-cc9" style={{paddingTop:'10px'}} >
					<p>请认真核对号码，充值完成后将无法办理退款</p>
					<p>小于18周岁不能进行网络游戏虚拟货品交易</p>
				</div>
			</div>
		)
	}
}

//qb
class QB extends Component{
	componentWillMount(){
		let {data} = this.props;
		this.setState({
			price: data[1],
			mount:1
		})
	};
	componentDidMount(){
		let self = this;
		$('.qb-qb input').on('input keyup change',function (e) {
			let txt = $(this).val();
			txt = txt.replace(/[^0-9]/g,'');
			if(txt > 100){
				txt = txt.substring(0,txt.length-1)
			}
			$(this).val(txt);
			self.setState({
				mount: txt
			})
		}).focus(function (e) {
			if($(this).val()===''){
				self.setState({
					mount:0
				})
			}
		})
		$('input.qb-box').click(function (e) {
			$(this).addClass('choose').siblings().removeClass('choose');
			let txt = $(this).val()?parseInt($(this).val()):0;
			self.setState({
				mount:txt
			});
		});
	};
	render(){
		let {price,mount} = this.state;
		return(
			<div className="qb-qb">
				<div className="c-fs14 c-c35" style={{lineHeight:'44px'}}>充值面额</div>
				<div className="c-clrfix c-mb10" style={{width:'100%'}}>
					<input type="number" className="qb-box c-fs20 choose" value="1" readOnly />
					<input className="qb-box" type="number" placeholder="其它数额" />
				</div>
				<div className="c-fs14 c-cblue">优惠价： ¥ <span style={{fontSize:'25px'}} className="amount" id={mount}>{(parseFloat(price)*100*mount)/100}</span></div>
			</div>
		)
	}
}

//qq
class InputQQ extends Component{
	componentDidMount(){
		$('.qq-number input').on('input',function (e) {
			let reg = /^\d{5,15}$/;
			let txt = $(this).val();
			if(reg.test(txt)){
				$(this).next().css({display:'none'});
				$('.recharge-btn').removeClass('disabled');
			} else {
				$(this).next().css({display:'block'});
				$('.recharge-btn').addClass('disabled');
			}
		})
	};
	render(){
		return(
			<div className="input-number qq-number">
				<input type="number" placeholder="请输入qq号码" />
				<span className="error"> 请输入正确的qq号码</span>
			</div>
		)
	}
}

//充值类型&面额
class Type extends Component{
	componentDidMount(){
		$('.miane').click(function (e) {
			$('.cover-box').css({height:'100%'});
			$('.bottom-box').addClass('box-up');
		})
	}
	render(){
		return(
			<ul className="type c-fs15 c-mb20">
				<li>充值类型<span className="c-fr c-c80">Q币</span></li>
				<li className="miane">充值面额<span className="c-fr c-c80">1 Q币</span></li>
			</ul>
		)
	}
}



//底部弹窗
class BottomBox extends Component{
	closeBox=()=>{
		$('.bottom-box').removeClass('box-up');
		$('.cover-box').css({height:'0'});
	};
	render(){
		return(
			<div className="cover-box">
				<div className="bottom-box">
					<img onClick={this.closeBox} src="src/img/logistics/del.png" />
					<div className="specs" style={{padding:'0 2% 0'}}>
						<EachSpec />
					</div>
				</div>
			</div>
		)
	}
}

//弹窗内规格
class EachSpec extends Component{
	closeBox=()=>{
		$('.bottom-box').removeClass('box-up');
		$('.cover-box').css({height:'0'});
	};
	render(){
		return(
			<div className="each-spec c-fl c-tc">
				<div  onClick={this.closeBox} className="choose each c-tc c-fs14">
					1 Q币
				</div>
			</div>
		)
	}
}

//油卡页面
class OilPage extends Component{
	componentWillMount(){
		this.setState({
			oilName: 'sin'
		});
	};
	componentDidMount(){
		this.findChoose();
		let self = this;
		$('.oCard').click(function (e) {
			let card = $(this).attr('id');
			self.setState({
				oilName: card
			});
			self.findChoose();
			$('.oil-page input').val('');
			$('.oil-page .error').css({display:'none'});
			$('.oil-page .info').css({display:'none'});
		})
	};
	findChoose=()=>{
		$('.oil-page .bill-box').removeClass('choose');
		let o_bills = $('.oil-page .bill-box');
		let len = o_bills.length,has500 = false;
		if(len){
			for(let i=0; i<len; i++){
				if(o_bills.eq(i).find('.amount').html()=='500'){
					has500 = true;
					o_bills.eq(i).addClass('choose');
				}
			}
		}
		if(!has500 && len){
			o_bills.eq(o_bills.length-1).addClass('choose');
		}
	};
	render(){
		let {data} = this.props;
		let {oilName} = this.state;
		return(
			<div className="oil-page" ref="oil">
				<div className="kinds">
					<div id="sin" className={"oCard c-fl c-pr "+(oilName==='sin'?'choose':'')}>
						<img src="src/img/logistics/logo.png" />
						<p className="c-fs14">中国石化</p>
						<p className="c-c999">为加油卡充值</p>
						<img className="gou" src="src/img/logistics/gou.png" />
					</div>
					<div id="cn" className={"oCard c-fr c-pr "+(oilName==='cn'?'choose':'')}>
						<img src="src/img/logistics/logo2.png" />
						<p className="c-fs14">中国石油</p>
						<p className="c-c999">为加油卡充值</p>
						<img className="gou" src="src/img/logistics/gou.png" />
					</div>
				</div>
				<CardMsg oilName={oilName} />
				<OilBill data={data} oilName={oilName} />
				<p className="c-tc c-fs10" >支付即表示同意<a className="c-cblue" style={{textDecoration: 'underline'}} href="https://www.tairanmall.com/wap/content-info.html?article_id=103">《中国石化/石油加油卡客户网上充值协议》</a></p>
			</div>
		)
	}
}

//油卡信息
class CardMsg extends Component{
	componentWillMount(){
		this.setState({
			msg1:false,
			msg2:false,
			msg3:false
		})
	}
	componentDidMount(){
		let self = this;
		$('#oil-num').on('input keyup',function (e) {
			let txt = $(this).val();
			if(self.props.oilName === 'sin'){
				let reg = /^100011\d{13}$/;
				if(txt.length>=19){
					$(this).val(txt.substring(0,19));
				}
				if(reg.test(txt)){
					$(this).next().css({display:'none'});
					self.setState({
						msg1:true
					});
				} else {
					$(this).next().css({display:'inline'});
					self.setState({
						msg1:false
					});
				}
			} else {
				let reg = /^9\d{15}$/;
				if(txt.length>=16){
					$(this).val(txt.substring(0,16));
				}
				if(reg.test(txt)){
					$(this).next().css({display:'none'});
					self.setState({
						msg1:true
					});
				} else {
					$(this).next().css({display:'inline'});
					self.setState({
						msg1:false
					});
				}
			}
		});
		$('#user-name').on('input keyup',function (e) {
			let txt = $(this).val();
			let reg = /^[\u4E00-\u9FA5]|[0-9a-zA-Z]+(·[\u4E00-\u9FA5]+)*$/;
			if(reg.test(txt)){
				$(this).next().css({display:'none'});
				self.setState({
					msg3:true
				});
			} else {
				$(this).next().css({display:'inline'});
				self.setState({
					msg3:false
				});
			}
		});
		$('.card-msg input').on('input',function (e) {
			let {msg1,msg2,msg3} = self.state;
			if(msg1 && msg2 && msg3){
				$('.recharge-btn').removeClass('disabled');
			} else {
				$('.recharge-btn').addClass('disabled');
			}
		});
	};
	changeMsg2=(tf)=>{
		this.setState({
			msg2:tf
		});
	}
	render(){
		let {oilName} = this.props;
		return(
			<div className="card-msg">
				<div className="input-number sin">
					<input id="oil-num" type="number" placeholder={oilName==='sin'?"请输入19位油卡":"请输入16位油卡"} />
					<span className="error"> 请输入正确的油卡号码</span>
				</div>
				<InputNumber fn={this.changeMsg2} numb={'card-msg'} />
				<div className="input-number" style={{borderTop:'1px solid #e4e4e4'}}>
					<input id="user-name" maxLength="10" type="text" placeholder="请输入持卡人姓名" />
					<span className="error"> 请输入正确的姓名</span>
				</div>
			</div>
		)
	}
}

//油卡充值块
class OilBill extends Component{
	render(){
		let {data,oilName} = this.props;
		let keyArr = [],valueArr=[],html='';
		let oilData = (oilName==='sin'?data.sin.oil:data.cn.oil);
		if(oilData){
			for (let i in oilData) {
				if (oilData[i]) {
					keyArr.push(i)
					valueArr.push(oilData[i]);
				}
			}
				html = keyArr.map(function (item,i) {
				return <EachBill key={i} choose={i?false:true} oldPrice={item} price={valueArr[i]} pStatus={'hf'} />
			})
		};
		return(
			<div className="bill c-clrfix">
				{html}
			</div>
		)
	}
}