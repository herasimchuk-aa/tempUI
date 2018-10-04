import { invaderServerAddress } from "../config";
import I from 'immutable'
import { setNodes } from "../actions/nodeAction";

export default class Socket {

    constructor(store) {
        this.store = store
    }

    initWebSocket() {
        let channelName = "inventoryUpdate"
        let wsuri = 'ws://' + "172.17.146.60:8080" + '/ws/join?uname=' + channelName;
        let socket = new WebSocket(wsuri);
        let self = this
        socket.onmessage = function (event) {
            var data = JSON.parse(event.data);

            console.log(data);

            switch (data.Type) {
                case 0: // JOIN
                    break;
                case 1: // LEAVE

                    break;
                case 2: // MESSAGE
                    let state = self.store.getState()
                    let nodes = state.nodeSummary && state.nodeSummary.size ? state.nodeSummary.getIn(['nodes']) : I.List()
                    if (nodes && nodes.size) {
                        nodes = nodes.map(function (node) {
                            if (node.get('Id') === data.Content.NodeId) {
                                node = node.set('executionStatusObj', I.fromJS(data.Content))
                            }
                            return node
                        })
                    }
                    self.store.dispatch(setNodes(nodes))
                    break;
            }
        }
    }
}

