import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import styles from  './mask.scss';
import { Modal } from '../index.jsx';

@CSSModules(styles)
class MaskWait extends Component{
	render(){
		return <div styleName="mask">
			<img styleName="mask-load" src={ require("./img/loading-round-red.gif")} />
		</div>
	}
}


export const loadMask = new Modal(MaskWait);

