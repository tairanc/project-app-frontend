import React, { Component } from 'react';
import 'src/scss/vipAgreement.scss';

export default class vipAgreement extends Component {
  constructor(props, context) {
    super(props);
    document.title = "泰享会员服务协议";
    if (context.isApp) location.href = "jsbridge://set_title?title=泰享会员服务协议";
  }
  componentDidMount () {
    $(window).scrollTop(1);
  }
  componentWillUnmount () {

  }
  render () {
    return (
      // <div data-page="agreement" className="service-agreement">
      <div className="vip-agreement-page">
        <div className="title">
          <text>泰享会员服务协议</text>
        </div>
        <div>
          <text>您在申请开通泰享会员过程中勾选同意本协议之前，请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款，特别是加粗部分</text>
        </div>
        <div>
          <text>当您确认接受本服务协议或开始使用泰享会员服务时，即表示您与泰然城（即泰然城电子商务有限公司，以下简称“泰然城”）达成一致，自愿接受本协议一切内容，阅读本协议的过程中，如果您不同意任一或全部条款内容，请不要进行下ー步操作或使用本协议项下服务，您应立即停止开通程序。</text>
        </div>
        <div>
          <text>本协议由您与泰然城共同签署，作为《泰然城用户协议》的补充，与《泰然城用户协议》及所有泰然城已经公布的适用于所有会员用户的各类服务条款及规则构成统一整体。未来泰然城会以本协议为基准，继续丰富相关的服务条款与规则，并依法定程序公布生效。所有条款与规则为协议不可分割的组成部分，与协议具有同等法律效力。</text>
        </div>
        <div>
          <text>您在申请开通泰享会员过程中勾选“已阅读并同意”并通过泰然城上的任一种支付方式付费，即表示您已仔细阅读并完全接受本协议下的全部条款。</text>
        </div>
        <div><text></text></div>
        <div><text></text></div>

        <div className="tileft">
          <text>一、泰享会员服务开通</text>
        </div>
        <div className="tileft">
          <text>1.1.您在申请成为泰享会员前须完成泰然城会员的注册与登录，以确认您的主体身份及完成支付。</text>
        </div>
        <div className="tileft">
          <text>1.2.当您接受本协议开通泰享会员。泰然城将按照本协议条款为您提供泰享会员服务。同时您在享受泰享会员服务时应严格遵守本协议条款。</text>
        </div>
        <div className="tileft">
          <text>1.3、您应确保在泰享会员服务开通及使用过程中，始终具备完全民事权利能力和完全民事行为能力，并确保您具有签订和履行本协议项下权利义务之实际能力。</text>
        </div>
        <div className="tileft">
          <text>1.4、一旦您点击支付了泰享会员服务费或在其它泰享会员付费服务中并支付了泰享会员服务费的，即视为您认可该项服务费；您付费成功后，泰享会员服务即时生效。</text>
        </div>
        <div className="tileft">
          <text>1.5、 基于权益调整，泰然城可能会调整泰享会员服务开通所需会员服务费用。调整后的服务费用自公布之日起生效，您于生效前已开通的泰享会员服务不受影响，但到期后若需续费开通，则需按照调整后已生效的费用标准支付。若该价格标示有明显错误且泰然城发出相关价格错误通知的情形，双方应协商解決。</text>
        </div>
        <div><text></text></div>
        <div><text></text></div>

        <div className="tileft">
          <text>二、风险提示</text>
        </div>
        <div className="tileft">
          <text>2.1、泰享会员服务及会员权益仅限您本人使用。开通泰享会员服务或获取泰享会员权益的账户作为您享受相应服务及权益的重要身份标识，请妥善保管用户名、密码均由您自行设置并保管。泰然城会员账户被他人使用可能会造成您本人在权益使用上产生不良影响，因此泰然城请您无论何种因由不要将自己的账户给予他人使用，从公平合理的角度，您应知晓所有通过该账户实现的操作泰然城只能默认视为您本人的行为，由此产生的后果由您与实际使用者自行承担。</text>
        </div>
        <div className="tileft">
          <text>2.2、您明确了解并选择接受了泰然城上的某种付费方式，泰然城明确告知您付费过程可能存在一定的风险（包括但不限于不法分子利用您账户或银行卡等进行违法活动），该等风险均会给您造成相应的经济损失。为此，您同意泰然城在充分履行其在本协议项下全部义务及勤勉谨慎义务的前提下不对您的前述风险和损失承担任何责任；并且，泰然城不承担向不法分子追究侵权责任或者代其向您承担损失的任何责任和义务。</text>
        </div>
        <div className="tileft">
          <text>2.3、成为泰享会员后，您对本服务或本协议条款及调整后的服务或条款有任何异议，可放弃泰享会员资格，但泰然城不退还已缴纳的服务费用。</text>
        </div>
        <div><text></text></div>
        <div><text></text></div>

        <div className="tileft">
          <text>三、泰享会员权益</text>
        </div>
        <div className="tileft">
          <text>3.1、购物9折：当您在泰然城平台上购买泰然城自营商品，或在泰然城门店购买任意商品时，您可在标价的基础上享受9折优惠，该优惠可叠加享受其他优惠，即您的最终付费为=单品标价-活动折扣-会员9折折扣-品类券折扣。</text>
        </div>
        <div className="tileft">
          <text>3.2、免费饮品券10张：在泰享会员有效期内，凭该饮品券您可在泰然城线下门店咖啡吧领取任意饮品10杯。若您的泰享会员身份到期，不管续费与否，本券即失效，泰然城有权不提供饮品。</text>
        </div>
        <div className="tileft">
          <text>3.3、书吧vip：泰然城书吧仅向泰享会员提供服务，书吧内海量图书/杂志可供免费阅读，图书可外借，外借规则参考店内具体规则。</text>
        </div>
        <div className="tileft">
          <text>3.4、生日礼包1份及指定蛋糕券1张：当你开通泰享会员并完善相关信息后，在生日月（以您注册时填写的生日信息为准），泰然城向您提供生日礼包券1张、指定蛋糕券1张，生日礼包内容由泰然城指定，价值不低于99元；蛋糕券的使用仅限于指定品类，若您购买的产品高于该券价值，您须支付差价。本券有效期为您生日日期所在自然月期间，且仅限泰然城门店内使用。</text>
        </div>
        <div className="tileft">
          <text>3.5、线下活动报名权：泰然城不定期开展线下活动或联合其他企业开展线下活动，泰享会员可在泰然城门店免费预约参加。</text>
        </div>
        <div className="tileft">
          <text>3.6、泰享会员可提前续费，会员权益时间按照当前时间依次累计，续费后会员权益待当前权益全部失效后，方可享受。</text>
        </div>
        <div className="tileft">
          <text>3.7、泰然城有权基于泰享会员体系合理性考量，在提前7日通知的情况下对泰享会员权益进行适当的调整，该调整会以公布形式生效或在您的泰享会员到期后才生效。</text>
        </div>
        <div><text></text></div>
        <div><text></text></div>

        <div className="tileft">
          <text>四、泰享会员有效期</text>
        </div>
        <div>
          <text>泰享会员服务有效期为365天，自服务开通之日起计算。若您在有效期届满后希望继续享受泰享会员服务的，请您续费或重新开通，有效期届满后您未续费或重新开通的，泰享会员服务终止。</text>
        </div>
        <div><text></text></div>
        <div><text></text></div>

        <div className="tileft">
          <text>五、泰享会员使用规范</text>
        </div>
        <div>
          <text>您确保合理使用泰享会员服务，不利用泰享会员服务进行盈利或非法获利，不以任何形式转让或转移您所享有的泰享会员服务或泰享会员权益，不以任何方式将泰享会员服务或泰享会员权益借给他人使用。若泰然城有合理理由怀疑您存在任何不当使用会员服务行为的，泰然城将取消您的泰享会员资格、作废泰享会员权益且您不应要求泰然城退还您所支付的会员服务费用。您应对您不当使用会员服务的行为及后果（包括损失）负责，您若给泰然城造成损失的，泰然城有权向您追偿。</text>
        </div>
        <div><text></text></div>
        <div><text></text></div>

        <div className="tileft">
          <text>六、泰享会员服务终止</text>
        </div>
        <div className="tileft" style={{ marginBottom: '0px' }}>
          <text>6.1  您开通泰享会员服务后，若出现以下情形造成泰享会员服务终止或中止的，您不应要求退还部分或全部会员服务费用：</text>
        </div>
        <div style={{ marginTop: '0px', marginBottom: '0px' }}>
          <text>1）您中途主动取消泰享会员服务、放弃会员权益或终止资格的；</text>
        </div>
        <div style={{ marginTop: '0px', marginBottom: '0px' }}>
          <text>2）泰然城根据《泰然城用户协议》、本协议会平台其他协议及规则注销您的帐号、终止您的泰然城会员资格的；</text>
        </div>
        <div className="tileft">
          <text>6.2  若泰然城无正当理由即自行决定终止向您提供泰享会员服务，作为对您作为泰享会员的回馈，泰然城将根据您会员期限中剩余的整月数，按比例向您退款。然而，因泰然城认定您为违反本协议或任何相关法律的行为、欺诈或滥用泰享会员的行为、或损害泰然城利益或伤害其他用户的行为而导致的终止，泰然城不予退款。</text>
        </div>
        <div><text></text></div>
        <div><text></text></div>

        <div className="tileft">
          <text>七、不可抗力及免责条款</text>
        </div>
        <div className="tileft">
          <text>7.1、您理解泰然城将尽所能确保本服务及其所涉及的技术及信息安全、可靠，但受限于现有技术有限，对于下述原因导致的合同履行障碍、瑕疵、延后或内容变更等情形，导致您直接或间接损失，您理解泰然城无法承担责任：</text>
        </div>
        <div className="tileft">
          <text>7.1.1、因服务器的死机、网络的故障、数据库故障、软件升级、服务器维修、调整、升级等问题或 因自然灾害、罢工、暴乱、战争、恐怖袭击、政府行为、黑客攻击、司法行政命令等不可抗力因素</text>
        </div>
        <div className="tileft">
          <text>7.1.2、因电信部门技术调整或故障、通讯网络故障等公共服务因素；</text>
        </div>
        <div className="tileft">
          <text>7.1.3、用户自身设备的软件、系统、硬件和通信线路出现故障，或用户通过非本协议项下约定的方式使用本服务的；</text>
        </div>
        <div className="tileft">
          <text>7.1.4、鉴于网络服务的特殊性，出现紧急设备/系统的故障/维护、网络信息与数据安全等情况，您同意泰然城有权中断或终止部分或全部的网络服务，并及时以公告形式通知。对于因此造成服务的中断或终止而造成的；</text>
        </div>
        <div className="tileft">
          <text>7.1.5、您的泰享会员服务期限中包含解决故障、服务器维修、调整、升级等所需用的合理时间，对上述情况所需用的时间泰然城不予补偿。</text>
        </div>
        <div><text></text></div>
        <div><text></text></div>


        <div className="tileft">
          <text>八、其他</text>
        </div>
        <div className="tileft">
          <text>8.1、泰然城未能坚持或未能强制要求您严格遵守本协议不构成对任何权利的放弃。</text>
        </div>
        <div className="tileft">
          <text>8.2、本协议由泰然城进行解释。</text>
        </div>
      </div>
    )
  }
}