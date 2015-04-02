var params = null;
chrome.extension.sendMessage({action: 'get'}, function (response) {
    var url = location.href;
    params = response.params;

    //商品购买页面
    if (is_taobao_item_page(url)) {
        clear_temp_params();
        insertStyle();
        var insertPosition = $('a#J_LinkBuy,a.J_LinkBuy,a#J_LinkAdd').parent().parent();
        var panelHideStyle = params.hideToolbar == 'true' ? 'display:none;' : '';
        if (params.processing == 'true' && url.indexOf('ali_trackid=') > -1 && params.commission != -1) {
            $.ajax({
                url: chrome.extension.getURL('./page/yikaiqi.html'),//已开启佣金
                type: "post",
                dataType: "html",
                success: function (response) {
                    $(response).insertAfter(insertPosition);
                    load_message();
                }
            });
        } else {
            var html = [];
            if (params.commission == -1 || url.indexOf('nopromotion=1') > -1) {
                $.ajax({
                    url: chrome.extension.getURL('./page/meiyongjin.html'),//没佣金
                    type: "post",
                    dataType: "html",
                    success: function (response) {
                        $(response).insertAfter(insertPosition);
                        load_message();
                    }
                });
            } else {
                $.ajax({
                    url: chrome.extension.getURL('./page/kaiqiyongjin.html'),//开启佣金
                    type: "post",
                    dataType: "html",
                    success: function (response) {
                        $(response).insertAfter(insertPosition);
                        load_message();
                        if (params.autoOpenFanli == 'true') {
                            $('#openFanli').click();
                        }
                    }
                });
            }
        }
    }

    //淘宝登录页面
    if (url.indexOf("http://login.taobao.com") > -1) {
        if (params.accountType == 'taobao') {
            
            if (params.accountPw && params.accountPw != "") {
                var i = setInterval(function () {
                    if ($('#TPL_username_1').length > 0){
		    $('#TPL_username_1').val(params.accountName);
                    if ($('#J_SafeLoginCheck')[0].checked) {
                        $('#J_SafeLoginCheck').click();
                    }
                    if (!$('#J_SafeLoginCheck')[0].checked) {
                        clearInterval(i);
                        $('#TPL_password_1').val(params.accountPw);
                        $('#J_SubmitStatic').click();
                    }
		    }
                }, 500);
                var i2 = setInterval(function () {
                    if ($('#J_Message .error').text() != '') {
                        $('body').show();
                        clearInterval(i2);
                    }
                }, 200);
            }else{
                $('body').show();
            }

        }
    }

    //阿里妈妈登录页面
    if (params.processing == 'true' && url.indexOf("www.alimama.com/member/minilogin.htm?style=mini") > -1) {
        if (params.accountType == 'alimama') {
            $('#J_logname').val(params.accountName);
            if (params.accountPw && params.accountPw != "") {
                $("#J_logpassword").val(params.accountPw);
                var count = 0;
                var i = setInterval(function () {
                    clearInterval(i);
                    document.getElementById("J_submit").click();
                }, 500);
                var i2 = setInterval(function () {
                    if ($('#J_Message .error').text() != '') {
                        $('body').show();
                        clearInterval(i2);
                    }
                }, 200);
            }else{
                $('body').show();
            }
        }
    }

    //从结果中点击获取返利数字和推广链接的按钮
    /*if (params.processing == 'true' && url.indexOf('u.alimama.com/union/spread/selfservice/merchandisePromotion.htm') > -1) {
        var i = setInterval(function () {
            var getCodeButtons = $('#J_listMainTable a.get-code');
            if (getCodeButtons.size() == 1) {
                clearInterval(i);
                var commission = $('#J_listMainTable tbody tr td').eq(5).text();
                var commissionRate = $('#J_listMainTable tbody tr td').eq(4).text();
                chrome.extension.sendMessage({action: 'set', data: {
                    commission: commission,
                    commissionRate: commissionRate
                }}, function (response) {
                });
                var auctionid = getCodeButtons.attr("auctionid");
                location.href = "http://u.alimama.com/union/spread/common/allCode.htm?specialType=item&auction_id=" + auctionid;
            } else if ($('#J_listMainTable').text().indexOf('对不起，没找到您要的结果') > -1) {
                clearInterval(i);
                var taobaoItemLink = params.item_link;
                if (taobaoItemLink != '') {
                    chrome.extension.sendMessage({action: 'set', data: {
                        commission: -1,
                        commissionRate: -1
                    }}, function (response) {
                    });
                    location.href = taobaoItemLink;
                }
            }
        }, 500);
    }
    */

    //拿到推广链接，然后重定向过去
    /*if (params.processing == 'true' && url.indexOf('u.alimama.com/union/spread/common/allCode.htm?specialType=item&auction_id') > -1) {
        var i = setInterval(function () {
			$('#J_urlRadio').click();
            var link = $('#J_codeArea').val();
            if (link != '') {
                clearInterval(i);
                chrome.extension.sendMessage({action: 'set', data: {
                    click_url: link
                }}, function (response) {
                    location.href = link;
                });
            }
        }, 500);
    }
    */

    //来到热卖页面的话，跳转过去
    if (params.processing == 'true' && url.indexOf('re.taobao.com') > -1) {
        var i = setInterval(function () {
            location.href = $('.btnBuy').attr('href');
            clearInterval(i);
        }, 500);
    }

    //增加媒体ID和推广位ID提示
    if (url.indexOf('pub.alimama.com/myunion.htm') > -1) {
        var i = setInterval(function () {
            if($('.site-nav').size() > 0){
                clearInterval(i);
                var adzoneInfoUrl = 'http://pub.alimama.com/common/adzone/newSelfAdzone2.json?tag=29&t=1415250236682&_tb_token_=snkWAnAIcpn&_input_charset=utf-8';
                $.ajax({
                    url: adzoneInfoUrl,
                    type: "get",
                    dataType: "json",
                    success: function (response) {
                        var text = '';
                        if(response.data && response.data.otherAdzones){
                            for(var i=0;i<response.data.otherAdzones.length;i++){
                                var item = response.data.otherAdzones[i];
                                if(item && item.sub){
                                    for(var j=0;j<item.sub.length;j++){
                                        var subitem=item.sub[i];
                                        if(subitem['name'] == '代购推广'){
                                            text = '媒体ID:' + item.id + ', 推广位ID:' + subitem.id;
                                        }
                                    }
				}
                            }
                        }
                        if(text == ''){
                            text = '您还没配置媒体类型和推广位类型，<a target="_blank" href="http://easytk.com/?c=main&f=config">请查看教程</a>';
                        }
                        $('<li><a target="_blank" href="http://easytk.com" style="color:#ff802b;">【轻松淘宝客】</a><a style="color:#ff802b;">'+text+'</a></li>').insertBefore($('.site-nav-l .back'));
                    }
                });
            }
        }, 500);
    }
});