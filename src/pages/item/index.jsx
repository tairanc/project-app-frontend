import React, { Component } from 'react';
import ReactDOM,{ render } from 'react-dom';
import { Link } from 'react-router';
import 'src/scss/item.scss';
import 'src/scss/modal.scss';
import {FilterTrade, FilterTradeType,createMSG, createAction} from 'filters/index'
import {LoadingRound,EmptyPage,ShareAndTotop} from 'component/common';
import { browserHistory } from 'react-router';
import {onAreaResultJSBrige} from "../../js/jsbrige/index"
import Popup , {Modal, Fix} from 'component/modal';


import GroupBuy from "./itemDetail/groupBuy"
import ZeroBuy from "./itemDetail/zeroBuy"
import Seckill from "./itemDetail/seckill.jsx"

import Detail from "./itemDetail/detail.jsx"

let Action = createAction({
    Promotion: {
      url: '/originapi/item/promotion',
      type: "get"
    },
    Item: {
        url: "/originapi/item/detail",
        type: "get"
    },
    Spec: {
        url: "/originapi/item/specs",
        type: "get"
    }
});

// 加入渠道码 脚本start
function getURLParameter(name){
	var parameterStr = window.location.search.replace(/^\?/,''),
		reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
		value = parameterStr.match(reg);
	return value ? value[2] : null;
}


function addChannel(obj){
	obj.find("a").each(function(){
		let  org_href =  $(this).attr('href');
		let  reg_schem =/^t/;
		let  reg_channel= /channel/;
		if(org_href && !reg_schem.test(org_href) && !reg_channel.test(org_href)){
			let reg_requrey = /\?/ ,href;
			href = org_href + (reg_requrey.test(org_href) ? "&" :"?" )+"channel="+channel;
			$(this).attr('href',href)
		}
	})
}

export default class ItemPage extends Component {

    constructor(props) {
        super(props);

        let {item_id} = props.location.query;

        this.state = {
            itemId: item_id,
            update: false,
            status: false
        }
    }
    static contextTypes = {
        isApp: React.PropTypes.bool
    }
    componentWillMount() {
        document.title= '商品详情';
       this.context.isApp && (location.href="jsbridge://set_title?title=商品详情");

        if (!this.state.itemId) {
            browserHistory.push("/");
        }
        let self = this;
        function pajax(option) {
            let promise = new Promise((resolve) => {
                option.success = (res) => {
                    resolve(res)
                };
                $.ajax(option)
            });
            return promise
        }
        Promise.all([
            pajax(Action("Item", {
                data: {
                    "item_id": this.state.itemId
                }
            })),
            pajax(Action("Promotion", {
                data: {
                    "item_id": this.state.itemId
                }
            })),
            pajax(Action("Spec", {
                data: {
                    "item_id": this.state.itemId
                }
            }))
        ]).then((res) =>{
            self.state.update = true
            if (res[0].status) {
                self.state.data = res[0].data;
                self.state.status = true
            }
            self.state.promotion = res[1];
            self.state.itemRules = res[1].itemRules || {};
            self.state.specs = res[2]
            self.setState(self.state)
        });
    }
		
    componentDidMount(){
	    let channel = getURLParameter('channel');
	    if(channel) addChannel( $('body') );


    }
    
    selectModel () {
        let {data} = this.state;
        let ret;
        switch (data.item_type) {
            case "groupbuy":
                ret = <GroupBuy {...this.state} {...this.props} />
                break
            case "invest":
                ret = <ZeroBuy {...this.state} {...this.props} />;
                break
            case "seckill":
                ret = <Seckill {...this.state} {...this.props} />;
                break
           default:
                ret = <Detail {...this.state} {...this.props}/>
        }

        return ret
    }

    render() {
        return (
            this.state.update ?
                this.state.status ?
                this.selectModel()
                    : <EmptyPage config={{
                        bgImgUrl:"/src/img/shopCart/item-noexist-icon.png",
                        msg: "商品过期不存在",
                        noBtn: true
                    }} />
                : <LoadingRound />
        )
    }
}

