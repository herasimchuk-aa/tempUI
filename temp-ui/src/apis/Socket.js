import { invaderServerAddress } from "../config";
// (function () {
//     let channelName = "inventoryUpdate"
//     let wsuri = 'ws://' + invaderServerAddress + '/ws/join?uname=' + channelName;
//     let socket = new WebSocket(wsuri);

//     socket.onmessage = function (event) {
//         var data = JSON.parse(event.data);

//         console.log(data);

//         switch (data.Type) {
//             case 0: // JOIN
//                 break;
//             case 1: // LEAVE

//                 break;
//             case 2: // MESSAGE
//                 window.provisionData = data.Content
//                 break;
//         }
//     }
// }())

export class WebSocket {
    initWebSocket() {
        let channelName = "inventoryUpdate"
        let wsuri = 'ws://' + "172.17.146.60:8080" + '/ws/join?uname=' + channelName;
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
                    window.provisionData = data.Content
                    break;
            }
        }
    }
}

