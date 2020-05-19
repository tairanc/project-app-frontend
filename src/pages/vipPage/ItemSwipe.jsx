import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import styles from './ItemSwipe.scss';
import { PureComponent } from 'component/modules/HOC/PureComponent';
import { Link } from 'react-router';
import { addImageSuffix, toFixedTwo } from "src/js/util/index"

@CSSModules(styles, { allowMultiple: true })
export default class ItemSwipe extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      load: false
    }
  }
  render () {
    let { data } = this.props;
    return <div styleName="itemSwipe">
      <div styleName="swipeWrapper">
        <div styleName="swipeBox" ref="swipeBox">
          <div styleName="swipeContent" style={{ width: `${134 * data.length + 6}px` }}>
            {data.map((item, i) => {
              return <ItemVtr data={item} key={i} />
            })}

          </div>
        </div>
      </div>

    </div>
  }
}

@CSSModules(styles)
export class ItemVtr extends Component {
  render () {
    let { data } = this.props;
    let _price = toFixedTwo((data.price && data.price.active) ? data.price.active : (data.price && data.price.default ? data.price.default : ""))
    return <a styleName="item" href={!data.more ? `/item?item_id=${data.id}` : `/searchResult?service=is_self&brand=1744`}>
      <div styleName='swipe-content'>
        {
          data.more ?
            <div styleName="more-box">
              <img styleName="more-img" src="/src/img/vipPage/vipcard.png"></img>
              <div styleName="more-text">查看更多</div>
            </div> :
            <div styleName="def-data">
              <img styleName='img' src={data.primary_image ? addImageSuffix("https://image.tairanmall.com" + data.primary_image, "_m") : "/image/icon/loading/default-no-item.png"}></img>
              <div styleName='title'>{data.title}</div>
              <div styleName='price'>
                ¥ {toFixedTwo((data.price.active) ? data.price.active : data.price.default)}
              </div>
              <text styleName="discount">会员9折</text>
              {
                data.activity_image ? <div styleName="good-top-tag">
                  <img src={data.activity_image} styleName="activity-image" mode="widthFix" />
                </div> : null
              }

            </div>
        }
      </div>
    </a>
  }
}