import React, {Component} from 'react';
import {connect,browserHistory} from 'react-redux';
import {actionAxios, concatPageAndType} from 'js/actions/actions';
import {LoadingRound} from 'component/common';
import {MALLAPI} from 'config/index';
const createActions = concatPageAndType("logicompany");
const axiosCreator = actionAxios("logicompany");


const pageApi = {
    init: {url: `${MALLAPI}/user/sold/logistics`, method: "get"}
};

class Logicompany extends Component {
    componentWillMount() {
        this.props.getData();
    }
    //点击获取物流公司
    getCompany =(item) => {
        let {dispatch} = this.props;
        dispatch(createActions('changeCompany', {name: item.name,code:item.code,id:item.id}));
        history.go(-1);
    };
    getHtml = () => {
        let {data} =  this.props;
        let arrCom=[];
        for(let key in data){
            arrCom.push(
                <div id={key} key={key}>
                    <h1>{key}</h1>
                    { data[key].map(item=><div className="one-company" onClick={()=>{this.getCompany(item)}} key={item.id+item.code}>{item.name}</div>)  }
                </div>
            )
        }
        return arrCom
    };
    // 跳转锚点
    anchorJump = (n) => {
        let text = $(n).text();
        $(n).href = `#${text}`;
        let {pathname,search} = location;
        let url = pathname+search;
        window.location.replace( url + "#" + text)
    };
    // 手指滑动
    move = () =>  {
        //  获取开始点击的位置
        //  每滑动一个a标签的高度切换一个锚点
        event.preventDefault();
        anchorJump(document.elementFromPoint(event.changedTouches[0].clientX,event.changedTouches[0].clientY))
    };
    touchEnd = () => {
        let opcityNum = 1;
        setInterval(function () {
            opcityNum -= 0.1;
            if (opcityNum > 0) {
                $('.letter').css({'opacity': opcityNum})
            } else {
                clearInterval();
            }
        },50)
    };
    //侧边导航
    getsubLitter = () =>{
        let {data} = this.props;
        let subArr = [];
        for(let key in data){
            subArr.push(
                <a key={key} onTouchStart={ (e) => {this.anchorJump(e.target)} }>
                    {key}
                </a>
            )
        }
        return subArr;
    };
    render() {
        let {load} = this.props;
        return (
            <div>
                {!load ?
                    <div data-page="after-sale-company">
                        {this.getHtml()}
                        <div className="slidePage flex-def flex-zTopBottom flex-zCenter flex-cEnd"
                             onTouchEnd={ () => {this.touchEnd()}} onTouchMove={ () => {this.move()}}>
                            <div className="wrap">
                                {this.getsubLitter()}
                            </div>
                        </div>
                    </div>
                    :
                    <LoadingRound/>}
            </div>
        )
    }
}

function logicompanyState(state, props) {
    return {
        ...state.logicompany
    }
}

function logicompanyDispatch(dispatch, props) {
    return {
        dispatch: dispatch,
        getData: () => {
            dispatch(axiosCreator('getData', {...pageApi.init, params: {}}));
        },
    }
}

function logicompanyProps(stateProps, dispatchProps, props) {
    let {dispatch} = dispatchProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...props
    }
}

export default connect(logicompanyState, logicompanyDispatch, logicompanyProps)(Logicompany);