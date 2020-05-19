import React, {Component} from 'react';
import styles from './SwipeCtrlWidget.scss';
import {PureComponent} from '../PureComponent';


export default class SwipeCtrlWidget extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			boxLeft: 0
		}
	}
	
	static defaultProps = {
		ctrlWidth: 115,
		winWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
		isOpen:false,
		getIsOpen:()=>{}
	};
	
	componentWillReceiveProps( newProps ) {
		if(this.props.isOpen !== newProps.isOpen ){
			this.posAnimation( newProps.isOpen ? this.props.ctrlWidth: 0);
		}
	}
	
	componentWillMount() {
		if(this.props.isOpen){
			this.setState({ boxLeft: this.props.ctrlWidth});
		}else{
			this.setState({ boxLeft: 0});
		}
	}
	
	boxStyle = (x) => {
		return {
			WebkitTransform: `translate3d(${x}px,0,0)`,
			transform: `translate3d(${x}px,0,0)`
		}
	};
	
	posAnimation = (endPos, speed = 400, frames = 30) => {
		let perDis = Math.ceil(speed / frames);
		if( endPos === this.state.boxLeft ){
			if(endPos > 0){
				this.props.getIsOpen(true)
			}else{
				this.props.getIsOpen(false);
			}
			return;
		}
		let direct = endPos > this.state.boxLeft;
		this._posTimer = setInterval(() => {
			if (direct) {
				let onceEnd = this.state.boxLeft + perDis;
				if (onceEnd < endPos) {
					this.setState({boxLeft: onceEnd});
				} else {
					this.setState({boxLeft: endPos});
					clearInterval(this._posTimer);
					this.props.getIsOpen(true);
				}
			} else {
				let onceEnd = this.state.boxLeft - perDis;
				if (onceEnd > endPos) {
					this.setState({boxLeft: onceEnd});
				} else {
					this.setState({boxLeft: endPos});
					clearInterval(this._posTimer);
					this.props.getIsOpen(false);
				}
			}
			
		}, 1000 / frames);
	};
	
	getStartPos = (e) => {
		clearInterval(this._posTimer);
		this._gesturePosX = e.touches[0].pageX;
		// this._gesturePosY = e.touches[0].pageY;
	};
	
	gestureMove = (e) => {
		e.stopPropagation();
		let curX = e.touches[0].pageX;
		// let curY = e.touches[0].pageY;
		let moveDis = this._gesturePosX - curX;
		if (moveDis > 0) {
			if (this.state.boxLeft + moveDis < this.props.ctrlWidth) {
				this.setState({boxLeft: this.state.boxLeft + moveDis})
			} else {
				this.setState({boxLeft: this.props.ctrlWidth})
			}
		} else {
			if (this.state.boxLeft + moveDis > 0) {
				this.setState({boxLeft: this.state.boxLeft + moveDis});
			} else {
				this.setState({boxLeft: 0});
			}
		}
		this._gesturePosX = curX;
		
	};
	
	gestureEnd = () => {
		if (this.state.boxLeft > this.props.ctrlWidth / 2) {
			this.posAnimation(this.props.ctrlWidth);
		} else {
			this.posAnimation(0);
		}
	};
	
	render() {
        let firstChildrenHight = this.refs.swipeMain ? `${this.refs.swipeMain.clientHeight}px` : 'auto'// 兼容ios
		return <div className={styles.swiperWrap}>
			<div className={styles.swipeBox}
			     style={{
				     width: this.props.winWidth + this.props.ctrlWidth,
				     ...this.boxStyle(-this.state.boxLeft)
			     }}
			     onTouchStart={this.getStartPos}
			     onTouchMove={this.gestureMove}
			     onTouchEnd={this.gestureEnd}>
				<div className={styles.swipeMain}
                     ref={'swipeMain'}
				     style={{width: this.props.winWidth}}>
					{ this.props.children[0] || this.props.children }
				</div>
				<div style={{width: this.props.ctrlWidth, height: firstChildrenHight}}>
					{ this.props.children[1] }
				</div>
			</div>
		</div>
	}
}

export class ItemCtrl extends Component {
	render() {
		return <div className={styles.ctrlBtn} style={{width: this.props.width + "px" || "115px"}}>
			{ this.props.noCollect || <div className={styles.collect}>
				<div className={styles.textWrap} onClick={this.props.handleCollect}>
					<p>移入</p>
					<p>收藏</p>
				</div>
			</div>}
			<div className={styles.delete} onClick={this.props.handleDelete}>
				<p>删除</p>
			</div>
		</div>
	}
}

SwipeCtrlWidget.ItemCtrl = ItemCtrl;