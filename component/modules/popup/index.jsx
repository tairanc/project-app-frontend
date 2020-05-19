import React, { Component } from 'react';
import ReactDOM  from 'react-dom';

export class Modal{
	constructor( Component ){
		this.component = Component;
		this.isMount = false;
		this.node = document.createElement('div');
	}
	show=( config )=>{
		ReactDOM.render(
			React.createElement(
				this.component,
				{
					...config,
					destroy:this.destroy
				}
			),
			this.node
		);
		document.body.appendChild( this.node );
		this.isMount = true;
		return this.node;
	};
	destroy=()=>{
		if( this.isMount ){
			ReactDOM.unmountComponentAtNode( this.node );
			document.body.removeChild( this.node );
			this.isMount = false;
		}
		
	}
	
}


let prompt_id = 0;

export class Prompt{
	constructor( Component ){
		this.component = Component;
		this.promptManage = {};
	}
	show( config ){
		let node = document.createElement('div');
		let _id = ++prompt_id;
		ReactDOM.render(
			React.createElement(
				this.component,
				{
					...config,
					destroy:this._destroy.bind( this, `prompt_${_id}` )
				}
			),
			node
		);
		document.body.appendChild( node );
		this.promptManage[`prompt_${_id}`] = node;
	}
	_destroy=( _id )=>{
		if( _id in this.promptManage ){
			ReactDOM.unmountComponentAtNode(this.promptManage[_id] );
			document.body.removeChild( this.promptManage[_id] );
			delete this.promptManage[_id];
		}
	};
	destroy =()=>{
		let keys = Object.keys( this.promptManage );
		if( !keys.length ) return;
		keys.forEach( _id =>{
			ReactDOM.unmountComponentAtNode(this.promptManage[_id] );
			document.body.removeChild( this.promptManage[_id] );
			delete this.promptManage[_id];
		})
	}
}

