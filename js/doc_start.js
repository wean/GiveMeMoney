chrome.extension.sendMessage({action: 'get'}, function (response) {
    var url = location.href;
    var params = response.params;

    //登录成功后获取推广连接和佣金比例
    if (params.processing == 'true' && (url == 'http://u.alimama.com/membersvc/index.htm' || url == 'http://www.alimama.com/index.htm'
            || url.indexOf('http://pub.alimama.com/index.htm') > -1 )) {
        if(params.siteId != "" && params.adzoneId != ""){
            var itemId = get_taobao_item_id(params.item_link);
            var url = "http://pub.alimama.com/common/code/getAuctionCode.json?auctionid="+itemId+"&adzoneid="+params.adzoneId+"&siteid="+params.siteId;
            $.ajax({
                url: url,
                type: "get",
                dataType: "json",
                success: function (response) {
                    if(response.info.ok && response.data && response.data.clickUrl){
                        var link = response.data.clickUrl;
                        chrome.extension.sendMessage({action: 'set', data: {
                            click_url: link
                        }}, function (response) {
                            var taobaokeInfoUrl = "http://pub.alimama.com/pubauc/searchAuctionList.json?q="+encodeURIComponent(params.item_link);
                            $.ajax({
                                url: taobaokeInfoUrl,
                                type: "get",
                                dataType: "json",
                                success: function (response) {
                                    if(response.data.pagelist && response.data.pagelist.length > 0){
                                        var taobaokeInfo = response.data.pagelist[0];
                                        var price = taobaokeInfo.zkPrice || taobaokeInfo.reservePrice;
                                        var commissionRate = taobaokeInfo.commissionRatePercent;
                                        var commission = Math.round(price * commissionRate)/100;
                                        chrome.extension.sendMessage({action: 'set', data: {
                                            commission: commission + "元",
                                            commissionRate: taobaokeInfo.commissionRatePercent + "%"
                                        }}, function (response) {
                                            location.href = link;
                                        });
                                    }else{
                                        chrome.extension.sendMessage({action: 'set', data: {
                                            commission: -1,
                                            commissionRate: -1
                                        }}, function (response) {
                                            location.href = link;
                                        });
                                    }
                                }
                            });
                        });
                    }else{
                        clear_temp_params();
                        alert("获取推广链接失败!");
                    }
                }
            });
        }else{
            clear_temp_params();
            alert('您的配置不正确,请先看教程!');
            location.href = "http://easytk.com/?c=main&f=config";
        }
    }

    //隐藏页面
    if (params.processing == 'true'  &&
        ( url.indexOf('login.taobao.com/member/login.jhtml?style=minisimple') > -1 //淘宝登录页面
            || url.indexOf('re.taobao.com') > -1 //热卖页面
            || url.indexOf('u.alimama.com/membersvc/index.htm') > -1
        )) {
        $("<style>body{display:none}</style>").appendTo($('head') );
    }

    if (params.processing == 'true' && (url.indexOf('http://www.alimama.com/member/login.htm') > -1)) {
        if(params.accountType  == 'taobao' ){
            location.href = 'https://login.taobao.com/member/login.jhtml?style=minisimple&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true&disableQuickLogin=true';
        }else if( params.accountType == 'alimama' ){
            location.href = 'http://www.alimama.com/member/minilogin.htm?style=mini&proxy=http://u.alimama.com/union/proxy.htm&redirect=http://u.alimama.com';
        }
    }
});