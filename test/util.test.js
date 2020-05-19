/**
 * Created by Administrator on 2017/9/13.
 */
import {timeUtils} from "../src/js/common/utils";
import {expect} from'chai';
describe("工具包方法测试",function(){
    it("时间格式化方法测试-1位数日期",function(){
        var date = new Date(2017,8,5);
        var time = date.getTime();
        var changedTime = timeUtils.timeFormat(time/1000);
        expect(changedTime).to.be.equal('2017.09.05');
    });
    it("时间格式化方法测试-2位数日期",function(){
        var date = new Date(2017,11,11);
        var time = date.getTime();
        var changedTime = timeUtils.timeFormat(time/1000);
        expect(changedTime).to.be.equal('2017.12.11');
    });
});