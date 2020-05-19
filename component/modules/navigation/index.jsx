import React, { Component } from 'react';
import { Link,browserHistory } from 'react-router';
import styles from './index.scss';

export default class Navigator extends Component{
	
	replaceUrl=( url,e )=>{
		e.preventDefault();
		browserHistory.replace( url );
	};
	
	render(){
		return <div className={ styles.navigation }>
				<Link to="/homeIndex"
				      className={ styles.navLink }
				      onClick={ this.replaceUrl.bind( this,"/homeIndex") }
				      activeClassName={styles.navActive} >
					<div className={styles.navIcon +" "+ styles.navHome}> </div>
					<div className={ styles.navText}>推荐</div>
				</Link>
			<Link to="/shopCart"
			      className={ styles.navLink }
			      onClick={ this.replaceUrl.bind( this,"/shopCart") }
			      activeClassName={styles.navActive} >
				<div className={styles.navIcon +" "+ styles.navCart}>
				</div>
				<div className={ styles.navText}>购物袋</div>
			
			</Link>
				<Link to="/userCenter"
				      className={ styles.navLink }
				      onClick={ this.replaceUrl.bind( this,"/userCenter")}
				      activeClassName={styles.navActive}>
					<div className={styles.navIcon +" "+ styles.navUser}> </div>
					<div className={ styles.navText}>我的</div>
				</Link>
		</div>
	}
}
