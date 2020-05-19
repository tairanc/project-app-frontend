import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';

import './addressAndIdentityInfo.scss';

export default class IdentityExample extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        document.title = "身份证照片示例";
    }

    componentDidMount() {
        $("#identity-example").css({minHeight: $(window).height()})
    }

    render() {
        return (
            <div data-page="identity-example">
                <div id="identity-example" ref="identity-example">
                    <div className="wrapper correctEx">
                        <h1>身份证照片正确示例</h1>
                        <h3>人面像</h3>
                        <p><img src="../src/img/addressAndIdentityInfo/right1.png" alt=""/></p>
                        <h3 style={{marginTop: "20px"}}>非人面像</h3>
                        <p><img src="../src/img/addressAndIdentityInfo/right2.png" alt=""/></p>
                    </div>
                    <div className="wrapper errorEx">
                        <h1>身份证照片错误示例</h1>
                        <h3>1、非收货人本人身份证照片</h3>
                        <p><img src="../src/img/addressAndIdentityInfo/error1.png" alt=""/></p>
                        <h3>2、身份证姓名、身份证号码被遮挡或者拍摄反光，无法清晰辨认</h3>
                        <p><img src="../src/img/addressAndIdentityInfo/error2.png" alt=""/></p>
                        <p><img src="../src/img/addressAndIdentityInfo/error3.png" alt=""/></p>
                        <h3>3、拍摄身份证太小，拍摄时倾斜等导致姓名、身份证号码无法清晰辨认</h3>
                        <p><img src="../src/img/addressAndIdentityInfo/error4.png" alt=""/></p>
                        <p><img src="../src/img/addressAndIdentityInfo/error5.png" alt=""/></p>
                        <h3>4、身份证照片人为修改，处理</h3>
                        <p style={{marginBottom: "40px"}}><img src="../src/img/addressAndIdentityInfo/error6.png" alt=""/></p>
                    </div>
                </div>
            </div>
        )
    }
}
