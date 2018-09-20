import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Progress } from 'reactstrap';
import { GET_PROVISION } from '../../apis/RestConfig';
import { getRequest } from '../../apis/RestApi';

class ProvisionProgress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openPro: true,
            executionId: 0,
            progress: 20,
            status: 'Provisioning is In Progress',
            color: 'success'
        }
    }

    static getDerivedStateFromProps(props, state) {
        return { openPro: props.openPro, executionId: props.executionId }
    }

    action = () => {
        if (this.props.action) {
            this.props.action()
        }
    }

    componentDidMount() {
        this.getprovision()
    }

    getprovision = () => {
        let self = this
        if (self.state.executionId) {
            let timer = setInterval(function () {
                getRequest(GET_PROVISION + self.state.executionId).then(function (json) {
                    self.setState({ progress: json.Progress, status: json.Status, color: json.Status == "FAILED" ? 'danger' : 'success' })
                    if (json.Status == "FAILED" || json.Status == "PROVISIONED" || json.Status == "PARTIAL_PROVISIONED" || json.Status == "FINISHED") {
                        self.setState({ progress: 100 })
                        clearInterval(timer);
                    }
                })
            }, 5000);
        }
    }

    cancel() {
        this.setState({ openPro: false })
        this.props.cancelPro()
    }

    render() {
        return (
            <Modal isOpen={this.state.openPro} toggle={() => this.cancel()} size="sm" centered="true" >
                <ModalHeader toggle={() => this.cancel()}> Provision </ModalHeader>
                <ModalBody>
                    <Progress animated color={this.state.color} value={this.state.progress} className="mb-3" />
                    {this.state.status}
                </ModalBody>
            </Modal>
        )
    }
}

export default ProvisionProgress