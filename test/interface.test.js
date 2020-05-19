import {expect} from 'chai';
import axios from 'axios';
describe('接口测试', function() {
  it('获取店铺首页初始化数据接口测试', function(done) {
    axios.request({
      url:"http://mall.trc.com/shop/index/decoration",
      method:"get",
      params: {
        shop_id:188
      }
    }).then((value)=>{
      expect(value.data.code).to.be.equal(200);
      done();
    }).catch((err)=>{
      console.log(err);
    })
  });
});
