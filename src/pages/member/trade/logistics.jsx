import React, {Component} from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import Popup from 'component/modal';
import {LoadingRound} from 'component/common';
import {RNDomain,MALLAPI} from 'src/config/index'
import axios from 'js/util/axios'
import {addImageSuffix} from "js/util/index";
import 'src/scss/logistics.scss';
const ctrlAPI = {
  packageInfo: {url: `${MALLAPI}/user/shopOrderPackage/info`, method: "get"},   //包裹信息
  tracking: {url: `${MALLAPI}/user/orderTracking/get`, method: "get"} //物流数据
};

let mySwiper = {}
export default class LogisticsPage extends Component {
  constructor(props, context) {
    super(props);
    let {tid} = props.location.query;
    this.state = {
      tid: tid,
      update: false,
      logisticsData: []
    }
  };

  static contextTypes = {
    store: React.PropTypes.object,
    router: React.PropTypes.object
  };

  componentWillMount() {
    document.title = '查看物流';
    window.location.href = 'jsbridge://set_title?title=查看物流';
    $(this.refs.logistics).css({minHeight: $(window).height()});
    if (!this.state.tid) {
      browserHistory.push("/");
    }
    let self = this;
    axios.request({
      ...ctrlAPI.packageInfo,
      params: {order_shop_no: this.state.tid}
    }).then(({data}) => {
      if (data.code === 0) {
        let newArr = data.data.packed;
        let newArr2 = data.data.unpacked;
        self.setState({
          logisticsData: newArr,
          update: true
        });
        //swiper---start
        let dLength = newArr.length;
        if (dLength > 1) {
          let navSwiper = new Swiper('.packages-nav', {
            observer: true,
            observeParents: true,
            slidesPerView: dLength === 2 ? 2 : 3,
            spaceBetween: 15,
            freeMode: true
          });
          mySwiper = new Swiper('.packages-control', {
            roundLengths: true,
            observer: true,
            onSlideChangeStart: function (swiper) {
              navSwiper.slideTo(swiper.activeIndex - 1, 300, false);
              $('.packages-nav li').eq(swiper.activeIndex).addClass('active').siblings().removeClass('active');
            }
          });
          $('.packages-nav li').click(function (e) {
            $(this).addClass('active').siblings().removeClass('active');
            let cindex = $(this).index();
            navSwiper.slideTo(cindex - 1, 300, false);
            mySwiper.slideTo(cindex, 300, false);
          });
        }
        //swiper---end
      } else {
        Popup.MsgTip({msg: "订单号错误"});
      }
    }).catch(err => {
      Popup.MsgTip({msg: "服务器繁忙"});

    })
  };

  render() {
    let {logisticsData} = this.state;
    return (
        this.state.update ?
            <div data-page="logistics-page">
              <section id="logistics-page" ref="logistics" data-plugin="swiper">
                {logisticsData.length > 1 ? <PackagesNav data={logisticsData}/> : ''}
                <PackagesControl data={logisticsData}/>
              </section>
            </div>
            : <LoadingRound/>
    )
  }
}

//包裹nav
class PackagesNav extends Component {
  render() {
    let {data} = this.props;
    let nav = data.map(function (item, i) {
      return <li key={i} className={(i ? '' : 'active') + ' swiper-slide'}>{'包裹' + (i + 1)}</li>
    })
    return (
        <div className="packages-nav c-fs14 c-tc swiper-container" style={{padding: '0 7px'}}>
          <ul className="swiper-wrapper">
            {nav}
          </ul>
        </div>
    )
  }
}

//包裹控制
class PackagesControl extends Component {
  componentDidMount() {
    $(this.refs.packagesControl).css({minHeight: $(window).height() - 40});
  }

  render() {
    let {data} = this.props;
    let packages = '';
    packages = data.map(function(item, i){
      let className = 'package' + i;
      return <EachPackage className={className} data={item} key={i}/>
    });

    return (
        <div className="swiper-container packages-control" ref="packagesControl" style={{width: '100%'}}>
          <div className="swiper-wrapper">
            {packages}
          </div>
        </div>
    )
  }
}

//单个包裹控制
class EachPackage extends Component {

  render() {
    let {data, className} = this.props;
    let {deliveries} = data;
    let flagNC = Object.keys(deliveries).length;
    let pData = [];
    pData = data.goods_orders;
    return (
        <div className="swiper-slide">
          <PackageGoods className={className} data={pData}/>
          <div style={{height: '10px', background: '#f4f4f4'}}></div>
          <Logistics data={data} flagNC={flagNC} className={className}/>
        </div>
    )
  }
}

//单个包裹商品信息
class PackageGoods extends Component {
  componentDidMount() {
    let {className} = this.props,
        swiperClass = '.' + className,
        slideLength = $(swiperClass).find('.swiper-slide').length;
    if (slideLength > 4) {
      let imgsSwiper = new Swiper(swiperClass, {
        freeMode: true,
        slidesPerView: 'auto',
        observer: true,
      });
    }
  };

  render() {
    let {data} = this.props;
    let goods = data.map(function (item, i) {
      return <div className="goods-img c-fl c-mb15 swiper-slide" key={i}><a
          href={RNDomain + '/item?item_id=' + item.item_id}><img src={item.primary_image?addImageSuffix(item.primary_image, "_s"):require('../../../img/icon/loading/default-no-item.png')}/></a><span>x{item.packed_num}</span>
      </div>
    });
    return (
        <div className="package-goods">
          <div className={"c-clrfix package-imgs swiper-container " + this.props.className} style={{'width': '100%'}}>
            <div className="swiper-wrapper">
              {goods}
            </div>
          </div>
        </div>
    )
  }
}

//物流部分
class Logistics extends Component {
  componentWillMount(){
    let {data,flagNC} = this.props;
    let {deliveries} = data;
    if(flagNC == 2){
      this.setState({
        dataN:deliveries.overseas,
        dataC:deliveries.domestic
      });
    }else{
      this.setState({
        dataC:deliveries.domestic
      });
    }
  };
  componentDidMount() {
    let {data, className ,flagNC} = this.props;
    let cSwiper = '.' + className + 'i';
    let navClass = '.' + className + 'j' + ' li';
    let logSwiper = {};
    if (flagNC == 2) {
      logSwiper = new Swiper(cSwiper, {
        roundLengths: true,
        observer: true,
        autoHeight: true,
        onSlideChangeEnd: function (swiper) {
          $(navClass).eq(swiper.activeIndex).addClass('choose').siblings().removeClass('choose');
        },
      });
      $(navClass).click(function (e) {
        $(this).addClass('choose').siblings().removeClass('choose');
        let cindex = $(this).index();
        logSwiper.slideTo(cindex, 300, false);

      });
      setTimeout(function () {
        logSwiper.update();
      }, 1000)
    }
  };

  render() {
    let {data, className ,flagNC} = this.props;
    let {deliveries} = data;
    let cSwiper = className + 'i';
    return (
        <div style={{'width': '100%'}}>
          {flagNC == 2 ? <LogisticsNav className={className}/> : ''}
          {flagNC == 2 ?
              <div style={{'width': '100%'}} className={"swiper-container " + cSwiper}>
                <div className="swiper-wrapper">
                  <AllMsg  data={this.state.dataN}/>
                  <AllMsg data={this.state.dataC}/>
                </div>
              </div>
              : <AllMsg data={this.state.dataC}/>}
        </div>
    )
  }
}

//包裹无物流信息
class NoMsg extends Component {
  render() {
    return (
        <div className="no-msg"></div>
    )
  }
}

//国际物流--国内物流
class LogisticsNav extends Component {
  render() {
    let {className} = this.props;
    let navClass = className + 'j';
    return (
        <ul className={"logistics-nav c-tc c-fs14 c-c999 " + navClass}>
          <li className="choose">国际物流</li>
          <li>国内物流</li>
        </ul>
    )
  }
}

//国际/国内信息
class AllMsg extends Component {
  render() {
    let {data} = this.props;
    return (
        <div className="swiper-slide" style={{width: '100%'}}>
          <PackageMsg data={data}/>
          <LogisticsMsg data={data}/>
        </div>
    )
  }
}

//快递信息
class PackageMsg extends Component {
  render() {
    let {data} = this.props;
    let{corp_name,express_no} = data;
    return (
        <div className="package-msg c-fs14 c-c35 c-lh18">
          <div style={{'width': '100%', 'borderBottom': '1px solid #e4e4e4', 'paddingBottom': '12px'}}>
            <p>承运来源：{corp_name}</p>
            <p>运单编号：<input id={express_no} type="text" value={express_no}
                           style={{border: 'none', background: 'none'}} readOnly/></p>
          </div>
        </div>
    )
  }
}

//物流跟踪信息
class LogisticsMsg extends Component {
  checkLogistic =(code,no) => {
    axios.request({
      ...ctrlAPI.tracking, params: {
        code: code,
        no: no
      }
    }).then(({data}) => {
      if (data.code === 0) {
        this.setState({datalist:data.data.data||[]})
      }else{
        this.setState({datalist:[]})
      }
    }).catch( err => {
      Popup.MsgTip({msg: "服务器繁忙"});
    })
  };
  componentWillMount(){
    this.setState({
      datalist:[]
    });
    let {data} = this.props;
    this.checkLogistic(data.corp_code,data.express_no);
  };
  render() {
    let msgs="";
    if(this.state.datalist.length > 0){
      msgs = this.state.datalist.map(function (item, i) {
        return <EachMsg key={i} data={item}/>
      })
    }else{
      msgs = <NoMsg/>
    }

    return (
        <div className="logistics-msg">
          <ul>{msgs}</ul>
        </div>
    )
  }
}

//单条跟踪信息
class EachMsg extends Component {
  render() {
    let {data} = this.props;
    return (
        <li>
          <p className="c-fs14">{data.context}</p>
          <p className="c-fs12">{data.time}</p>
          <span></span>
        </li>
    )
  }
}