import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Progress } from 'reactstrap';

class ProvisionProgress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openPro: true,
            executionId: 0,
            progress: 100,
            status: 'NOT_PROVISIONED',
            color: 'warning'
        }
    }

    cancel = () => {
        this.props.cancelPro()
    }

    render() {
        let { node } = this.props
        let color = this.state.color
        let status = this.state.status
        let progress = this.state.progress
        if (node && node.executionStatusObj) {
            if (node.executionStatusObj.Status) {
                color = node.executionStatusObj.Status == "FAILED" ? 'danger' : 'success'
                status = node.executionStatusObj.Status
            }
            progress = node.executionStatusObj.Progress
        }
        return (
            <Modal isOpen={this.state.openPro} toggle={() => this.cancel()} size="sm" centered="true" >
                <ModalHeader toggle={() => this.cancel()}> Provision </ModalHeader>
                <ModalBody>
                    <Progress animated color={color} value={progress} className="mb-3" />
                    {status}
                </ModalBody>
            </Modal>
        )
    }
}

export default ProvisionProgress