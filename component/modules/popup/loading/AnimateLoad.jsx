import React, {Component} from 'react';
import styles from './AnimateLoad.scss';

const AnimateLoad = ({style, isFixed}) => {
	return <div className={ isFixed ? styles.fixedLoad: styles.spaceLoad } style={style?style:{}}>
		<div className={styles.animateArea}>
			<div className={styles.ball +" " + styles.redBall}> </div>
			<div className={ styles.ball +" " + styles.blueBall}> </div>
		</div>
		<p className={styles.loadText}>努力加载中~</p>
	</div>
};


export default AnimateLoad;