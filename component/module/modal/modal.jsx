import React, {Component} from 'react';
import {PureComponent} from 'component/module/HOC/PureComponent';
import styles from  './modal.scss';
import  CSSModules from 'react-css-modules';

@CSSModules(styles, {allowMultiple: true})
export class NewModal extends Component {
	render() {
		let {isOpen} = this.props;
		// console.log(isOpen);
		return (
			<div>
				{isOpen ? <div styleName="shady" onClick={this.props.onClose}></div> : ""}
				<div styleName={`animationModal ${isOpen ? "active" : ""}`}>
					{this.props.title && <span styleName="title">{this.props.title}</span>}
					<span styleName="closeBtn" onClick={this.props.onClose}><i></i></span>
					<div>
						{this.props.children}
					</div>
				</div>
			</div>
		)
	}
}

