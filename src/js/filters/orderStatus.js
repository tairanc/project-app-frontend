import React, {Component} from 'react';
//平台级主订单状态
export const ordermainStatusMap = {
    10: '等待付款'
};
//平台级主订单状态icon
export const ordermainStatusAndIconMap = {
    10: {
        'status': '等待付款',
        'icon': '/src/img/icon/trcUnpaid2.png'
    },
    20: {
        'status': '已付款',
        'icon': '/src/img/icon/trcSend2.png'
    },
    30: {
        'status': '交易关闭',
        'icon': '/src/img/icon/trcCancel2.png'
    }
};
//店铺级订单状态icon
export const ordersubStatusAndIconMap = {
    10: {
        'status': '等待付款',
        'icon': '/src/img/icon/trcUnpaid2.png'
    },
    20: {
        'status': '已付款',
        'icon': '/src/img/icon/trcSend2.png'
    },
    25: {
        'status': '待发货',
        'icon': '/src/img/icon/trcSend2.png'
    },
    30: {
        'status': '交易关闭',  //已取消
        'icon': '/src/img/icon/trcCancel2.png'
    },
    31: {
        'status': '交易关闭',
        'icon': '/src/img/icon/trcCancel2.png'
    },
    40: {
        'status': '已发货',
        'icon': '/src/img/icon/trcWait2.png'
    },
    50: {
        'status': '交易完成',
        'icon': '/src/img/icon/trcEvaluation2.png'
    },
    60: {
        'status': '交易完成',
        'icon': '/src/img/icon/trcComplete2.png'
    }
};


//拼团状态
export const groupStatusAndIcon = {
    'IN_PROCESS': {
        'status': "拼团中",
        'icon': "/src/img/icon/trcOngoing.png"
    },
    'SUCCESS': {
        'status': "拼团成功",
        'icon': "/src/img/icon/trcSuccess.png"
    },
    'FAILED': {
        'status': "拼团失败",
        'icon': "/src/img/icon/trcFailure.png"
    }
};

export const cancelOrderMap = {
    'SUCCESS': '取消成功',
    'NO_APPLY_CANCEL': ''
};

//取消订单理由
export const reasonList = [
    {name: "0", text: "不想买了"},
    {name: "1", text: "信息填写错误，重新下单"},
    {name: "2", text: "付款遇到问题"},
    {name: "3", text: "其他原因"}
];

//订单类型
export const orderType = ["普通订单", "零元购", "分期购", "拼团"];

export const afterstatusDeal = {
    10:'售后中',
    20:'售后完成',
    30:'售后完成',
    40:'售后中',
    50:'售后中',
    60:'售后关闭',
    70:'售后关闭',
    80: '售后关闭',
    null:'暂无售后'
}
export const groupStatus = {
    0: "拼团失败",
    1: "拼团中",
    2: "拼团成功"
};


//支付方式
export const payType = {
    10: "在线支付",
    20: "线下支付",
    30: "理财支付"
};
//快递方式
export const dispatchDelivery = {
    10: "快递",
    20: "自提"
};
// //商城2.0弹窗要加载的数据
export const popupData = {
    type: {
        title: "售后类型",
        list: [
            {method: "退货退款", content: "已收到货，需要退还已收到的货物", select: "restore"},
            {method: "仅退款", content: "无需退货", select: "refund"}
        ],
        onlylist: [
            {method: "仅退款", content: "无需退货", select: "refund"}
        ]
    },
    reason: {
        title: "退货原因",
        list: {
            "restore": [{content: "商品与描述不符", select: 1},
                {content: "商品错发漏发", select: 2},
                {content: "收到商品破损", select: 3},
                {content: "商品质量问题", select: 4},
                {content: "个人原因退货", select: 5},
                {content: "其他", select: 6}
            ],
            "refund": [{content: "商品与描述不符", select: 1},
                {content: "商品错发漏发", select: 2},
                {content: "收到商品破损", select: 3},
                {content: "商品质量问题", select: 4},
                {content: "个人原因退货", select: 5},
                {content: "未收到货", select: 6},
                {content: "商品问题已拒签", select: 7},
                {content: "退运费", select: 8},
                {content: "其他", select: 9}
            ]

        }
    }
};

//售后状态
export const asProcess = {
    10: "待审核",   //0等待商家处理
    20: "售后完成",  //8商家同意，等待平台处理
    30: "售后完成",   //7平台处理退款，退款完成
    40: "等待商品寄回",  //1商家同意，等待消费者回寄
    50: "等待商家收货",  //2消费者回寄，等待商家收货确认
    60: "审核未通过",    //3商家驳回
    70: "售后关闭",    //9用户撤销
    80: "售后关闭" //用户超时未填写物流，系统关闭
};

export const asReminder = {
    10: "您已成功发起售后申请，请耐心等待商家处理",
    20: "商家已操作退款给您，请注意查收",//商家同意，等待平台处理
    30: "商家已操作退款给您，请注意查收",
    40: "商家已通过您的售后申请，请退货并填写物流信息",
    50: "商家收到退货并验证无误，将操作退款给您",
    60: "商家未通过您的售后申请，您可以修改申请后再次发起",
    70: "您已撤销本次售后申请，最多可以在售后保障期内发起3次申请",
    80: "您因超时未填写物流单号，本次售后申请被撤销，最多可以在售后保障期内发起3次申请"
};

export const asStatus = ["待处理", "处理中", "已处理", "已驳回"];

export const asTypes = {
    10: "仅退款",
    20: "退货退款",
    "EXCHANGING_GOODS": "申请换货"
};
//发货订单状态细分
export const confimStatus = {
    10: "待发货",
    20: "部分发货",
    30: "已发货"
}
//商城2店铺图标
export function storeIcon(type) {
    switch (type) {
        // icon_biz 企业购 icon_good 小泰良品 icon_self自营店铺 icon_store 商家店铺
        case "icon_biz":
            return <img src={require('src/img/icon/store/qyg-shop-icon.png')}
                        style={{verticalAlign: "-4px", marginRight: "10px"}}
                        width="15"
                        height="17"/>;
        case "icon_self":
            return <img src={require('src/img/icon/store/trc-self-icon.png')}
                        style={{verticalAlign: "-4px", marginRight: "10px"}}
                        width="20"
                        height="20"/>;
        case "icon_good":
            return <img src={require('src/img/icon/store/xt-shop-icon.png')}
                        style={{verticalAlign: "-4px", marginRight: "10px"}}
                        width="17"
                        height="17"/>;
        default:
            return <img src={require('src/img/icon/store/common-shop-icon.png')}
                        style={{verticalAlign: "-3px", marginRight: "10px"}}
                        width="16"
                        height="15"/>;
    }
}
//订单详情关闭定单原因
export const orderClosereason = {
    10:'用户关闭',
    20:'平台取消订单',
    30:'等待付款的订单过付款时间，系统关单',
    40:'未在指定时间内拼团成功',
    50:'商品已完成售后'
};

