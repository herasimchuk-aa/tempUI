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
                if (window.provisionData) {
                    self.setState({ progress: window.provisionData.Progress, status: window.provisionData.Status, color: window.provisionData.Status == "FAILED" ? 'danger' : 'success' })
                    if (window.provisionData.Status == "FAILED" || window.provisionData.Status == "PROVISIONED" || window.provisionData.Status == "PARTIAL_PROVISIONED" || window.provisionData.Status == "FINISHED") {
                        self.setState({ progress: 100 })
                        clearInterval(timer);
                    }
                }
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