

angular.module('mashup', [], function (){
    console.log('Mashup module initialised');

    var iframe = document.getElementById('theFrame');
    var message = {
        command: 'render',
        context: {thing: 'world'}
    };
    iframe.contentWindow.postMessage(message, '*');


    window.addEventListener('message', function(event) {
        if (event.data.html) {
            console.log('Returned = ', event.data.html);
//            var notification = webkitNotifications.createNotification(
//                'icon.png',
//                'Templated!',
//                'HTML Received for "' + event.data.name + '": `' + event.data.html + '`'
//            );
//            notification.show();
        }
    });

//
//    $.get("https://www.google.com").success(
//        function(data) {
//            console.log('data = ', data);
//        });
});