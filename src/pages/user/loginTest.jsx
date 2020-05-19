import React, {Component} from 'react';
import axios from 'axios';
// import { DropRefresh, DropList } from 'component/module/HOC/dropRefresh';

export default class LoginTest extends Component {
	constructor(props) {
		super(props);
		this.phone = "";
		this.pw = "";
	}
	componentWillMount() {
		if( process.env.NODE_ENV === "production" ){
			window.location.replace('https://m.tairanmall.com/');
		}
	}
	phoneHandle = (e) => {
		this.phone = e.target.value;
	};
	pwHandle = (e) => {
		this.pw = e.target.value;
	};
	submitHandle = () => {
		if (this.phone === "" || this.phone.length !== 11 || this.pw === "") {
			alert("账号密码不正确");
			return;
		}
		axios.request({
			url: "/account/user/login",
			method:"post",
			headers:{
				domain:".tairanmall.com",
			},
			data: `phone=${this.phone}&password=${this.pw}`
		}).then( result =>{
			alert("登录成功");
			window.history.back();
		}).catch( error =>{
			alert("登录失败");
		})
	}
	
	resetPW =()=>{
		axios.request({
			url:"/account/user/reset/password/login_password",
			method:"put",
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			},
			data:`phone=${this.phone}&newPassword=${this.pw}&smsCode=1311&type=thw_sms_dlmm`
		}).then( result =>{
			alert("重置成功");
		}).catch( error =>{});
	}
	
	unBindWeixin(){
		axios.request({
			url:"/account/user/oauth/bind/weixin",
			method:"delete"
		}).then( result =>{
			alert("解绑成功");
		})
	}
	registerAccount=()=>{
		axios.request({
			url:"/account/user/register",
			method:"post",
			data:`phone=${this.phone}&password=${this.pw}&smsCode=1311`
		}).then( result =>{
			alert("注册成功");
		})
	}
	
	loginOut(){
		axios.request({
			url:"/account/user/logout",
			method:"post",
		}).then( result =>{
			alert("退出成功");
		})
	}
	render() {
		return (
			<div>
				<div style={{borderBottom:"1px solid #f4f4f4"}} >
					<div style={{textIndent:"20px", fontSize:"18px",color:"blue" }}>登录</div><br/>
					<div>手机号：<input type="text" placeholder="请输入手机号" onInput={this.phoneHandle }/></div><br/>
					<div>密码：<input type="password" placeholder="请输入密码" onInput={ this.pwHandle }/></div><br/>
				</div>
				<div>
					<div  style={{borderBottom:"1px solid #f4f4f4", padding:"20px"}} >
						<button style={{width: "100px", background: "#ccc"}} type="button" onClick={ this.submitHandle }>登录</button>
					</div>
					<div  style={{borderBottom:"1px solid #f4f4f4", padding:"20px"}} >
						<button style={{width: "100px", background: "#ccc"}} type="button" onClick={ this.resetPW }>重置密码</button>
					</div>
					<div  style={{borderBottom:"1px solid #f4f4f4", padding:"20px"}} >
						<button style={{width: "100px", background: "#ccc"}} type="button" onClick={ this.registerAccount }>注册账号</button>
					</div>
				</div>
			</div>
		)
	}
}


/*export default class Test extends Component{
	constructor(props){
		super(props);
		this.state={
			num:40
		}
	}
	componentDidMount(){
		 // this.refs.text.style.height = "400px";
	}
	dropEvent=( drop )=>{
		if( this.state.num >= 80 ){
			drop.locked();
			return;
		}
		setTimeout( ()=>{
			
			this.setState( ( state )=>{
				return { num: state.num + 10 }
			})
			drop.refresh();
		},1000)
		
	}
	
	getData= async ()=>{
		let result = await new Promise( ( resolve, reject) =>{
			setTimeout( ()=>{
				console.log(111);
				resolve("finish")
			},1000)
		});
		throw new Error( 111 );
		return result;
	};
	
	render(){
		return <div ref="text">
			<DropList getData={ this.getData }   >
				{
					 Array.apply(null,Array(this.state.num)).map(( item, i)=>{
						return <div key={i}>这里是内容{i}</div>
					})
				}
			</DropList>
		</div>
	}
}*/
