chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if(request.action == 'get'){
            sendResponse({params:localStorage});
        }else if(request.action == 'set'){
            for(var o in request.data){
                localStorage[o] = request.data[o];
            }
            sendResponse({});
        }
    }
);