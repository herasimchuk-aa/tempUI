import { invaderServerAddress } from "../config";
(function () {
    let channelName = "invaentoryUpdate"
    let wsuri = 'ws://' + "172.17.146.87:8080" + '/ws/join?uname=' + channelName;
    let socket = new WebSocket(wsuri);

    socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
    
        console.log(data);

        switch (data.Type) {
        case 0: // JOIN
            break;
        case 1: // LEAVE
           
            break;
        case 2: // MESSAGE
            break;
        }
}
}())