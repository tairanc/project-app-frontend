import React, { Component } from 'react';
import ReactDOM,{ render } from 'react-dom';
import { Link } from 'react-router';
import Popup from 'component/modal';
import { LoadingRound } from 'component/common';

import 'src/scss/recharge.scss';

export default class Recharge extends Component{
	constructor(props) {
		super(props);
		let self = this;
		this.state = {
			update:false,
			data:[],
			status:'话费',
			isShow:false
		}
	};
	static contextTypes = {
		store:React.PropTypes.object,
		router:React.PropTypes.object
	};
	changeStatue=(status)=>{
		let self = this;
		self.setState({
			status:status
		});
	};
	changeShow=(tOrF)=>{
		this.setState({
			isShow:tOrF
		});
	}
	componentWillMount(){
		document.title="充值中心";
		window.location.href = "jsbridge://set_title?title=充值中心";
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
      },
      error:function(err){
      	Popup.MsgTip({msg: "服务器繁忙"});
      }
    });
	};
	render(){
		let {status,data,isShow} = this.state;
		return(
			this.state.update?
      		<div data-page="recharge" >
				<section  id="recharge" ref="recharge" >
				  <Nav fn={this.changeStatue} fnChange={this.changeShow} />
				  <Control status={status} data={data} fnChange={this.changeShow} isShow={isShow} />
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
			$(this).addClass('active').siblings().removeClass('active');
			let txt = $(this).html();
			self.props.fn(txt);
			self.props.fnChange(false);
			$('.recharge-btn').addClass('disabled');
		})
	};
	render(){
		return (
			<ul className="recharge-nav c-fs14 c-c35 c-tc c-fb">
				<li className="active" id="phone">话费</li>
				<li id="data">流量</li>
				<li id="qbi">Q币</li>
			</ul>
		)
	}
}

//充值控制
class Control extends Component{
	render(){
		let {status,data,fnChange,isShow} = this.props;
		return (
			<ul className="control">
				<li className="phone" style={{display:(status==='话费'?'block':'none')}}><EachPage clas={'a'} status={status} data={data} fnChange={fnChange} isShow={isShow} /></li>
				<li className="data" style={{display:(status==='流量'?'block':'none')}}><EachPage clas={'b'} status={status} data={data} fnChange={fnChange} isShow={isShow} /></li>
				<li className="qb" style={{display:(status==='Q币'?'block':'none')}}><EachPage clas={'c'} status={status} data={data.qbi} /></li>
			</ul>
		)
	}
}

//单个页面
class EachPage extends Component{
	componentWillMount(){
		let {data} = this.props;
		this.setState({
			operator: 'cm',
			totle:'0.00'
		})
	};
	changeOpe=(ope)=>{
		this.setState({
			operator:ope
		})
	};
	changeTotle=(price)=>{
		this.setState({
			totle:price
		})
	}
	render(){
		let {status,data,fnChange,isShow,clas} = this.props;
		let {operator,totle} = this.state;
		return (
			<div className={"each-page "+clas}>
				{status === 'Q币'?<InputQQ />:<InputNumber clas={clas} fn={this.changeOpe} fnt={this.changeTotle} fnChange={fnChange} />}
				{status === 'Q币'?<QB data={data} />:<Bill data={data[operator]} status={status} fn={this.changeTotle} />}
				<RechargeBtn status={status} clas={clas} isShow={isShow} totle={totle} />
			</div>
		)
	}
}

//手机号
class InputNumber extends Component{
	componentDidMount(){
		let self=this;
		let {fn,fnt,fnChange,clas} = this.props;
		let obj = {'cm':"中国移动",'cu':"中国联通",'ct':"中国电信"};
		$('.'+clas+' .phone-number input').on('input keyup',function (e) {
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
        let cc = reg[2] ? "cm" : reg[3] ? "cu" : "ct";
        fn(cc);
        $(this).next().css({display:'none'});
				$(this).next().next().css({display:'inline'}).attr({id:cc}).html(obj[cc]);
				$('.recharge-btn').removeClass('disabled');
				let price = $(this).parent().parent().find('.choose').find('.price').html();
				fnt(price);
				fnChange(true);
      } else {
      	$('.recharge-btn').addClass('disabled');
      	fnChange(false);
      }
		});
	};
	render(){
		return(
			<div className="input-number phone-number">
				<input type="tel" placeholder="请输入手机号码" />
				<span className="error"> 请输入正确的手机号码</span>
				<span className="info"></span>
				<a href="javascript:void(0)"><img src="/src/img/evaluate/mail-list.png" /></a>
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

//话费、流量
class Bill extends Component{
	render(){
		let {data,status,fn} = this.props;
		status = (status==='话费'?'hf':'ll');
		let keyArr = [],valueArr=[],html='';
		if(data){
			for(let i in data[status]){
				keyArr.push(i);
				valueArr.push(data[status][i]);
			}
			html = keyArr.map(function (item,i) {
				return <EachBill fn={fn} key={i} choose={i?false:true} oldPrice={item} price={valueArr[i]} status={status} />
			})
		};
		return(
			<div className="bill c-clrfix">
				{status === 'hf'?'':<div style={{color:'#27a1e5',padding: '15px 0 0 8px'}}>全国通用,仅当月有效</div>}
				{html}
			</div>
		)
	}
}

//单个话费、流量块
class EachBill extends Component{
	componentDidMount(){
		let {fn} = this.props;
		$('.bill-box').click(function (e){
			$(this).addClass('choose').parent().siblings().children().removeClass('choose');
			let price = $(this).find('.price').html();
			fn(price);
		})
	};
	render(){
		let { oldPrice,price,status,choose } = this.props;
		return(
			<div className="each-bill c-fl c-tc">
				<div className={choose?"bill-box choose":"bill-box"}>
					<p className="c-fs20 c-c35"><span className="amount">{oldPrice}</span>{status ==='hf'?'元':'M'}</p>
					<p className="c-fs10 c-c80">售价<span className="price">{price}</span>元</p>
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
		$('.qb-qb input').on('input',function (e) {
			let txt = $(this).val();
			$(this).val(txt.replace(/\D/g,''));
			if(txt === 100){
				$(this).val(txt);
			} else if(txt > 100){
				$(this).val(txt.substring(0,txt.length-1));
			}
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
		$('div.qb-box').click(function (e) {
			$(this).addClass('choose').siblings().removeClass('choose');
			self.setState({
				mount:1
			});
		});
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
					<input className="qb-box c-fs20 choose" value="1" readOnly />
					<input className="qb-box" type="number" placeholder="其它数额" />
				</div>
				<div className="c-fs14 c-cblue">优惠价： ¥ <span style={{fontSize:'25px'}} className="amount" id={mount}>{parseFloat(price)*mount}</span></div>
			</div>
		)
	}
}

//立即充值
class RechargeBtn extends Component{
	componentDidMount(){
		let {clas} = this.props;
		let self = this;
		$('.'+clas+' .recharge-btn').click(function (e) {
			if($(this).attr('class')==='recharge-btn'){
				let num = $(this).prev().prev().find('input').val().replace(/\s/g,''),
						amount = (self.props.status==='Q币')?parseInt($(this).prev().find('.choose').val()):1,
						name = (self.props.status==='Q币')?'qbi_1':($(this).parent().parent().attr('class')+'_'+$(this).prev().prev().find('.info').attr('id')+'_'+$(this).prev().find('.choose .amount').html());
				$.ajax({
		      url: "/originapi/order/create/charge",
		      type: "get",
		      data: {
		        number: num,
		        amount: amount,
		        name: name
		      },
		      success: function(data) {
		      	if(data.status === true){
		      		Popup.MsgTip({msg: "下单成功，请前往支付"});
			    		window.location.href = data.redirect;
		        } else {
		       		Popup.MsgTip({msg: data.message});
		        }
		      },
		      error:function (err) {
		      	Popup.MsgTip({msg: "服务器繁忙"});
		      }
		    });
			}
		});
	};
	render(){
		let {status,totle,isShow} = this.props;
		return(
			<button className="recharge-btn disabled">立即充值{isShow?(status==='Q币'?'':'：¥'+totle):''}</button>
		)
	}
}
