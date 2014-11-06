var tablink = "";
var price = "";
var allHTML;
$(function()
{
    //console.log('1');

    document.querySelector('#query1').addEventListener('click', function(event){


        var queryUrl = $.trim($("#urlTextbox").val());
            $('#titleDiv').hide();
        if( queryUrl == "" || is_taobao_item_page(queryUrl) == false)
        {
            return;
        }
        $('#info1234').prop('src','http://easytk.com/?c=plugin&f=show_commision_info&url='+encodeURIComponent(queryUrl));


        $('#commisionRow,#buttonRow').show();
    });
    chrome.tabs.getSelected(null,function(tab) {
        //console.log('3');
        tablink = tab.url;
        var host = tablink.split('?')[0];
        if(is_taobao_item_page(tab.url) != false )
        {
            $("#urlTextbox").val(tablink);
            $('#query1').click();
            $('#titleDiv').html(tab.title).show();
            //$('#info1234').prop('src','http://easytk.com/?c=plugin&f=show_commision&url='+encodeURIComponent(tablink));
            //$('#commisionRow').show();
        }
        else{
            $("#urlTextbox").val("").focus();
            $('#commisionRow').hide();
        }

    });
    //console.log('12');
    document.querySelector('#queryButton').addEventListener('click', function(tab){
        if( $("#urlTextbox").val() == "" || is_taobao_item_page($("#urlTextbox").val()) == false)
        {
            return;
        }
        chrome.extension.sendMessage({action:'set',data:{
            item_link:$("#urlTextbox").val(),
            processing:true
        }}, function (response) {
            chrome.extension.sendMessage({action:'get'}, function (response2) {
                var loginUrl = '';
                if( response2.params['accountName'] )
                {
                    chrome.tabs.create({url: 'http://pub.alimama.com/index.htm'});
                }
                else{
                    var itemId = get_taobao_item_id( $("#urlTextbox").val() );
                    $.ajax({
                        url:'http://www.easytk.com/?c=plugin&f=get_taobaoke_link',
                        type:'post',
                        data:{item_id: itemId},
                        dataType:'json',
                        success:function( response ){
                            if( response.success == true )
                            {
                                chrome.tabs.create({url: response.data.link});
                            }
                            else
                            {
                                $("#queryButton").children('.buttonText').html('无法开启佣金');
                            }
                        }
                    });
                }
            });
        });

    });
});

