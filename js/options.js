document.addEventListener('DOMContentLoaded', function(){

    if( localStorage['accountType'] != undefined)
    {
        $('#accountType'+localStorage['accountType']).attr("checked", true);
    }
    if( localStorage['accountName'] != undefined)
    {
        $('#accountName').val(localStorage['accountName']);
    }
    if( localStorage['siteId'] != undefined)
    {
        $('#siteId').val(localStorage['siteId']);
    }
    if( localStorage['adzoneId'] != undefined)
    {
        $('#adzoneId').val(localStorage['adzoneId']);
    }
    if( localStorage['accountPw'] != undefined)
    {
        $('#accountPw').val(localStorage['accountPw']);
    }
    if( localStorage['autoOpenFanli'] != undefined && localStorage['autoOpenFanli'] == 'true')
    {
        $('#autoOpenFanli').attr('checked',true);
    }
    if( localStorage['hideToolbar'] != undefined && localStorage['hideToolbar'] == 'true')
    {
        $('#hideToolbar').attr('checked',true);
    }

    document.querySelector('#saveOptions').addEventListener('click', function(){
        $('#Info1').html("正在更新, 请稍候...");
        var accountType = $("input[name=accountType]:checked").val();
        var accountName = $('#accountName').val();
        var accountPw = $('#accountPw').val();
        var siteId = $('#siteId').val();
        var adzoneId = $('#adzoneId').val();
        if(accountType == undefined){
            $('#Info1').html("帐号类型不能为空!");
        }else if($.trim(accountName) == ''){
            $('#Info1').html("登录帐号不能为空!");
        }else{
            localStorage['accountType'] = accountType;
            localStorage['accountName'] = accountName;
            localStorage['accountPw'] = accountPw;
            localStorage['siteId'] = siteId;
            localStorage['adzoneId'] = adzoneId;
            localStorage['autoOpenFanli'] = $("input[name=autoOpenFanli]:checked").size() > 0;
            localStorage['hideToolbar'] = $("input[name=hideToolbar]:checked").size() > 0;
            $('#Info1').html("已更新!");
        }
    });
});
