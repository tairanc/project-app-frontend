import React, { Component } from 'react';
import styles from  './index.scss';

export const Shady =(props)=>{
	return(
		<div style={ props.styles || {} }
		     className={styles.shady}
		     onTouchMove={ (e)=> e.preventDefault() }>
		</div>
	)
}

