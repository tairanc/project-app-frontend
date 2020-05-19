import React, { Component } from 'react';
import styles from  './PopupLoading.scss';
import {Shady} from '../../shady';

//弹窗加载
const PopupLoading = ()=>(
	<div>
		<Shady styles={{background:"transparent"}}/>
		<div className={styles.popupLoad }>
			<div className={styles.popupLoadBox}>
				<div className={styles.popupLoadImg}> </div>
			</div>
			<div className={styles.popupLoadText}>Loading ...</div>
		</div>
	</div>
)

export default PopupLoading;