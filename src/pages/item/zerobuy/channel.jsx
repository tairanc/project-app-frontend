import React, { Component } from 'react';
import { Link } from 'react-router';
import ReactDOM,{ render } from 'react-dom';
import {ownAjax} from '../../../js/common/ajax.js';
import Popup from 'component/modal';
import echo from  'plugin/echo.js';
import {EmptyPage} from 'component/common';
import 'src/scss/zeroBuyChannel.scss';

const zeroAPI = {
  init: {url: '/originapi/trcapi/v1/channel?goods_num=4', type: 'get'}
}
export default
class Channel extends Component {
  componentWillMount(){
    document.title = '乐享';
    location.href="jsbridge://set_title?title=乐享";
    this.state = {
      tabData: [],
      menuData: [],
      itemData: [],
      success:false
    }
  }
  componentDidMount() {
    const self =this;
    ownAjax(zeroAPI.init, "").then((res)=> {
      self.setState({
        zeroData:res,
        tabData: res.banner,
        menuData: res.catgoods,
        itemData: res.catgoods,
        success:true
      });
    }).catch(()=> {
      Popup.MsgTip({msg: "网络错误，请稍后再试"});
    });
  }
  render() {
    const { tabData,menuData,itemData,zeroData}=this.state;
    return (
      <div data-page="zeroBuy-channel" className="main">
        {this.state.success?
          <div>
            {zeroData?(menuData.length==0&&tabData.length==0? <EmptyPage config={{
							msg:"商品不存在",
							bgImgUrl:"./src/img/shopCart/cart-noitem.png",
							noBtn:true
							}}
              />:<div>
              <ZeroTab tabData={tabData} />
              <ZeroMenu menuData={menuData}/>
              <ZeroItem itemData={itemData}/>
            </div>):''
            }
          </div>:null
        }
      </div>

    )
  }
}
//banner轮播
export class ZeroTab extends Component {
  componentDidMount() {
    let mySwiper = new Swiper(this.refs.banner, {
      autoplay: 2000,
      autoplayDisableOnInteraction: false,
      initialSlide: 0,
      speed: 1000,
      observer: true,
      observeParents: true,
      grabCursor: true,
      pagination: '.swiper-pagination',
      loop: true,
      lazyLoading : true
    });
  }

  render() {
    const {tabData} = this.props;
    return (
      <div className="zeroTab-page slider" data-plugin="swiper" >
        <div className="slider-touch" ref="banner">
          <ul className="swiper-wrapper">
            {tabData&&tabData.img_h5 instanceof Array?tabData.img_h5.map((item, i)=> {
              return <li className="swiper-slide" key={i}>
                <a href={item.link}>
                  <img className="swiper-lazy" data-src={item.img} />
                  <div className="swiper-lazy-preloader"></div>
                </a>
              </li>
            }):null}
          </ul>
        </div>
        <div className="swiper-pagination"></div>
      </div>
    )
  }
}
//list菜单
export class ZeroMenu extends Component {
  componentDidMount() {
    new Swiper(this.refs.secskill, {
      initialSlide: 0,
      speed: 1000,
      observer: true,
      observeParents: true,
      slidesPerView: 3,
	    onTouchMove:function(swiper){
      	$(window).trigger("scroll");
	    }
    });
    echo.init();
  }
  render() {
    const {menuData} = this.props;
    let menuHtml = menuData instanceof Array?menuData.map((item, i)=> {
      return <li className="swiper-slide" key={i}>
        <Link to={`/zeroBuyList?type=${item.cat_name}`}>
          <img data-echo={item.storey_img_h5} src="/src/img/icon/loading/default-watermark.png" />
        </Link>
        <p>{item.cat_name}</p>
      </li>
    }):null
    return (
      <div className="secskill-content" ref="secskill">
        <ul className="swiper-wrapper clearfix">
          {menuHtml}
        </ul>
      </div>
    )
  }
}
//广告区列表
export class ZeroItem extends Component {
  componentDidMount() {
    echo.init();
  }
  render() {
    const {itemData} = this.props;
    let itemHtml = itemData instanceof Array?itemData.map((val, i)=> {
      return (
        <div className="clearfix" key={i}>
          <div className="apple-area" key={i}>
            <Link to={`/zeroBuyList?type=${val.cat_name}`}>
              <img data-echo={val.explain_img_h5}  src="/src/img/icon/loading/default-watermark.png" />
            </Link>
          </div>
          { val.goods_h5 instanceof Array?val.goods_h5.map((key, j)=> {
            return (
              <div className="item-box" key={j}>
                <div className="item-pic">
                  <a href={key.link}>
                    <img data-echo={key.img} src="/src/img/icon/loading/default-watermark.png" />
                  </a>
                </div>
                <div className="item-des">
                  <p className="des-text">{key.name}</p>
                  <div className="des-price">
                    <div className="p-lf">
                      ￥{key.market_price}
                    </div>
                    <div className="p-at">
                      存入<span className="p-ay">{key.invest_money}元</span>起
                    </div>
                  </div>
                </div>
              </div>
            )
          }):null}
        </div>
      )
    }):null
    return (
      <div className="item-container" style={{width:'100%',overflow:'hidden'}}>
        {itemHtml}
      </div>
    )
  }
}