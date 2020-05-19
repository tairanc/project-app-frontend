import React, { Component } from 'react';
import styles from  './dropRefresh.scss';

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
	
	componentWillUnmount(){
		this._removeEvent();
	}
	
	_getBtmText( status ){
		switch(status){
			case "load":
				return <div className={styles.dropBtm}><i className={styles.loading}> </i>加载中</div>	;
			case 'down':
				return <div className={styles.dropBtm}>↓下拉刷新</div>;
			case 'finish':
				return <div className={styles.dropBtm}>别拉了，我是有底线的~</div>;
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
		return <div ref="wrap" className={styles.dropRefresh} >
			{this.props.children}
			{this._getBtmText( this.status )}
		</div>
	}
}


