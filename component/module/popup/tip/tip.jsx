import React, { Component } from 'react';
import styles from  './tip.scss';
import { Prompt } from '../index.jsx';

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
			this.setState({
				show:true
			});
		},0)
		
		setTimeout(()=>{
			if( this.isMount ){
				this.setState({
					show:false
				});
			}
			setTimeout(()=>{
				this.props.destroy();
			},500);
		},2500 );
	}
	componentWillUnmount(){
		this.isMount = false;
	}
	render(){
		return (
			<div className={styles.tip}>
				<div className={`${styles.tipText} ${ this.state.show ? styles.active:""}`}>
					{this.props.msg }
				</div>
			</div>
			
		)
	}
}

export const tip = new Prompt(Tip);