import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import styles from  './tip.scss';
import { Prompt } from '../index.jsx';

@CSSModules(styles,{ allowMultiple:true })
class Tip extends Component{
	constructor(props) {
		super(props);
		this.isMount = true;
		this.state = {
			show:false
		};
	}
	componentDidMount() {
		setTimeout(()=>{
			if( this.isMount ){
				this.setState({ show: true });
			}
		},0);
		
		setTimeout(()=>{
			if( this.isMount ){
				this.setState({ show: false });
			}
			setTimeout(()=>{
				this.props.destroy();
			},500);
		},2000 );
	}
	componentWillUnmount(){
		this.isMount = false;
	}
	render(){
		return (
			<div styleName="tip">
				<div styleName={`tip-text ${ this.state.show ? "active":""}`}>
					{this.props.msg }
				</div>
			</div>
			
		)
	}
}

export const tip = new Prompt(Tip);