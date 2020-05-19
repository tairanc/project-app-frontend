import React, { Component } from 'react';
import { Link } from 'react-router';
import ReactDOM,{ render } from 'react-dom';
import { ownAjax } from '../../../js/common/ajax.js';
import Popup from 'component/modal';
import echo from  'plugin/echo.js';
import {LoadingRound } from 'component/common';
import 'src/scss/zeroBuyChannel.scss';
import 'src/scss/zeroBuyList.scss';
const zeroAPI = {
  init: {url: '/originapi/trcapi/v1/channel', type: 'get'}
}
export default
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabData:'',
      menuData:[],
      success:false
    }
  }
  componentDidMount() {
    ownAjax( zeroAPI.init,{cat_name:this.props.location.query.type}).then( result =>{
      this.setState({
        listData:result,
        tabData:result.catgoods,
        menuData:result.catgoods.goods_h5,
        success:true
      })
    }).catch( xhr =>{

    })
  }
  render() {
    const {listData}=this.state;
    return (
      <div data-page="zeroBuy-channel" className="main">
        {
          this.state.success?  <div>
            {
              listData?<div>
                <ListArea tabData={this.state.tabData} />
                <ListItem menuData={this.state.menuData} />
              </div>:''
            }
          </div>:null
        }
      </div>
    )
  }
}
export class ListArea extends Component {
  componentDidMount(){
    echo.init();
  }
  render() {
    const {tabData} = this.props
    return (<div className="apple-area" style={{paddingTop:'0px',marginTop:'0px'}}>
          <img data-echo={tabData.explain_img_h5} src="/src/img/icon/loading/default-watermark.png" />
      </div>
    )
  }
}
//单品成列
export class ListItem extends Component {
  componentDidMount() {
    echo.init();
  }
  render() {
    const {menuData} = this.props;
    let listHtml = menuData instanceof Array?menuData.map((val, i)=> {
      return (
        <div className="item-box-container" key={i}>
        <div className="item-box-list" key={i}>
          <div className="item-pic">
            <a href={val.link}>
              <img data-echo={val.img} src="/src/img/icon/loading/default-watermark.png" />
            </a>
          </div>
          <div className="item-des">
            <p className="des-text">{val.name}</p>
            <div className="des-price">
              <div className="p-lf">
                ￥{val.market_price}
              </div>

              <div className="p-at">
                存入<span className="p-ay">{val.invest_money}元</span>起
              </div>
            </div>
          </div>
        </div>
        </div>
      )
    }):null;
    return (
      <div className="item-container" style={{width:'100%',overflow:'hidden'}}>
        {listHtml}
      </div>
    )
  }
}