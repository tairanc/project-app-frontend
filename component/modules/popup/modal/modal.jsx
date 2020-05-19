import React, {Component} from 'react';
// import CSSModules from 'react-css-modules'
import styles from  './modal.scss';
import {Modal} from '../index.jsx';
import {Shady} from '../../shady';

// @CSSModules(styles, {allowMultiple: true})
class ModalA extends Component {
	constructor(props) {
		super(props);
		// 初始状态
		this.isMount = true;
		this.state = {show: false};
	}
	
	componentDidMount() {
		setTimeout(()=>{
			this.setState({show: true});
		},0);
	}
	
	componentWillUnmount() {
		this.isMount = false;
	}
	
	modalClose = () => {
		if( this.isMount ){
			this.setState({show: false});
			setTimeout(() => {
				this.props.destroy();
			}, 200);
		}
	};
	
	modalSure = () => {
		if( this.isMount ){
			this.modalClose();
			this.props.sure && this.props.sure();
		}
	};
	
	render() {
		return (
			<div>
				<Shady/>
				<div className={`${styles.modal} ${ this.state.show ? styles.active : "" }`}>
					<div className={styles.modalText}>
						<span>{this.props.msg}</span>
					</div>
					<div className={styles.modalBtn}>
						<div onClick={ this.modalClose }>
							<span>取消</span>
						</div>
						<div onClick={ this.modalSure }>
							<span>确定</span>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export const modalA = new Modal(ModalA);