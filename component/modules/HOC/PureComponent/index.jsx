import { Component } from 'react';

function shallowEqual(obj, newObj){
	if(obj === newObj){
		return true;
	}
	const objKeys = Object.keys(obj);
	const newObjKeys = Object.keys(newObj);
	if( objKeys.length !== newObjKeys.length ){
		return false;
	}
	return objKeys.every(key=>{
		return obj[key] === newObj[key];
	})
}

export class PureComponent extends Component{
	shouldComponentUpdate(newProps, newState) {
		return !shallowEqual(this.props, newProps) || !shallowEqual(this.state, newState);
	}
}