import React, { Component } from 'react';
import styles from  './mask.scss';
import { Modal } from '../index.jsx';

class MaskWait extends Component{
	render(){
		return <div className={styles.mask}>
			<img className={styles.maskLoad} src={ require("./img/loading-round-red.gif")} />
		</div>
	}
}


export const loadMask = new Modal(MaskWait);

