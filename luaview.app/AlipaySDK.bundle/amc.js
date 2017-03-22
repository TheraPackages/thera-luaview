/*
 * Alipay.com Inc.
 * Copyright (c) 2004-2015 All Rights Reserved.
 *
 * common.js
 *
 */

// 名字空间 alipay mobile cashier
var amc = {};

amc.rpcData = flybird.rpcData;
amc.platform = document.platform || 'chrome';
amc.isIOS = (amc.platform === 'iOS');
amc.isAndroid = (amc.platform === 'android');
amc.isFlybird = (amc.isIOS || amc.isAndroid);

amc.isPlus = false;
if(amc.isIOS){
     amc.isPlus = document.isIphonePlus(); // @低凋
}
amc.path =  amc.isAndroid ? 'com.alipay.android.app/' :'AlipaySDK.bundle/';

// display='flex'使隐藏元素可见
amc.VISIBLE = 'flex';
// 公共方法名字空间 function
amc.fn = {};
amc.fn.getById = function(id) {
    return document.getElementById(id);
};

/*
 * 创建节点
 * tagName(string): 要创建的节点的类型名称，如'div'
 * className(string): CSS类名
 * parent(tag): 父节点
 */
amc.fn.create = function(tagName, className, parent){
    var tag = document.createElement(tagName);
    if(!tag){
        return;
    }
    
    if(className) {
        tag.className = className;
    }
    
    if(parent) {
        parent.appendChild(tag);
    }
    
    return tag;
};

/*
 * 创建节点
 * data(obj): data['pageloading'] === '1'或'0',分别表示显示indicator和隐藏indicator
 * btnTitleId(string): 需要被隐藏或显示的按钮文案的id
 * indicatorId(string): 需要被显示或隐藏的indicator图片的id
 */
amc.fn.shouldShowBtnIndicator = function(data, btnTitleId, indicatorId) {
    if(!data) {
        return false;
    }
    
    if(data['pageloading'] === '1'){
        amc.fn.hide(btnTitleId);
        amc.fn.show(indicatorId);
        return true;
    } else if(data['pageloading'] === '0') {
        amc.fn.show(btnTitleId);
        amc.fn.hide(indicatorId);
    }
    
    return false;
};

// 公共图片资源名字空间 resource
amc.res = {};
//全屏返回按钮
amc.res.navBack = amc.path + 'alipay_msp_back';
amc.res.navClose = amc.path + 'alipay_msp_back_close';
amc.res.navMore = amc.path + 'alipay_msp_mini_three_point';
//半屏返回按钮
amc.res.arrowLeft = amc.path + 'alipay_msp_arrow_left';
amc.res.close = amc.path + 'alipay_msp_close';
amc.res.arrowRight = amc.path + 'alipay_msp_arrow_right';
// 菊花
amc.res.loading = amc.path + 'alipay_msp_loading.gif';
amc.res.success = amc.path + 'alipay_msp_success.gif';

amc.res.help = amc.path + 'alipay_msp_help';
//小菊花
amc.res.indicator = 'indicatior';

amc.specs = {};
amc.specs.navHeight =  amc.isAndroid ? 48 : 64; // iPhone 状态栏高度均为 64 point
amc.specs.marqueeHeight = 36;
//安卓中body包含导航栏、iOS中body不包含导航栏
amc.specs.bodyHeight = window.innerHeight - amc.specs.navHeight;
amc.specs.iBodyMinH = amc.isPlus ? 518 : 400;
amc.specs.iBodyHeight = (0.66 * window.innerHeight > amc.specs.iBodyMinH) ? Math.round(0.66 * window.innerHeight) : amc.specs.iBodyMinH;
amc.specs.iNavHeight = amc.isPlus ? 60 : 46; //45.5的高度+1px的横线

amc.fn.exit = function() {
    document.submit({'action':{'name':'loc:exit'}});
};
amc.fn.back = function () {
    document.submit({'action':{'name':'loc:back'}});
};

/*
 * 在外部(浏览器或淘宝等)打开链接(在支付过程中，如果在支付过程中跳转会影响支付成功率)
 * url(string): 要跳转的地址
 * willReturn(string): '0' 打开 url后需要跳回钱包； '1'不需要跳回钱包
 */
amc.fn.openurl = function(url,willReturn) {
    if(!url){
        return;
    }
    if(willReturn !== '1' && willReturn !== '0'){
        willReturn = '0';
    }
    
    document.submit({'action':{'name':"loc:openurl('"+ url +"','"+ (willReturn || '0') +"')"}});
};

/*
 * 在内置浏览器打开链接(如:打开协议内容)
 * url(string): 要打开的链接地址
 */
amc.fn.openweb = function(url) {
    if(!url){
        return;
    }
    document.submit({'action':{'name':"loc:openweb('"+url+"')"}});
};

amc.fn.getMarquee = function(txt) {
    var marquee = create('marquee');
    marquee.className = 'amc-marquee';
    marquee.innerText = txt || '';
    return marquee;
};
//### 播放gif图片
amc.fn.playGif = function(gifDiv,gifImg){
    if (gifImg){
        gifDiv.src = gifImg;
        amc.fn.show(gifDiv);
    } else {
        amc.fn.hide(gifDiv);
    }
};

amc.fn.hideKeyboard = function() {
    //### 收起全部键盘
    var inputArray = document.querySelectorAll('input');
    for (var i = 0; i < inputArray.length; i++) {
        inputArray[i].blur();
    }
};
//### 退出确认
amc.fn.exitConfirm = function(msg){
    msg = msg || '{{confirm_exit}}';
    var confirmObj = {
    title: '',
    message: msg,
    okButton: '{{confirm_btn}}',
    cancelButton: '{{cancel}}'
    };
    
    document.confirm(confirmObj, function (result) {
        if (result.ok) {
            document.submit({"action":{"name":"loc:exit"}});

        }
    });
};

//### 协议个数不定时打开协议
amc.fn.showProtocolList = function(pList) {
    // 一个协议
    if (pList.length == 1){
        document.submit({"action":{"name":"loc:openweb('"+pList[0]["url"]+"','"+pList[0]["text"]+"')"}});
        return;
    }
    // 多个协议
    var protocolArray = new Array();
    for (var i = 0; i < pList.length; i++) {
        protocolArray.push(pList[i]["text"]);
    }
    document.actionSheet({
            'text' : '{{protocol}}',
            'btns': protocolArray,
            'cancelBtn': '{{cancel}}'
            }, function(data) {
            document.submit({"action":{"name":"loc:openweb('"+pList[data.index]["url"]+"','"+pList[data.index]["text"]+"')"}});
        }
    );
};

amc.fn.isString = function(str){
    return ((str instanceof String) || typeof str == 'string');
};

amc.fn.show = function(tag)
{
    if(tag){
        tag = amc.fn.isString(tag) ? document.getElementById(tag) : tag;
        
        if(tag){
            tag.style.display = amc.VISIBLE;
        }
    }
};

amc.fn.hide = function(tag)
{
    if(tag){
        tag = amc.fn.isString(tag) ? document.getElementById(tag) : tag;
        
        if(tag){
            tag.style.display = 'none';
        }
    }
};

/*
 * 视图范例: < 返回     支付宝      完成/···  (/表示互斥)
 * lImg(string): 左侧图片(通常作为返回按钮), 默认id=“navImgL”;false则不创建
 * lTxt(string): 最左侧的文字(“返回”):如果为undefined/""则不创建;默认id="navTxtL";
 * mTxt(string): 中间文案(作为Title):如果为undefined/""则不创建;
 * rTxt(string): 最左侧的文字(“完成”/"取消"等):默认id="navTxtR"; 如果为undefined/""则不创建
 * rImg(string): 最右侧的图片(例如:作为"more"按钮),默认id="navImgR"; false则不创建
 * onLeft(function): 左侧box按下的回调
 * onRight(function): 右侧box按下的回调
 */
amc.fn.iOSNav = function(lImg, lTxt, mTxt, rTxt,  rImg, onLeft, onRight)
{
    var create = amc.fn.create;
    
    // nav
    var _nav = create('nav');
    _nav.className = 'amc-nav-box';
    
    // left box
    var _lBox = create('div');
    _lBox.className = 'amc-nav-l-box';
    _lBox.id = 'navBoxL';
    
    // left img
    if(lImg){
        var _lImg = create('img');
        _lImg.className = 'amc-nav-l-img';
        _lImg.id = 'navImgL';
        _lImg.src = lImg;
        _lBox.appendChild(_lImg);
        
        //voice over
        if(lImg === amc.res.navBack){
            _lImg.alt = '{{return}}';
        } else if(lImg === amc.res.navClose){
            _lImg.alt = '{{exit}}';
        }
        _lBox.onclick = onLeft;
    }
    
    // left label
    if(lTxt){
        var _lTxt = create('label');
        _lTxt.className = 'amc-nav-l-text';
        
        //如果左侧没有图片，则不需要间距
        if(!lImg) {
            _lTxt.style.marginLeft = 0
        }
        _lTxt.id = 'navTxtL';
        _lTxt.innerText = lTxt;
        _lBox.appendChild(_lTxt);
        
        _lBox.onclick = onLeft;
    }
    
    // middle box
    var _mBox = create('div');
    _mBox.className = 'amc-nav-m-box amc-v-box';
    // 6p: 两边padding 40, l-box/r-box 各78, 总和196; 5s: padding 30, l-box/r-box 各60 总和 150
    // 算上间距，稍微多减一点
    _mBox.style.maxWidth = window.innerWidth - (amc.isPlus ? (200) : (160));
    if(mTxt){
        var _mTxt = create('label');
        _mTxt.id = 'navTxtM';
        _mTxt.innerText = mTxt;
        _mTxt.className = 'amc-nav-m-text';
        _mBox.appendChild(_mTxt);
    }
    
    var _rBox = create('div');
    _rBox.className = 'amc-nav-r-box';
    _rBox.id = 'navBoxR';
    
    
    if(rTxt){
        var _rTxt = create('label');
        _rTxt.className = 'amc-nav-r-text';
        _rTxt.innerText = rTxt;
        _rTxt.id = 'navTxtR';
        _rBox.appendChild(_rTxt);
        _rBox.onclick = onRight;
    } else if(rImg){
        var _rImg = create('img');
        _rImg.className = 'amc-nav-r-img'
        _rImg.id = 'navImgR';
        _rImg.src = rImg;
        _rBox.appendChild(_rImg);
        _rBox.onclick = onRight;
    }
    
    _nav.appendChild(_lBox);
    _nav.appendChild(_mBox);
    _nav.appendChild(_rBox);
    
    return _nav;
};


/*
 * 视图范例: < | 返回       ···
 * 视图范例: 支付宝         |完成
 * lImg(string): 左侧图片(通常作为返回按钮), 默认id=“navImgL”;
 * lTxt(string): 安卓没有左侧文字,该变量作为占位符; 该参数为Null
 * mTxt(string): 中间文案(作为Title):
 * rTxt(string): 最左侧的文字(“完成”/"取消"等):默认id="navTxtR";
 * rImg(string): 最右侧的图片(例如:作为"more"按钮),默认id="navImgR"; 
 * onLeft(function): 左侧box按下的回调
 * onRight(function): 右侧box按下的回调
 * 注意: 以上参数若为''/undefined/false/null则不创建
 */
amc.fn.androidNav = function(lImg,lTxt, mTxt, rTxt, rImg, onLeft, onRight)
{
    var create = amc.fn.create;
    var _nav = create('div');
    _nav.className = 'amc-nav-box-android';
    
    var _lBox = create('div');
    _lBox.className = 'amc-nav-l-box-android';
    _lBox.id = 'navBoxL';
    _nav.appendChild(_lBox);
    
    // <
    if(lImg){
        var _lImgBox = create('div');
        _lImgBox.className = 'amc-nav-l-img-box-android';
        _lImgBox.onclick = onLeft;
        _lImgBox.id = 'navImgBoxL';
        
        var _lImg = create('img');
        _lImg.className = 'amc-nav-l-img-android';
        _lImg.id = 'navImgL';
        _lImg.src = lImg;
        
        _lImgBox.appendChild(_lImg);
        _lBox.appendChild(_lImgBox);
        
        // |
        var _lBar = create('div');
        _lBar.className = 'amc-nav-line-android';
        _lBox.appendChild(_lBar);
        
        //voice over
        if(lImg === amc.res.navBack){
            _lImg.alt = '{{return}}';
        } else if(lImg === amc.res.navClose){
            _lImg.alt = '{{exit}}';
        }
    }
    
    // 返回 or 支付宝
    var _mTxt = create('label');
    _mTxt.className = 'amc-nav-m-text-android';
    _mTxt.innerText = mTxt || '';
    _mTxt.id = 'navTxtM';
    _lBox.appendChild(_mTxt);
    
    
    var _rBox = create('div');
    _rBox.className = 'amc-nav-r-box-android';
    _rBox.id = 'navBoxR';
    
    // ···
    if(rImg){
        var _rImg = create('img');
        _rImg.className = 'amc-nav-r-img-android';
        _lImg.id = 'navImgL';
        _rImg.src = rImg;
        
        _rBox.appendChild(_rImg);
        _rBox.onclick = onRight;
    } else if(rTxt) {
        // | 设置
        var _rBar = create('div');
        _rBar.className = 'amc-nav-line-android';
        _nav.appendChild(_rBar);
        
        var _rTxt = create('label');
        _rTxt.className = 'amc-nav-r-text-android';
        _rTxt.id = 'navTxtR';
        _rTxt.innerText = rTxt;
        _rBox.appendChild(_rTxt);
        _rBox.onclick = onRight;
    }
    _nav.appendChild(_rBox);
    
    //安卓平台需要有nav标签才能能判断是全屏
    var _isFullScreen = create('nav');
    _isFullScreen.className = 'amc-hidden';
    _nav.appendChild(_isFullScreen);
    return _nav;
};

amc.fn.getNav = amc.isAndroid ? amc.fn.androidNav : amc.fn.iOSNav;
amc.pressableElement = function(elDiv,el) {
    if(elDiv && el){
        elDiv.onmousedown = function(){
            el.style.opacity = '0.5';
        };
        elDiv.onmouseup = function() {
            el.style.opacity = '1';
        };
    }
};

/*
 * isBack 左上角为返回按钮、否则为取消(安卓为关闭)
 * title(string): 中间文案(作为Title),id: iNavTxtM
 * rTxt(string): 最左侧的文字(“完成”/"取消"等):
 * rImg(string): 最右侧的图片(例如:作为"more"按钮):默认id="inavImgR";
 * onLeft(function): 左侧box按下的回调
 * onRight(function): 右侧box按下的回调
 * 注意: 以上参数若为''/undefined/false/null则不创建
 */
amc.fn.navBack = function(isBack, title, rTxt, rImg, onLeft, onRight){
    if(isBack){
        return amc.fn.getNav(amc.res.navBack, '{{return}}', title, rTxt, rImg, onLeft, onRight);
    } else {
        return amc.fn.getNav(amc.isAndroid ? amc.res.navClose : null, '{{cancel}}', title, rTxt, rImg, onLeft, onRight);
    }
};


/*
 * 视图范例: x    付款详情   ?/设置
 * lImg(string): 左侧按钮图片
 * mTxt(string): 中间文案(作为Title),id: iNavTxtM
 * rTxt(string): 最左侧的文字(“完成”/"取消"等):
 * rImg(string): 最右侧的图片(例如:作为"more"按钮):默认id="inavImgR";
 * onLeft(function): 左侧box按下的回调
 * onRight(function): 右侧box按下的回调
 * 注意: 以上参数若为''/undefined/false/null则不创建
  * mImg pre-confirm页特殊需求，需要添加一个img
 */
amc.fn.iNav = function(lImg, mTxt, rTxt, rImg, onLeft, onRight, mImg) {
    var create = amc.fn.create;
    var _iNav = create('div');
    _iNav.className = 'amc-i-nav-box';
    
    var _lBox = create('div');
    _lBox.className = 'amc-i-nav-l-box';
    _lBox.id = 'iNavBoxL';
    
    if(lImg){
        var _lImg = create('img');
        _lImg.className = 'amc-i-nav-l-img';
        _lImg.src = lImg;
        _lImg.id = 'iNavImgL';
        _lBox.appendChild(_lImg);
        amc.pressableElement(_lBox,_lImg);
        
        if(lImg === amc.res.arrowLeft){
            _lImg.alt = '{{return}}';
        }else if(lImg === amc.res.close){
            _lImg.alt = '{{exit}}';
        }
        _lBox.onclick = onLeft;
    }
    
    var _mBox = create('div');
    _mBox.className = 'amc-i-nav-m-box';
    if(mImg){
        var _mImg = create('img');
        _mImg.id = 'iNavImgM';
        _mImg.src = mImg;
        _mImg.className = 'amc-i-nav-m-img';
        _mBox.appendChild(_mImg);
    }
    if(mTxt){
        var _mTxt = create('label');
        _mTxt.className = 'amc-i-nav-m-text';
        _mTxt.innerText = mTxt;
        _mTxt.id = 'iNavTxtM';
        _mBox.appendChild(_mTxt);
    }
    var _rBox = create('div');
    _rBox.className = 'amc-i-nav-r-box';
    _rBox.id = 'iNavBoxR';
    
    if(rImg) {
        var _rImg = create('img');
        _rImg.className = 'amc-i-nav-r-img';
        _rImg.id = 'iNavImgR';
        _rImg.src = rImg;
        _rBox.appendChild(_rImg);
        amc.pressableElement(_rBox,_rImg);
        _rBox.onclick = onRight;
    }else if(rTxt) {
        var _rTxt = create('label');
        _rTxt.className = 'amc-i-nav-r-text';
        _rTxt.id = 'iNavTxtR';
        _rTxt.innerText = rTxt;
        _rBox.appendChild(_rTxt);
        amc.pressableElement(_rBox,_rTxt);
        _rBox.onclick = onRight;
    }
    
    _iNav.appendChild(_lBox);
    _iNav.appendChild(_mBox);
    _iNav.appendChild(_rBox);
    
    return _iNav;
};
