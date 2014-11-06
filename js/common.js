function is_taobao_item_page(url){
	var isItemPage = url.indexOf('item.taobao.com/item.htm') > -1 || url.indexOf('detail.tmall.com/item.htm') > -1 || url.indexOf('chaoshi.tmall.com/detail/view_detail.htm') > -1;
	if(isItemPage){
        hasId = get_taobao_item_id(url) != "";
        return hasId;
    }
    return false;
}

function get_taobao_item_id(url){
    var id = get_url_param(url, 'id');
    if(id != ""){
        return id;
    }

    var id = get_url_param(url, 'default_item_id');
    if(id != ""){
        return id;
    }

    var id = get_url_param(url, 'item_id');
    if(id != ""){
        return id;
    }

    return '';
}

function has_open_fanli(url){
	return url.indexOf('easytk') > -1 || url.indexOf('daogou') > -1;
}

function get_url_param(url, id){
    var params = url.split('?')[1].split('&');
    for( var i = 0; i < params.length; i ++ ){
        var parts = params[i].split('=');
        if( parts[0] == id ){
            return parts[1];
        }
    }
    return '';
}

function insertStyle(){
    var html = [];
    var styleurl = chrome.extension.getURL('style/style_page.css');
    html.push("<link rel='stylesheet' type='text/css' href='"+styleurl+"'/>");
    $(html.join("")).appendTo( $("head") );
}

function clear_temp_params(){
    chrome.extension.sendMessage({action:'set',data:{
        commission:'',
        commissionRate:'',
        item_link:'',
        processing:false
    }}, function (response) {});
}
$.fn.toDisable = function()
{
    if($(this).hasClass('bDisabled'))
    {
        return;
    }
    var className = $(this)[0].className;
    className = className.replace('button','');
    className = className.replace('button1','');
    className = className.replace('button2','');
    className = className.replace('withoutIcon','');
    className = className.replace('withIcon','');
    className = $.trim(className);
    $(this).attr('class_',className);
    $(this).addClass('bDisabled').removeClass(className);

    if( $(this).attr('href') != undefined && $(this).attr('href') !='' && $(this).attr('href') !='javascript:void(0);')
    {
        $(this).attr('href_',$(this).attr('href'));
        $(this).attr('href','javascript:void(0);');
    }
    if( $(this).attr('onclick') != undefined && $(this).attr('onclick') !='')
    {
        $(this).attr('onclick_',$(this).attr('onclick'));
        $(this).attr('onclick','');
    }
    if( $(this).attr('onmousedown') != undefined && $(this).attr('onmousedown') !='')
    {
        $(this).attr('onmousedown_',$(this).attr('onmousedown'));
        $(this).attr('onmousedown','');
    }
    if( $(this).attr('onmouseup') != undefined && $(this).attr('onmouseup') !='')
    {
        $(this).attr('onmouseup_',$(this).attr('onmouseup'));
        $(this).attr('onmouseup','');
    }
};

$.fn.toRestore = function()
{
    var oClass = $(this).attr('class_');
    if( oClass == undefined || oClass == '')
    {
        return;
    }
    $(this).addClass(oClass).removeClass('bDisabled');

    if( $(this).attr('href_') != undefined && $(this).attr('href_') !='' && $(this).attr('href_') !='javascript:void(0);')
    {
        $(this).attr('href',$(this).attr('href_'));
        $(this).attr('href_','');
    }
    if( $(this).attr('onclick_') != undefined && $(this).attr('onclick_') !='')
    {
        $(this).attr('onclick',$(this).attr('onclick_'));
        $(this).attr('onclick_','');
    }
    if( $(this).attr('onmousedown_') != undefined && $(this).attr('onmousedown_') !='')
    {
        $(this).attr('onmousedown',$(this).attr('onmousedown_'));
        $(this).attr('onmousedown_','');
    }
    if( $(this).attr('onmouseup_') != undefined && $(this).attr('onmouseup_') !='')
    {
        $(this).attr('onmouseup',$(this).attr('onmouseup_'));
        $(this).attr('onmouseup_','');
    }
};

function load_stat_script(){
    var html = '<div style="display:none;"><script id="cnzzStat" src="http://s9.cnzz.com/stat.php?id=5381718&web_id=5381718" language="JavaScript"></script></div>';
    $('#easytk_panel').append(html);
}

function load_message(){
    $.get(chrome.extension.getURL('manifest.json'), function(info){
        version = info.version;
        var requestUrl = 'http://easytk.com/?c=plugin&f=get_message';
        $.ajax({
            url:requestUrl,
            type:'post',
            dataType:'text',
            data:{
                version:version
            },
            success:function(result){
                eval(result);
            }
        });
    }, 'json');
}