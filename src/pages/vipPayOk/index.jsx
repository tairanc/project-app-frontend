import React, { Component } from 'react';
import { PopupModal, PopupTip } from 'component/modal';
import '../../scss/vipPayOk.scss';
import { getCookie, setCookie, clearCookie } from 'js/common/cookie';
import { UCENTER, WXAPI } from 'config/index';
import axios from 'js/util/axios';
import { MALLAPI, RNDomain } from 'config/index'
import Popup from 'component/modal2';

const pageApi = {
  init: { url: `${MALLAPI}/item/bests`, method: 'get' },
  /*uc前缀为用户中心接口*/
  updateVipUser: { url: `${MALLAPI}/vip/updateVipUser`, method: "POST" }, //修改用户信息
};


export default class SelectedPage extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      birth: "",
      birthStart: false,
      birthSlideIn: false,
      shadySlide: false,
      showBirth: false,
      showAlert: false
    }
  }

  static contextTypes = {
    store: React.PropTypes.object,
    isApp: React.PropTypes.bool
  };

  componentDidMount () {
    setTimeout(() => {
      this.setState({ showBirth: true, birthStart: true, shadySlide: true, birthSlideIn: true });
    }, 100);
  }

  componentDidUpdate () {

  }

  changeState = (stateName) => {
    this.setState(stateName);
  }

  //选择生日
  chooseBirth = () => {
    // this.setState({ showBirth: true, birthStart: true, shadySlide: true, birthSlideIn: true });
  };

  btnSure () {
    this.setState({
      showAlert: false,
      showBirth: false,
      birthStart: false,
      shadySlide: false,
      birthSlideIn: false
    });
  }

  btnBack () {
    this.setState({
      showAlert: false,
      showBirth: true,
      birthStart: true,
      shadySlide: true,
      birthSlideIn: true
    });
  }

  render () {
    // if (this.state.load) return <LoadingRound />;
    const { is_vip, tabList, tabIndex, recommendList, isagreement, remain_days, contentList } = this.state;
    let { showAlert, showBirth, shadySlide, showStart, showAvatar, avatar, sex, sexStart, sexSlideIn, birth, birthStart, birthSlideIn, update, isCompanyUser, data } = this.state;
    return (
      <div data-page="vippayok" className="vip-pay-ok" style={{ minHeight: $(window).height() }}>
        {showBirth ?
          <div className="birth-day">
            <ChooseBirth showAlert={showAlert} birthStart={birthStart} shadySlide={shadySlide} birthSlideIn={birthSlideIn} changeState={this.changeState} birth={birth} />
          </div>
          : null}
        <div className="base-content">
          <div className="background-img">
            <img className="bgimg" src="/src/img/vipPage/vip-img.png" alt="" />
            <p className="text-def text-small">支付成功</p>
            <p className="text-def text-big">恭喜您成为泰享会员</p>
            <p className="text-def">建议您关注泰然城公众号，以便获取最新精彩活动！</p>
          </div>
          <div className="btn-content">
            <a href='trmall://main?page=home'>
              <button className="btn-payok btn-go-home">
                去首页
              </button>
            </a>
            <a href='/vipPage'>
              <button className="btn-payok btn-mine">
                我的权益
            </button>
            </a>
          </div>
        </div>
        {showAlert ? <div className="alert-sure">
          <div className="alert-content">
            <div className="alert-top">
              <div className="alert-title">你的生日信息是否已确认？</div>
              <div className="alert-text">泰然城将以此日期为您发放生日福利</div>
            </div>
            <div className="alert-btn">
              <button className="alert-btn alert-btn-left" onClick={this.btnSure.bind(this)}>确认</button>
              <button className="alert-btn alert-btn-right" onClick={this.btnBack.bind(this)}>取消</button>
            </div>
          </div>
        </div> : null}

      </div>
    )
  }
}

//选择生日
class ChooseBirth extends Component {
  constructor(props) {
    super(props);
    let date = new Date();
    let { birth } = this.props,
      birthArr = birth ? birth.split("-").map((val) => { return parseInt(val); }) : [],
      len = birthArr.length;

    this.state = {
      nowYear: date.getFullYear(),
      nowMonth: date.getMonth(),
      nowDay: date.getDate(),

      yearInit: len ? 70 - (date.getFullYear() - birthArr[0]) : 70,
      monthInit: len ? birthArr[1] - 1 : date.getMonth(),
      dayInit: len ? birthArr[2] : date.getDate(),

      yearCnt: 0,
      monthCnt: 0,
      dayCnt: 0,

      dayArr: this.dayGenerator(len ? date.getFullYear() : birthArr[0], (len ? birthArr[1] - 1 : date.getMonth()) + 1)
    }
  }

  componentDidMount () {
    let { nowYear, nowMonth, nowDay, yearInit, monthInit, dayInit, yearCnt, monthCnt, dayCnt } = this.state;

    let self = this;
    let daySwiper = new Swiper(".day-container", {
      preventClicks: true,
      direction: 'vertical',
      slideToClickedSlide: true,
      slidesPerView: 5,
      centeredSlides: true,
      initialSlide: dayInit - 1,
      onSlideChangeEnd: function (swiper) {
        if (dayCnt > 0) {
          let { year, month, day } = self.getSelTime(); //获取当前swiper选择的年月日

          if (year === nowYear && month - 1 === nowMonth && day > nowDay) {
            swiper.slideTo(nowDay - 1, 200, true); //选择大于当前日期的日子，自动回滚到当前日
          }
        }
        dayCnt++;
      }
    });

    let monthSwiper = new Swiper(".month-container", {
      preventClicks: true,
      direction: 'vertical',
      slideToClickedSlide: true,
      slidesPerView: 5,
      centeredSlides: true,
      initialSlide: monthInit,
      onInit: function(){
          monthCnt++
      },
      onSlideChangeEnd: function (swiper) {
        if (monthCnt > 0) {
          let { year, month, day } = self.getSelTime(); //获取当前swiper选择的年月日

          if (year === nowYear && month > nowMonth) {
            swiper.slideTo(nowMonth, 200, true); //选择大于当前月份的月，回滚到当前月
          }
          if (year === nowYear && month - 1 === nowMonth && day > nowDay) {
            daySwiper.slideTo(nowDay - 1, 200, true); //选择大于当前日期的日子，回滚到当前日
          }

          let dayArr = self.dayGenerator(year, month),
            dayNum = self.getDayNum(year, month);
          self.setState({ dayArr: dayArr });
          daySwiper.updateSlidesSize();

          if (!day || day > dayNum) {
            daySwiper.slideTo(dayNum - 1, 200, true); //不存在的日期，回滚到当前月最后一天
          }
           monthCnt++;
        }

      }
    });

    let yearSwiper = new Swiper(".year-container", {
      preventClicks: true,
      direction: 'vertical',
      slideToClickedSlide: true,
      slidesPerView: 5,
      centeredSlides: true,
      initialSlide: yearInit,
      onSlideChangeEnd: function (swiper) {
        if (yearCnt > 0) {
          let { year, month, day } = self.getSelTime(); //获取当前swiper选择的年月日

          if (year === nowYear && month > nowMonth) {
            monthSwiper.slideTo(nowMonth, 200, true); //选择大于当前月份的月，回滚到当前月
          }
          if (year === nowYear && month - 1 === nowMonth && day > nowDay) {
            daySwiper.slideTo(nowDay - 1, 200, true); //选择大于当前日期的日，回滚到当前日
          }

          let dayArr = self.dayGenerator(year, month),
            dayNum = self.getDayNum(year, month);
          self.setState({ dayArr: dayArr });
          daySwiper.updateSlidesSize();

          if (!day || day > dayNum) {
            daySwiper.slideTo(dayNum - 1, 200, true); //不存在的日期，回滚到当前月最后一天
          }
        }
        yearCnt++;
      }
    });
  }

  //获取当前选择swiper选择的年月日值
  getSelTime = () => {
    return {
      year: parseInt($(".year-container .swiper-slide-active").text().split("年")[0]),
      month: parseInt($(".month-container .swiper-slide-active").text().split("月")[0]),
      day: parseInt($(".day-container .swiper-slide-active").text().split("日")[0])
    }
  }

  //判断当前年月下的天数
  getDayNum = (year, month) => {
    let dayNum;
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12: dayNum = 31; break;
      case 4:
      case 6:
      case 9:
      case 11: dayNum = 30; break;
      case 2: dayNum = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 29 : 28; break;
    }
    return dayNum;
  }

  //生成包含当前年月下的天数数组
  dayGenerator = (year, month) => {
    let dayArr = [],
      dayNum = this.getDayNum(year, month);
    for (let i = 1; i <= dayNum; i++) {
      dayArr.push(i);
    }
    return dayArr;
  }

  //取消
  // cancelBirth = () => {
  //   this.props.changeState({ shadySlide: false, birthSlideIn: false });
  // }
  //确定
  confirmBirth = () => {
    let year = $(".year-container .swiper-slide-active").text().split("年")[0],
      month = $(".month-container .swiper-slide-active").text().split("月")[0],
      day = $(".day-container .swiper-slide-active").text().split("日")[0],
      birthVal = year + "-" + month + "-" + day;

    let self = this;
    let token = getCookie('token');

    //修改性别
    axios.request({
      ...pageApi.updateVipUser,
      headers: { 'Authorization': "Bearer " + token },
      data: { birthday: birthVal }
    }).then(({ data }) => {
      if (data.code === "200") {
        self.props.changeState({ birth: birthVal });
        // Popup.MsgTip({ msg: "生日修改成功" });
      } else {
        // Popup.MsgTip({ msg: "生日修改失败" });
      }
    });
    //关闭弹窗
    this.props.changeState({ showAlert: true, showBirth: false, shadySlide: false, birthSlideIn: false });
  }

  getYear = () => {
    let yearArr = [];
    let nowYear = new Date().getFullYear();
    for (let i = nowYear - 70; i <= nowYear; i++) {
      yearArr.push(i + "年");
    }
    return yearArr;
  }

  getMonth = () => {
    let monthArr = [];
    for (let i = 1; i <= 12; i++) {
      monthArr.push((i < 10 ? '0' + i : i) + "月");
    }
    return monthArr;
  }

  render () {
    let { birthSlideIn, birthStart } = this.props;
    let { dayArr } = this.state;
    let yearList = this.getYear().map(function (item, i) {
      return <div key={i} className="swiper-slide"><p className="each-year">{item}</p></div>
    });
    let monthList = this.getMonth().map(function (item, i) {
      return <div key={i} className="swiper-slide"><p className="each-month">{item}</p></div>
    });
    let dayList = dayArr.map(function (item, i) {
      return <div key={i} className="swiper-slide"><p className="each-day">{(item < 10 ? "0" + item : item) + "日"}</p></div>
    });

    return (
      <div className="animation-birth">
        {/* <div className="header">
          <p className="header-text large">填写生日领福利</p>
          <p className="header-text">完善您的个人信息,泰然城为您发放生日福利</p>
        </div> */}
        <div className={`choose-birth ${birthStart ? (birthSlideIn ? "animation1" : "animation2") : ""}`}>
          <div className="fixed-line c-pa" style={{ top: "126px" }}></div>
          <div className="fixed-line c-pa" style={{ top: "169px" }}></div>
          <ul className="nav">
            <li className="cancel">完善您的个人信息,泰然城为您发放生日福利!</li>
            {/* <li className="cancel" onClick={this.cancelBirth}>完善您的个人信息,泰然城为您发放生日福利</li> */}
            <li className="confirm" onClick={this.confirmBirth}>完成</li>
          </ul>
          <div className="birth-content" data-plugin="swiper">
            <div className="swiper-container year-container">
              <div className="swiper-wrapper">
                {yearList}
              </div>
            </div>

            <div className="swiper-container month-container">
              <div className="swiper-wrapper">
                {monthList}
              </div>
            </div>

            <div className="swiper-container day-container">
              <div className="swiper-wrapper">
                {dayList}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
