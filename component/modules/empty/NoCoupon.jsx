import React, { Component } from 'react';

//无优惠券样式
export const NoCoupon = () => (
	<div className="c-tc" style={{padding: "30px 0 50px"}}>
		<img src={ require("./img/coupon-apply-bg.png") } height="90" width="160"/>
		<p className="c-cc9 c-fs13 c-mt10">您没有相关优惠券哦~</p>
	</div>
);