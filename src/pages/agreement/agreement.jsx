import React, { Component } from 'react';
import 'src/scss/agreement.scss';
import Popup from 'component/modal';

const protocol_content = `<p style="margin-top: 16px; margin-bottom: 16px; line-height: 22px; background: rgb(255, 255, 255); text-indent: 0em; text-align: center;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong><span style="font-size: 16px;">进口个人委托申报协议</span></strong></span></p>
<p style="margin-top: 16px; margin-bottom: 16px; line-height: 22px; background: rgb(255, 255, 255); text-indent: 2em;">
    <span style="font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本人承诺所购买商品系个人合理自用，针对保税区发货的各种商品，现委托商家代理申报，代缴税款等通关事宜，本人保证遵守《海关法》和国家相关法律法规，保证所提供的身份信息和收货信息真实完整，无侵犯他人权益的行为，以上委托关系如实填写，本人愿意接受海关、检验检疫机构及其他监管部门的监管，并承担相应法律责任。</span>
</p>
<p style="margin-top: 16px; margin-bottom: 16px; line-height: 22px; background: rgb(255, 255, 255); text-indent: 0em; text-align: center;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong><span style="font-size: 16px; font-family: 微软雅黑;">泰然城用户协议</span></strong></span>
</p>
<p style="margin-top: 16px; margin-bottom: 16px; line-height: 22px; background: rgb(255, 255, 255); text-indent: 2em;">
    <span style="font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">欢迎加入泰然城，开始您的幸福购物之旅！</span>
</p>
<p style="margin-top: 16px; margin-bottom: 16px; line-height: 22px; background: rgb(255, 255, 255); text-indent: 2em;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;; font-size: 14px;">感谢您使用我们的服务。泰然城的各项服务由泰然城电子商务有限公司提供，服务所有权和运营权属于泰然城电子商务有限公司（泰然城平台包括泰然城网站www.tairanmall.com和客户端），以下称为“泰然城”或“本站”。</span>
</p>
<p style="margin-top: 16px; margin-bottom: 16px; line-height: 22px; background: rgb(255, 255, 255); text-indent: 2em;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><span style="font-size: 14px;">泰然城在此特别提醒用户，《泰然城用户协议》（以下简称“本协议”）为您与泰然城平台经营者者之间所订立的契约，具有合同的法律效力。</span><strong><span style="font-size: 14px;">您在使用泰然城提供的各项服务之前，应仔细阅读本协议的各项条款，特别是加粗的涉及您核心利益的条款、免除或者限制责任的条款、法律适用和争议解决条款。</span></strong><span style="font-size: 14px;">您一旦使用泰然城服务，即视为您已了解并完全同意本协议各项内容，包括泰然城对本协议随时所做的任何修改，并成为泰然城用户（以下简称“您”或“用户”）。 届时您不应以未阅读本协议的内容为理由，主张本协议无效，或要求撤销本协议。</span></span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style="font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong><span style="font-size: 14px;"></span></strong></span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">一、服务内容</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.用户注册成功后，即成为泰然城的会员，可享受泰然城为您提供的服务，可以在泰然城上进行购物、订单查询、参加各项优惠活动、发表产品评论等。请记住您的注册手机号，它是您在泰然城的唯一识别，您的任何投诉、问题、购买记录，均采用这个注册手机号处理。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.用户必须自行准备如下设备和承担如下开支：</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.1上网设备，包括并不限于电脑或者其他上网终端、调制解调器及其他必备的上网装置；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.2上网开支，包括并不限于网络接入费、上网设备租用费、手机流量费等。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">3.泰然城有权不断更改和改进服务，包括增加、删除某项服务，或暂停、彻底停止某项服务。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">二、用户注册及使用规则</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.注册资格</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px"><span style="font-family:微软雅黑">用户须为具有法定的相应权利能力和行为能力的自然、法人或其他组织，能够独立承担法律责任，如用户不具备前述与用户行为相适应的民事行为能力，则用户及用户的监护人应依照法律规定承担因此而导致的一切后果。</span></span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.个人信息</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.1 用户同意泰然城为提供更好的服务，向您搜集姓名/名称、地址、手机号码等个人信息，泰然城将搜集的前述信息用于精准服务和相关的信息推送。用户同意其提供的注册资料真实、准确、完整、合法有效，用户个人信息如有变动的，应及时更新个人信息。泰然城有权通过征信机构、银行卡绑定等方式，对您提交的身份信息的真实性进行验证。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且泰然城保留终止用户使用本平台各项服务的权利。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.2 用户设置的会员名不得违反国家法律法规的规定以及侵犯或涉嫌侵犯他人合法权益。泰然城有权对用户名等用户注册信息进行审核并向用户反馈注册结果，只有经泰然城审核同意并反馈确认的才成为泰然城的用户，并享有泰然城提供的各项服务。否则，泰然城有权终止向用户提供泰然城平台服务，注销账户。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.3 用户在本站进行浏览、下单购物等活动时，涉及用户真实姓名/名称、通信地址、联系电话等隐私信息的，本站将予以严格保密，除非得到用户的授权或法律另有规定，本站不会向外界披露用户隐私信息。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">3.账户</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px">3.1 用户注册成功后，将产生泰然城用户名和密码等账户信息，用户可以根据本站规定改变密码。用户应谨慎合理的保存、使用用户名和密码。如账户因您主动泄露或遭受他人诈骗等行为导致的损失及后果，均由您自行承担，如用户账号遭受他人攻击而导致损失的，泰然城网和用户将根据双方的过错依法承担相应的责任。</span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px">3.2 您确认并同意，在您的账户登录状态下进行的所有操作均视为您本人的操作，您应对您账户项下的所有行为结果（包括但不限于在线签署各类协议、发布信息、购买商品及服务及披露信息等）负责。</span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">3.3 用户不得将在本站注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.使用规则</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.1 用户在使用泰然城服务过程中实施的所有行为均应遵守中华人民共和国法律、法规等规范性文件及泰然城各项规则的规定和要求，不违背社会公共利益或公共道德，不损害他人的合法权益，不违反本协议及相关规则。如果违反前述承诺，产生任何法律后果的，用户应以自己的名义独立承担所有的法律责任，并确保泰然城免于因此遭受任何损失。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.2 用户确认并同意，泰然城有权在提前通过网络公示等方式对平台服务规则进行修改，用户应当在指定时间之内对相关服务规则的修改进行回复。用户未对相关修改进行反馈意见的情况下即视为同意上述修改。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.3 用户应该严格遵守泰然城的一切规则，不得出现恶意注册、恶意点评、恶意退款、恶意骗取积分等违规行为，一经发现，泰然城有权取消用户资格，并追回已经发放的全部积分，同时该用户必须承担由此给泰然城带来的所有损失。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.4 用户同意，泰然城拥有通过邮件、短信、电话，以及客户端推送等形式，向在本站注册、购物用户、收货人发送促销活动等告知信息的权利，泰然城将给予用户退订的权利，用户如不同意接收前述信息，可以通过前述信息中退订途径进行退订。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.5 用户了解并同意，泰然城有权应国家司法、行政等主管部门的要求，向其提供您在泰然城平台填写的注册信息和交易记录等必要信息。如您涉嫌侵犯他人知识产权，则泰然城亦有权在初步判断涉嫌侵权行为存在的情况下，向权利人提供您必要的身份信息。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.6 用户同意，泰然城有权使用用户的注册信息、用户名、密码等信息，登录进入用户的注册账户，进行证据保全，包括但不限于公证、见证等。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.7 泰然城用户账号如果一年内无登录记录，将被视为休眠账户作冻结处理；超过两年无登录记录，泰然城有权注销该账号。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.8 对于被泰然城暂时停止或者永久停止账号的用户，泰然城将不再向该用户提供服务。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.9 为便于或更好的提供服务，用户同意并授权泰然城将用户在注册、使用本站过程中提供、形成的信息传递给泰然城关联公司（关联公司指泰然城电子商务有限公司下分子公司、孙公司）或本站卖方，用于泰然城的产品/服务包含的核心业务或附加功能上，这些功能包含了网上购物所必须的功能、改进泰然城平台上的产品与/或服务功能、保障交易安全所必须的功能，以及为精准服务用户而在泰然城圈儿、社区、早教、亲子等板块使用。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">5.授权使用</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">5.1 对于用户在注册和使用泰然城过程中提供的资料及数据信息，用户授权泰然城及其关联公司独家的、全球通用的、永久的、免费的许可使用权利（包括再授权），用途包括但不限于网站、电子杂志、杂志、刊物等。泰然城及其关联公司有权使用、复制、编辑、改写等方式处理并展示用户的数据资料。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">5.2您同意可以使用本站的账户信息在与本站合作的第三方网站进行注册、登录和账户绑定操作，届时您应按照第三方网站的相关协议与规则使用第三方网站，而不是按照本协议。</span><strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">第三方网站的内容、产品、广告和其他任何信息均由您自行判断并承担风险，而与本站无关。</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">三、用户依法言行义务</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.本协议依据国家相关法律法规规章制定，用户同意在注册账户和使用泰然城期间，严格遵守以下义务：</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.1 不得传输或发表：煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.2 不得利用本站从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.3 不得干扰本站的正常运转，不得侵入本站及国家计算机信息系统；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.4 不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽的、不文明的等信息资料；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.5 不得传输或发表损害国家社会公共利益和涉及国家安全的信息资料或言论；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.6 不得教唆他人从事本条所禁止的行为；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.7 不得发布任何侵犯他人著作权、商标权等知识产权或合法权利的内容；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.8 不得发布任何泰然城认为不适合在泰然城展示的内容；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.用户应不时关注并遵守本站不时公布或修改的各类合法规则规定。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">3.本站保有删除站内各类不符合法律政策或不真实的信息内容的权利，并予以通知用户。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.若用户未遵守以上规定的，本站有权作出独立判断并采取暂停或关闭用户帐号等措施。用户须对自己在网上的言论和行为承担法律责任。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">四、订单</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.在本站购物的用户，请您仔细确认所购商品的名称、价格、数量、型号、规格、尺寸、联系地址、电话、收货人等信息。收货人与用户本人不一致的，收货人的行为和意思表示视为用户的行为和意思表示，用户应对收货人的行为及意思表示的法律后果承担连带责任。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2. </span><strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">除网站页面另有明确标示为自营商品外，泰然城应当被界定为本站买卖双方提供网络服务的第三方交易平台。在您与入驻商家发生的消费者权益纠纷、产品质量纠纷，均应由您先行与产品或服务的卖方解决。</span></span></strong><span style=";font-family:微软雅黑;font-size:14px"><span style="font-family:微软雅黑">如无法解决的，您可申请泰然城客服介入调解，泰然城不承担卖方或买方的责任。</span></span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">3.除法律另有强制性规定外，双方约定如下：本站上展示的商品和价格等信息仅仅是要约邀请，您下单时须填写您希望购买的商品数量、价款及支付方式、收货人、联系方式、收货地址等内容；系统生成的订单信息是计算机信息系统根据您填写的内容自动生成的数据，仅是您向品牌合作商发出的合同要约；</span><strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">本站卖方收到您的订单信息后，只有将您在订单中订购的商品从仓库实际直接向您发出时，方视为您与卖方之间就实际直接向您发出的商品建立了合同关系；</span></span></strong><span style=";font-family:微软雅黑;font-size:14px"><span style="font-family:微软雅黑">如果您在一份订单里订购了多种商品并且本站卖方只给您发出了部分商品时，您与本站卖方之间仅就实际直接向您发出的商品建立了合同关系；只有在本站卖方实际直接向您发出了订单中订购的其他商品时，您和本站卖方之间就订单中该其他已实际直接向您发出的商品才成立合同关系。您可以随时登录您在本站注册的账户，查询您的订单状态。</span></span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.您了解并同意，本平台上的商品、价格、数量、是否有货等商品信息随时可能发生变动，本站不作特别通知。您接受本平台在发现网页拼写错误或系统问题导致的展示错误，正式向您发出通知后，对商品信息进行调整，订单按照正确的信息执行，或取消订单，同时若用户违反泰然城交易规则，平台管理者有权关闭或拒绝您的交易订单，泰然城承诺不滥用该条款的权利，不故意利用该条款损害用户合法权益。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">5.泰然城、关联公司或本站卖方将会把商品（货物）送到您所指定的收货地址。您了解本平台所提示的送货时间供参考，实际送货会与参考时间略有差异。平台管理者和所有者或其关联公司不对因您及收货人原因导致无法送货或延迟送货承担责任。若发生不可抗力或其他正当合理理由导致发货延迟的，您将给予充分理解。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px"><span style="font-family:微软雅黑">因如下情况造成订单延迟或无法配送等，泰然城或本站卖方不承担延迟配送的责任：</span></span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;&nbsp;5.1 用户提供的信息错误、地址不详细等原因导致的；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;&nbsp;5.2 货物送达后无人签收，导致无法配送或延迟配送的；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;&nbsp;5.3 情势变更因素导致的；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;&nbsp;5.4 不可抗力因素导致的，例如：自然灾害、交通戒严、突发战争等。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">五、责任限制</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px">1.除泰然城在本协议中规定的其它限制之外，在中国（“中国”指中华人民共和国，为本协议之目的不包括香港和澳门特别行政区以及台湾省）法律法规所允许的限度内，对于因用户使用服务而引起的或与之有关的任何直接的、间接的、特殊的、附带的、后果性的或惩罚性的损害，或任何其它性质的损害，泰然城、泰然城的董事、管理人员、雇员、代理或其它代表在任何情况下都不承担责任。</span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px">2.泰然城不对本站所涉及的技术及信息的有效性、准确性、可靠性、稳定性和及时性作出任何承诺和保证。如因不可抗力或其它本站无法控制的原因使本站系统崩溃或无法正常使用导致本平台不能服务或延迟服务、丢失数据信息、记录的，泰然城不承担责任，但泰然城将协助处理相关事宜。</span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px">3.除标有“自营”商品外，用户应理解泰然城平台上销售的商品和相关信息由入驻商家提供和发布；由于泰然城不参与也无法核实商品/服务的交易，对于商品/服务的质量、安全及合法性、真实性、准确性，用户应谨慎判断。</span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px">4.除商品被标有“自营”字样外，用户理解泰然城上发布的商品及相关的图片、文字等信息均由入驻泰然城的卖方所提供，泰然城不对该信息所涉及的知识产权承担责任。</span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px">5.用户有责任切实维护自身持有的银行卡及资金安全，应当采取一切措施避免银行卡及身份信息被泄露。如您银行卡内资金有未经您许可的被盗刷、资金损失等行为，请您主动联系您的开户银行，或者就上述违法行为向公安机关报案。泰然城不承担经系统识别的您卡内资金划转及损失。</span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">六、协议修改</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.泰然城有权不定时修改本协议及/或各类规则。所有修改的适用不具有追溯力，且会在网站进行公示，修改后的协议或规则将在公示后立即生效。如果用户不同意服务的修改条款或规则，应停止使用服务。如用户继续使用服务，则视为同意。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.如果本协议条款与附加条款有冲突，以附加条款为准。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">七、违约赔偿</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.用户同意保障和维护泰然城及其他用户的利益，如因用户违反有关法律、法规或本协议项下的任何条款而给泰然城或任何其他第三人造成损失，用户同意承担由此造成的损害赔偿责任。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.如果用户不遵守本协议，且泰然城未立即采取行动，并不意味泰然城放弃可能享有的任何权利或在将来采取行动。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">3.如用户涉嫌违反有关法律或者本协议之规定，使泰然城遭受任何损失，或受到任何第三方的索赔，或受到任何行政管理部门的处罚，用户应当赔偿泰然城因此造成的损失及（或）发生的费用，包括合理的律师费用。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">八、协议终止</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.您了解并同意，泰然城有权在您的账户存在风险交易的情况下中止、终止向您提供部分或全部泰然城平台服务，暂时冻结或永久冻结（注销）您的账户，且无须为此向您或任何第三方承担任何责任，如出现依法律或本协议及/或泰然城平台规则规定的您违约的情形时，泰然城网可以有权通知您解除本协议，并中止、终止向您提供部分或全部平台服务。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.出现以下情况时，泰然城有权直接以注销账户的方式终止本协议:</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.1泰然城终止向您提供服务后，您涉嫌再一次直接或间接或以他人名义注册为泰然城用户的；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.2您注册信息中的主要内容不真实或不准确或不及时或不完整。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.3本协议（含本协议的修改、附加条款及泰然城各项规则）变更时，您明示并通知泰然城不愿接受新的服务协议的；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.4在您的账户内存在或发现有盗卡、信用卡套现、洗钱等违法违规行为或风险时；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.5其它泰然城认为应当终止服务的情况。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">3.您有权向泰然城要求注销您的账户，经泰然城审核同意的，泰然城注销（永久冻结）您的账户，届时，您与泰然城基于本协议的合同关系即终止。您的账户被注销（永久冻结）后，泰然城没有义务为您保留或向您披露您账户中的任何信息，也没有义务向您或第三方转发任何您未曾阅读或发送过的信息。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.您同意，您与泰然城的合同关系终止后，泰然城仍享有下列权利：</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.1继续保存您的注册信息及您使用泰然城平台服务期间的所有交易信息。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.2您在使用泰然城平台服务期间存在违法行为或违反本协议和/或规则的行为的，泰然城仍可依据本协议向您主张权利。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">5.泰然城中止或终止向您提供泰然城平台服务后，对于您在服务中止或终止之前的交易行为依下列原则处理，您应独立处理并完全承担进行以下处理所产生的任何争议、损失或增加的任何费用，并应确保泰然城免于因此产生任何损失或承担任何费用：</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">5.1您在服务中止或终止之前已经上传至泰然城平台的物品尚未交易的，泰然城有权在中止或终止服务的同时删除此项物品的相关信息；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">5.2您在服务中止或终止之前已经与本站卖方达成买卖合同，但合同尚未实际履行的，泰然城有权删除该买卖合同及其交易物品的相关信息；</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">5.3您在服务中止或终止之前已经与本站卖方达成买卖合同且已部分履行的，泰然城可以不删除该项交易，但泰然城有权在中止或终止服务的同时将相关情形通知您的交易卖方。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">九、法律管辖和适用</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.本协议的订立、执行和解释及争议的解决均应适用中国法律。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.如发生本协议与中国法律相抵触时，则这些条款将完全按法律规定重新解释，而其它合法条款则依旧保持对用户产生法律效力和影响。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">3.本协议的规定是可分割的，如本协议任何规定被裁定为无效或不可执行，该规定可被删除而其余条款应予以执行。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">4.为维护用户在本平台交易过程中的权利义务，您同意泰然城有权先行裁决您与泰然城本站卖方的消费争议，并执行泰然城的裁决结果。如您对泰然城裁决结果不满意或有异议，您有权将争议提交司法机构。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px">5.如泰然城与用户双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向被告所在地法院提起诉讼。</span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">&nbsp;</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <strong><span style="font-family: 微软雅黑;font-size: 14px"><span style="font-family:微软雅黑">十、其他</span></span></strong>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">1.本协议构成双方对本协议之约定事项及其他有关事宜的完整协议，除本协议规定的之外，未赋予本协议各方其他权利。</span>
</p>
<p style="margin-top: 16px;margin-bottom: 16px;line-height: 22px;background: rgb(255, 255, 255)">
    <span style=";font-family:微软雅黑;font-size:14px">2.本协议中的标题仅为方便而设，不作为对标题下条款的解释。</span>
</p>
<p style="margin-top: 16px; margin-bottom: 16px; line-height: 22px; background: rgb(255, 255, 255);">
    <span style=";font-family:微软雅黑;font-size:14px">3.您注册为泰然城的会员即视为您完全接受本协议，在注册之前请您再次确认已知悉并完全理解本协议的全部内容。</span>
</p>`

export default class Agreement extends Component{
	componentDidMount() {
		Popup.MsgTip({msg:"页面点击关闭"});
	}
	componentWillUnmount(){
		const msgTip =document.querySelector("#msgTip");
		msgTip && msgTip.parentNode && msgTip.parentNode.removeChild(msgTip);
	}
	render(){
		return(
			<div data-page="agreement" className="agreement" onClick={this.props.onClose }>
				<div dangerouslySetInnerHTML={{__html: protocol_content}}/>
			</div>
		)
	}
}