import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import {PureComponent} from 'component/modules/HOC';
import styles from './ErrorPage.scss';

@CSSModules(styles, {allowMultiple: true})
export default class ErrorPage extends PureComponent{
	static defaultProps = {
		text: "网络异常，点击重试~",
		btnText: "重新加载",
		link: "",
		imgUrl: require('./img/net-error.png'),
		imgWidth:110,
		imgHeight:110,
		btnStyle:{},
		zIndex:0,
		btnClick:()=>{},
	};
	render(){
		const {props} = this;
		return(
			<div styleName="errorPage" style={{zIndex:props.zIndex}}>
				<div styleName="content">
					<div>
						<img src={props.imgUrl} width={props.imgWidth} height={props.imgWidth} />
					</div>
					<p className="c-fs12 c-cc9 c-mt10">{props.text}</p>
					<div styleName="reloadBtn" style={props.btnStyle} onClick={this.props.btnClick}>{props.btnText}</div>
				</div>
			</div>
		)
	}
}