import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import styles from  './dropRefresh.scss';


@CSSModules(styles)
export class DropRefresh extends Component{
	constructor(props){
		super(props);
		this.scrollArea = window;
		this.status = 'down';
		this.isLock = false;
		this._disBt = props.disBt;
		
	}
	static defaultProps = {
		scrollArea: window,
		local:false,
		disBt: 40
	};
	
	componentDidMount(){
		this.scrollArea = this.props.local ? this.refs.wrap : window;
		this._addEvent();
	}
	
	_getBtmText( status ){
		switch(status){
			case "load":
				return <div styleName="drop-btm">加载中 <i styleName="loading"> </i></div>	;
			case 'down':
				return <div styleName="drop-btm">↓下拉刷新</div>;
			case 'finish':
				return <div styleName="drop-btm">没有更多了</div>;
		}
	}
	
	_scrollEvent=()=>{
		if( this.scrollArea === window ){
			let scrollTop =  window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
			let winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			if( document.body.scrollHeight < scrollTop + this._disBt + winHeight ){
				this._executeCallBack();
			}
		}else{
			if( this.scrollArea.scrollHeight < this.scrollArea.scrollTop + this._disBt + this.scrollArea.clientHeight ){
				this._executeCallBack();
			}
		}
	};
	
	_addEvent(){
		if( !this.isLock ){
			this.scrollArea.addEventListener( "scroll", this._scrollEvent );
			this._scrollEvent();
		}
	}
	
	_removeEvent(){
		this.scrollArea.removeEventListener("scroll", this._scrollEvent );
	}
	
	_executeCallBack(){
		this.status = 'load';
		this._removeEvent();
		this.props.dropEvent( this );
		this.forceUpdate();
	}
	
	refresh=()=>{
		this.status = 'down';
		this._addEvent();
		this.forceUpdate();
	};
	
	locked=()=>{
		this.status = 'finish';
		this.isLock = true;
		this._removeEvent();
		this.forceUpdate();
	}
	
	unLock=()=>{
		this.status = 'down';
		this.isLock = false;
		this._addEvent();
		this.forceUpdate();
	};
	
	render(){
		return <div ref="wrap" styleName="drop-refresh" >
			{this.props.children}
			{this._getBtmText( this.status )}
		</div>
	}
}


/*
export class DropList extends DropRefresh{
	constructor(props) {
		super(props);
		this.data = "";
		this.refreshFn = '';
	}
	async _executeCallBack(){
		this.status = 'load';
		this._removeEvent();
		this.forceUpdate();
		let result = await this.props.getData();
		this._handleResult(result);
	}
	_handleResult( result ){
		this.data = result.data;
		this.isRefresh = result.refresh;
		this.isLock = result.isLock;
	}
	render(){
		return super.render();
	}
}*/
