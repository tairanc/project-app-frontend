import React, { Component } from 'react';
import { Link } from 'react-router';
import Popup from 'component/modal';
import 'src/scss/afterSale.scss';

export default class AfterSale extends Component{
	componentDidMount() {
		$(this.refs.page).css({minHeight:$(window).height()});
	}
	render(){
		return(
			<div data-page="after-sale" ref="page">
				{this.props.children}
			</div>
		)
	}
}