import React, {Component} from 'react';
import {PureComponent} from 'component/modules/HOC/PureComponent';
import styles from  './modal.scss';
import  CSSModules from 'react-css-modules';

@CSSModules(styles, {allowMultiple: true})
export class NewModal extends Component {
	render() {
		let {isOpen} = this.props;
        return (
			<div>
				{isOpen ? <div styleName="shady" onClick={this.props.onClose}></div> : ""}
				<div styleName={`animationModal ${isOpen ? "active" : ""}`} style={{borderRadius:'10px 10px 0 0'}}>
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

